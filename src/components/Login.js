import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../api/tagApi';
import sendEmail from "../api/emailApi";
import '../output.css';
import SvgComponent from "./SvgImage";

function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [userid, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alreadyHasAccount, setAlreadyHasAccount] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    }, [email, password, spinner, alreadyHasAccount]);
    
    useEffect(() => {
    }, [email]);
    
   async function sendTheEmail() {
       const emailSent = await sendEmail(email); 
       console.log('email sent: ', emailSent);
       if (emailSent) {
           setEmailSent(true);
       }
       setEmailSent(false);
    }

    useEffect(() => {
        if (userid) {
            navigate(`/contact/${userid}`)
        }
    }, [userid, isLoggedIn]);
   
    const handleUsernameChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    async function handleSubmit(e)  {
        e.preventDefault();
        const body = {
            email,
            password
        };
        const loggedInUser = await login(body)
        if (loggedInUser) {
            console.log('logged in user: ', loggedInUser);
            setUserId(loggedInUser);
            return loggedInUser;
        }

        console.log(loggedInUser);
        setSpinner(false);
        return null;
    };

    return (
/*
        <div>

            <SvgComponent />
        </div>
*/
        <div className="bg-gray-800 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-screen-md border-black border-2 shadow-lg shadow-blue-700">
                <form className="space-y-6 py-8" onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="email" className="w-32 block text-xl font-medium text-gray-700">
                           Email 
                        </label>
                        <input
                            onChange={handleUsernameChange}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="password" className="w-32 block text-xl font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            onChange={handlePasswordChange}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className={'flex m-28'}>
                        <button
                            type="submit"
                            disabled={!email || !password || email.trim() === '' || password.trim() === ''}
                            className={`align-middle p-2 mr-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                !email || !password || email.trim() === '' || password.trim() === ''
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;