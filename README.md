## Property files

Some of these files are not checked into source countrol to protect the secrets to be exchanged between frontend and backend. In those cases they must be inserted in the root directory of both backend and frontend before starutp.

# backend:

Include the following files in a directory named 'props'.

# /props/auth_config.js

Raw text secrets for cookie and JWT creation are expected. Also set the token expiration times within this file:
cookieSecret: any string -- secret used to generate the cookies containing access tokens
jwtSecret: any string -- secret used to generate JSON web tokens which serve as access tokens
jwtAccessExpiration: number -- access token expiration -- in seconds, once expired a refresh token should be requested
jwtRefreshExpiration: number -- refresh token expiration -- in seconds, once expired a user will have to re-login

ex:
module.exports = {
cookieSecret: "your_cookie_secret",
jwtSecret: "your_JWT_secret",
jwtAccessExpiration: 300, // access token -- in seconds, once expired a refresh token should be requested
jwtRefreshExpiration: 600, // refresh token -- in seconds, once expired a user will have to re-login
};

# /props/cors_config_origins.js

This is a string array of allowed origins hosting the frontend. If devloping locally, make sure it includes your localhost.

ex:
module.exports = [
"http://localhost:8080",
"http://localhost:9999",
"http://192.168.1.63:8080",
];

Set the following environment variables in the OS where this is running.

# /props/cloudWatch_config.js

Required when running on AWS if you want Winston logging to be redirected into CloudWatch. Of course you will need to set up things as neccessary in any AWS task definition running the backend in a docker container, as well. NODE_ENV will need to be set to "aws" to trigger this in the environment variables.

ex:
module.exports = {
logGroupName: "/ecs/PokepainServiceFamily-backend",
logStreamName: "ecs/pokepain-backend/winston-stream",
awsRegion: "us-east-1",
awsAccessKeyId: "aws role access key",
awsSecretKey: "aws role secret key",
};

# environment variables

NODE_ENV - node environment for backend
POKEDEX_API_PORT - the port where the pokedex backend server will be lisening.
POKEDEX_ADMIN_PORT - the port for the pokedex backend's admin API.
POKEDEX_MONGO_HOST - hostname of mongo db instance where pokedex database is to be located.
POKEDEX_MONGO_PORT - port where mongo db is listening
POKEDEX_MONGO_NAME - database name for collections used by the backend

# frontend:

# .env & .env.{environment}

These are the Vite property files holding locations to the backend. .env and .env.local are checked into source countrol for examples. Any other
environment needs to be added to the root directory of frontend and include a command for running it in the scripts section of package.json.

Here are the properties which should be stored in the .env file:
VITE_POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/" -- the full URL of the online Poke API.

Here are the environment-specific properties stored in .env.{environment}

VITE_POKEDEX_HOST = "http://localhost" - host URL where backend (pokedex NodeJS service) will be running
VITE_POKEDEX_PORT = "7001" - host port where backend will be running
--the below are also both used in the frontend for the proxy address
VITE_FRONTEND_HOST = "http://localhost" - host URL where frontend (UI React app) will be running
VITE_FRONTEND_PORT= "8080" - host port where frontend will be running.
