import React from 'react';
import {createRoot} from "react-dom/client";
import './output.css';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Login from "./components/Login";
import Contact from "./components/Contact";
import StripePayment from "./components/StripePayment";
import SvgBackground from "./components/SvgBackground";

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
      <Contact/>
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
    <RouterProvider router={router}/>
  )