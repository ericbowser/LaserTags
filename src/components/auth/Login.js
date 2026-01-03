import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getContact, loginBackendLaser} from '../../api/tagApi';
import {useAuth} from './Auth0/Authorize';
import {LoginButton, LogoutButton} from "./Auth0/LoginLogoutButton";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [userid, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState(false);

  // Auth0 hook to get authentication status and user info
  const {login, isAuthenticated, isLoading, user} = useAuth();

  // Login.js
  useEffect(() => {
    // Add logging to see the state right when the effect runs in the test
    console.log('Login Effect Check:', { isAuthenticated, isLoading, userExists: !!user, userSub: user?.sub });

    if (isAuthenticated && !isLoading && user) {
      // Use optional chaining to safely access 'sub' and then split
      const subParts = user?.sub?.split('|'); // Safely split user.sub if it exists
      const auth0UserId = subParts?.[1]; // Get the second part if split was successful

      // Check if we actually got the ID
      if (auth0UserId) {
        const userPayload = { // Renamed to avoid shadowing 'user' from useAuth
          username: user.name,
          userId: auth0UserId,
          pictureurl: user.picture
        };

        // Call backend login
        loginBackendLaser(userPayload)
          .then(backendResponse => { // Use a more descriptive variable name
            console.log('Backend login successful for userid:', backendResponse?.userid); // Optional chaining for safety
            // Use data from the payload or response as appropriate
            setUsername(userPayload.username);
            setUserId(auth0UserId); // Set the ID we extracted
            setIsLoggedIn(true);
          })
          .catch(error => {
            // Handle potential errors from the backend login
            console.error('Backend login failed:', error);
            setError('Failed to sync login with backend.'); // Set an error state for the user
            setIsLoggedIn(false); // Ensure state is correct on error
          });
      } else {
        // Handle the case where user.sub was missing or didn't have the expected format
        console.error("Could not extract auth0UserId from user.sub:", user?.sub);
        setError("There was an issue processing your user profile."); // Inform the user
        setIsLoggedIn(false);
      }
    }
    // Add isLoading to dependencies if its change should re-trigger the effect
  }, [isAuthenticated, isLoading, user]); // Make sure isLoading is in the dependency array

  useEffect(() => {
    if (isAuthenticated && userid) {
      navigate(`/contact/${userid}`);
    }
  }, [userid, isLoggedIn]);

  async function handleLogin() {
    try {
      await login();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /*if (isLoading) {
    return (
      <Container className="m-52 p-4 text-white bolder bg-black border-2 backdrop-contrast-75">
        <div>Loading authentication status...</div>
      </Container>
    );
  }*/

  return (
    <div className={'m-52 p-4 text-white bolder bg-black border-2 backdrop-contrast-75'}>
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
          <span className="px-2 bg-black text-white">Or continue with user name</span>
        </div>
      </div>
      <button
        id={'Login'}
        type="submit"
        onClick={handleLogin}
        className={'mt-4 align-middle p-2 mr-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '}
      >
        Register / Sign In
      </button>
      <LogoutButton/>
    </div>
  );
}

export default Login;