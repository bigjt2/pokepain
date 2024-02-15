const winston = require("winston");
const WinstonCloudwatch = require("winston-cloudwatch");

//The statements in this method are directed at console as that will show up in a CloudWatch stream
//in case the transport configuration fails.
function setupCloudWatchForwarding() {
  console.info(
    "AWS enviornment detected. Scanning props folder for aws_config file."
  );
  import("../props/cloudWatch_config.js")
    .then((cloudWatchConfig) => {
      console.info(
        "aws_config found. Adding Winston transport to redirect Winston logs into CloudWatch."
      );
      if (cloudWatchConfig && cloudWatchConfig.default) {
        winston.add(new WinstonCloudwatch(cloudWatchConfig.default));
        console.log("CloudWatch transport added successfully.");
      } else {
        console.log(
          "Failed to add CloudWatch transport. Examine logging setup code for issues. Winston logs will not be captured."
        );
      }
    })
    .catch((error) => {
      console.error(`Error loading or finding aws_config: ${error}`);
    });
}

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: "./logs/poke-exceptions.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex; //unhandled promise rejections -- winston handleExceptions will not catch this.
  });
  winston.add(new winston.transports.File({ filename: "./logs/poke-log.log" }));

  if (process.env.NODE_ENV === "aws") {
    setupCloudWatchForwarding();
  }
};
