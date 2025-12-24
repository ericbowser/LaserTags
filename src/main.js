import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Contact from "./components/Contact";
import StripePayment from "./components/StripePayment";
import SvgBackground from "./components/SvgBackground";
import Profile from "./components/Profile";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "./components/ThemeProvider";
import "./styles/input.css";
import "./styles/output.css";
import { VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID } from "../env.json";
import App from "./components/App";
import MaterialSelection from "./components/MaterialSelection";
import QrcodeGenerator from "./components/QrcodeGenerator";
import OrderSuccess from "./components/OrderSuccess";

// Get environment variables - making sure they're accessible
const domain = VITE_AUTH0_DOMAIN;
const clientId = VITE_AUTH0_CLIENT_ID;

const url = window.URL || window.webkitURL;
console.log("URL: ", url);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <App />
      </div>
    ),
  },
  {
    path: "/create-tag",
    element: (
      <div>
        <MaterialSelection />
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <SvgBackground>
        <Login />
      </SvgBackground>
    ),
  },
  {
    path: "/contact/:userid",
    element: (
      <SvgBackground>
        <Contact />
      </SvgBackground>
    ),
  },
  {
    path: "/profile/:userid",
    element: (
      <SvgBackground>
        <Profile />
      </SvgBackground>
    ),
  },
  {
    path: "/materials/:profileid",
    element: <StripePayment />,
  },
  {
    path: "/qrcode",
    element: (
      <div>
        <QrcodeGenerator />
      </div>
    ),
  },
  {
    path: "/order-success",
    element: (
      <div>
        <OrderSuccess />
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </ThemeProvider>
);
