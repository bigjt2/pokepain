import "../App.css";
import { Form, useNavigate } from "react-router-dom";
import { BaseSyntheticEvent, useState, useRef } from "react";
import trainerService from "../services/trainerService";
import Alert from "../components/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const alertRef = useRef<any>();

  const login = () => {
    //TODO: validate each param
    trainerService.login(username, password).then(
      () => {
        navigate("/app");
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
  };

  return (
    <Form method="post" id="login-form">
      <div className="container" style={{ width: "50%" }}>
        <div
          className="row"
          style={{ backgroundColor: "#301934", color: "white" }}
        >
          <h2 style={{ marginLeft: "1vw" }}>Pokemons Login</h2>
        </div>
        <div className="row">
          <div className="col">Username: </div>
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
          <div className="col">
            <button className="btn btn-primary" type="button" onClick={login}>
              Login
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>

        <Alert ref={alertRef} />
      </div>
    </Form>
  );
}
