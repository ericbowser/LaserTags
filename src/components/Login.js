import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../api/tagApi';
import sendEmail from "../api/emailApi";
import '../output.css';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

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

  async function handleSubmit(e) {
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
  }

  return (
    <Container className={'m-52 p-4 text-white bolder bg-black border-2 backdrop-contrast-75'}>
      <Form onSubmit={handleSubmit}>
        <FormLabel>
          Email
        </FormLabel>
        <FormControl
          onChange={handleUsernameChange}
          as="input"
          type="email"
          id="email"
          required
        />
        <FormLabel>
          Password
        </FormLabel>
        <FormControl
          onChange={handlePasswordChange}
          as="input"
          type="password"
          id="password"
          required
        />
        <Button
          type="submit"
          disabled={!email || !password || email.trim() === '' || password.trim() === ''}
          className={` mt-4 align-middle p-2 mr-2 flex justify-center border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            !email || !password || email.trim() === '' || password.trim() === ''
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Sign In
        </Button>
      </Form>
    </Container>
  );
}

export default Login;