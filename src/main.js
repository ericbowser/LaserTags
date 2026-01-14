import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Contact from "./components/contact/Contact";
import StripePayment from "./components/checkout/StripePayment";
import Profile from "./components/contact/Profile";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import App from "./components/App";
import MaterialSelection from "./components/material/MaterialSelection";
import QrcodeGenerator from "./components/tag/QrcodeGenerator";
import OrderSuccess from "./components/checkout/OrderSuccess";
import ErrorBoundary from "./components/ErrorBoundary";
import { initSentry } from "./config/sentry";
import * as Sentry from "@sentry/react";
import "./assets/styles/output.css";
import "./assets/styles/input.css";

// Initialize Sentry BEFORE React renders
initSentry();


// Get environment variables - making sure they're accessible
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

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
    errorElement: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">Please check the browser console for details.</p>
        </div>
      </div>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/contact/:userid",
    element: <Contact />,
  },
  {
    path: "/profile/:userid",
    element: <Profile />,
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

// Wrap RouterProvider with Sentry for route tracking
const SentryRouterProvider = Sentry.withSentryReactRouterV7Routing(RouterProvider);

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <ThemeProvider>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <SentryRouterProvider router={router} />
      </Auth0Provider>
    </ThemeProvider>
  </ErrorBoundary>
);
