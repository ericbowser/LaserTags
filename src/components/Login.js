import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {loginBackendLaser} from '../api/tagApi';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import {useAuth} from './Auth0/Authorize';
import {LoginButton, LogoutButton} from "./Auth0/LoginLogoutButton";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [userid, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState(false);

  // Auth0 hook to get authentication status and user info
  const {login, isAuthenticated, isLoading, user} = useAuth();

  // If already authenticated with Auth0, set user ID and redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      // Extract user ID from Auth0 user object (adjust as needed)
      console.log('User returned from Auth0: ', user);
      const auth0UserId = user.sub.split('|')[1];
      setUserId(auth0UserId);
      setIsLoggedIn(true);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
  }, [email, password, spinner]);

  useEffect(() => {
  }, [email]);


  useEffect(() => {
    if (isAuthenticated && userid) {
      navigate(`/contact/${userid}`);
    }
  }, [userid, isLoggedIn]);

  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  async function handleLoginBackendLaser(e) {
    setIsLoggingIn(true);
    setError('');

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoggingIn(false);
      return;
    }
    const loggedInUser = await loginBackendLaser(body)
    if (loggedInUser) {
      console.log('logged in user: ', loggedInUser);
      setUserId(loggedInUser);
      setIsLoggedIn(true);
      console.log('logged in User: ', loggedInUser);
      return loggedInUser;
    } else {
      setIsLoggedIn(false);
      console.log('failed to log in');
    }

    setSpinner(false);
    return null;
  }

  // Handle login button click
  async function handleLogin() {
    const res = await login();
    console.log('login response: ', res);
  };

/*  if (isLoading) {
    return (
      <Container className="m-52 p-4 text-white bolder bg-black border-2 backdrop-contrast-75">
        <div>Loading authentication status...</div>
      </Container>
    );
  }*/

  return (
    <Container className={'m-52 p-4 text-white bolder bg-black border-2 backdrop-contrast-75'}>
      {/* Auth0 Login Button */}
      <div className="mb-5">
        <h3 className="mb-3">Sign in with Social Media</h3>
        <LoginButton/>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black text-white">Or continue with email</span>
        </div>
      </div>
      <Button
        id={'Login'}
        type="submit"
        onClick={handleLogin}
        className={'mt-4 align-middle p-2 mr-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '}
      >
        Register / Sign In
      </Button>
      <LogoutButton/>
    </Container>
  );
}

export default Login;