import { useAuth0 } from "@auth0/auth0-react";

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

  async function handleLogout(){
    console.log('handling logout...');
    await logout({ returnTo: window.location.origin });
  };

  async function getToken(){
    try {
      console.log('Getting token...');
      const token = await getAccessTokenSilently();
      console.log('token fetched: ', token);
      return token;
    } catch (error) {
      console.error("Error getting token", error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout: handleLogout,
    useAuth,
    getToken
  };
};