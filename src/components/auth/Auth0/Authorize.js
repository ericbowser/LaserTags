import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";

export const useAuth = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();

  async function login() {
    console.log('Logging in with redirect...');
    await loginWithRedirect();
  };

  async function handleLogout() {
    console.log('handling logout...');
    await logout({returnTo: window.location.origin});
  };

  async function getToken() {
    try {
      console.log('Getting token...');
      const token = await getAccessTokenSilently();
      console.log('token fetched: ', token);
      return token;
    } catch (error) {
      console.error("Error getting token", error);
      return null;
    }
  }

  const saveContactToAuth0 = async (body = {}) => {
    try {
      const token = await getAccessTokenSilently();
      console.log('save contact token: ', token);
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await axios.post(
        process.env.AUTH0_MANAGEMENT_API,
        body,
        { headers }
      );

      if (response.status === 201) {
        return response.data;
      } else {
        console.error('Failed to save contact', response);
        return null;
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout: handleLogout,
    saveContactToAuth0
  }
}
