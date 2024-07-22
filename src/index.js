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
    .render(
        <div className={'container-lg text-3xl font-sans items-center text-center justify-normal bg-black text-white p-44'}>
            <h3>my name is <span className={'text-blue-400'}>Bunker</span></h3>
            <h3>my owner is <span className={'text-red-400'}>Eric Bowser</span></h3>
            <h3 className={'text-orange-400'}>5154 S 5200 W</h3>
            <h3>Kearns, UT, 84118</h3>
            <h3 className={'text-green-400 bolder'}>(435) 494 - 8030</h3>
        </div>
/*
<RouterProvider router={router}/>
*/
)
;