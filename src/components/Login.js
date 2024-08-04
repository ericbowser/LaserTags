import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../api/tagApi';
import '../output.css';

/*
import { ClipLoader } from 'react-spinners';
*/

function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [userid, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alreadyHasAccount, setAlreadyHasAccount] = useState(null);
    const [spinner, setSpinner] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    }, [username, password, spinner, alreadyHasAccount]);

    useEffect(() => {
        if (userid) {
            navigate(`/contact/${userid}`)
        }
    }, [userid, isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinner(true);
        const body = {
            username,
            password
        };
        const loggedInUser = await login(body)
        if (loggedInUser) {
            console.log(loggedInUser);
            setUserId(loggedInUser.userid);
            setIsLoggedIn(true);
            setSpinner(false);
            return loggedInUser;
        }

        console.log(loggedInUser);
        setSpinner(false);
        return null;
    };

    return (
        <div className="bg-gray-800 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-screen-md border-black border-2 shadow-lg shadow-blue-700">
                <form className="space-y-6 py-8 ">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="username" className="w-32 block text-xl font-medium text-gray-700">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="password" className="w-32 block text-xl font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className={'flex m-28'}>

                        <button
                            type="submit"
                            className="align-middle p-2 mr-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign In
                        </button>
                        <button
                            type="submit"
                            className="align-middle p-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;