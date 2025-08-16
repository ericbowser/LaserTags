import React from 'react';
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Login from "./components/Login";
import Contact from "./components/Contact";
import StripePayment from "./components/StripePayment";
import SvgBackground from "./components/SvgBackground";
import Profile from "./components/Profile";
import {Auth0Provider} from "@auth0/auth0-react";
import './input.css';

// Get environment variables - making sure they're accessible
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
console.log(domain);
console.log(clientId);

const url = window.URL || window.webkitURL;
console.log('URL: ', url);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SvgBackground children={<Login/>}/>
    )
  },
  {
    path: '/login',
    element: (
      <SvgBackground>
        <Login/>
      </SvgBackground>
    )
  },
  {
    path: '/contact/:userid',
    element: (
      <SvgBackground >
        <Contact/>
      </SvgBackground>
    )
  },
  {
    path: '/profile/:userid',
    element: (
      <SvgBackground >
        <Profile/>
      </SvgBackground>
    )
  },
  {
    path: '/materials/:profileid',
    element: (
      <StripePayment/>
    )
  }
])

createRoot(document.getElementById('root'))
  .render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <RouterProvider router={router}/>
    </Auth0Provider>
  );