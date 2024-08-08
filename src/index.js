import React from 'react';
import {createRoot} from "react-dom/client";
import './output.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import Contact from "./components/Contact";
import App from "./App";
import './output.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Login/>
        )
    },
    {
        path: '/contact/:userid',
        element: (
            <Contact />
        )
    }
])

createRoot(document.getElementById('root') )
    .render(<RouterProvider router={router} />);