import React from 'react';
import {createRoot} from "react-dom/client";
import './output.css';
import App from "./App";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";

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
            <App />
        )
    }
])

createRoot(document.getElementById('root') )
    .render(<RouterProvider router={router} />);