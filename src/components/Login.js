import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {login} from '../api/tagApi';
/*
import { ClipLoader } from 'react-spinners';
*/

function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [userId, setUserId] = useState(null);
/*
    const [spinner, setSpinner] = useState(false);
*/
    
    const navigate = useNavigate();

    useEffect(() => {
    }, [username, password, userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            username,
            password
        }
        return login(body)
            .then(res => {
                console.log('response: ', res);
                setUserId(res.userid);
                navigate(`/contact/${res.userid}`);
                return res;
            })
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            User Name
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="User Name"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {userId && (
                    <span className={'text-2xl text-green-400 bolder'}>User Id: {userId}</span>
                )}
            </div>
        </div>
    );
}

export default Login;