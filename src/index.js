import React from 'react';
import {createRoot} from "react-dom/client";
import './output.css';
import App from "./App";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <App/>
        )
    },
    {
        path: '/login',
        element: (
            <Login/>
        )
    },
    {
        path: `/:userid`,
        element: (
            <Profile customerId={1}/>
        )
    }
])

createRoot(document.getElementById('root') )
    .render(<RouterProvider router={router} />);