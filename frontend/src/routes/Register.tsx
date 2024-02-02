import "../App.css";
import { Form, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { BaseSyntheticEvent } from "react";
import trainerService from "../services/trainerService";
import Alert from "../components/Alert";

export default function Register() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [success, setSuccess] = useState(false);
  const alertRef = useRef<any>();
  const navigate = useNavigate();

  const register = () => {
    //TODO: validate
    if (password !== confirmPass) {
      alertRef.current.showAlert(`Passwords must match`, "danger");
    } else {
      trainerService.register(username, password).then(
        () => {
          alertRef.current.showAlert("Registration successful!", "success");
          setSuccess(true);
        },
        (error) => {
          console.error(error);
          const resMessage =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();

          alertRef.current.showAlert(resMessage, "danger");
        }
      );
    }
  };

  return (
    <Form method="post" id="register-form">
      <div className="container" style={{ width: "50%" }}>
        <Alert ref={alertRef} />
        {!success ? (
          <div className="container">
            <div
              className="row"
              style={{ backgroundColor: "#301934", color: "white" }}
            >
              <h2 style={{ marginLeft: "1vw" }}>Trainer Registration</h2>
            </div>

            <div className="row">
              <div className="col">Trainer Name: </div>
              <div className="col">
                <input
                  value={username}
                  type="text"
                  onChange={(e: BaseSyntheticEvent) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">Password: </div>
              <div className="col">
                <input
                  value={password}
                  type="text"
                  onChange={(e: BaseSyntheticEvent) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">Confirm Password: </div>
              <div className="col">
                <input
                  value={confirmPass}
                  type="text"
                  onChange={(e: BaseSyntheticEvent) => {
                    setConfirmPass(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={register}
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate("/login")}
              >
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
}
