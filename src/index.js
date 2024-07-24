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
        <div className={'flex flex-col text-3xl font-sans items-center text-center text-white bg-black justify-center min-h-screen'}>
            <h3>My name is <span className={'text-blue-400'}>Bunker</span></h3>
            <h3>My owner is <span className={'text-red-400'}>Eric Bowser</span></h3>
            <h3 className={'text-orange-400'}>5154 S 5200 W</h3>
            <h3 className={'text-purple-500'}>Kearns, UT, 84118</h3>
            <h3 className={'text-green-400 bolder'}>(435) 494 - 8030</h3>
        </div>
/*
<RouterProvider router={router}/>
*/
)
;