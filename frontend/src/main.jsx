import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.tsx";
import Login from "./routes/Login.tsx";
import Register from "./routes/Register.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "app",
      element: <App/>
    },
    {
      path: "register",
      element: <Register/>
      
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />
    }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
