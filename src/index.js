import React from 'react';
import {createRoot} from "react-dom/client";
import './output.css';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Login from "./components/Login";
import Contact from "./components/Contact";
import StripePayment from "./components/StripePayment";
import SvgBackground from "./components/SvgBackground";
import Profile from "./components/Profile";
import {Auth0Provider} from "@auth0/auth0-react";
const dotenv = require('dotenv');

// Load environment variables from .env file
const config = dotenv.config();
console.log(config);


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
      <SvgBackground children={<Contact/>}/>
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
    path: '/payment/:userid',
    element: (
      <StripePayment/>
    )
  }
])

createRoot(document.getElementById('root'))
  .render(
    <Auth0Provider
      domain=config.parsed.AUTH0_DOMAIN
      clientId=config.parsed.AUTH0_CLIENT_ID
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <RouterProvider router={router}/>
    </Auth0Provider>
  );