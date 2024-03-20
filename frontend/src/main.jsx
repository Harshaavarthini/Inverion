import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AgentHome } from "./pages/agent/Index";
import { Home } from "./pages/Home/Index";
import { InvHome } from "./pages/inventory/index.jsx";
import LoginForm from "./Components/LoginForm.jsx";
import { RegisterForm } from "./Components/RegisterForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/admin",
    element: <InvHome />,
  },
  {
    path: "/agent",
    element: <AgentHome />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
