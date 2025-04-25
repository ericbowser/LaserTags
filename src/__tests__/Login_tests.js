/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor, getByRole, getByLabelText } from '@testing-library/react';
import Login from '../components/Login';
import {it, describe, expect, jest, beforeEach, afterAll, afterEach} from "@jest/globals";
import {loginBackendLaser} from "../api/tagApi";
import {useAuth} from "../components/Auth0/Authorize";

const mockNavigate = jest.fn();
const mockBackendLaser = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn().mockReturnValue(mockNavigate),
}));

jest.mock('../components/Auth0/LoginLogoutButton', () => ({
  LoginButton: () => <button>Mock Social Login</button>,
  LogoutButton: () => <button>Mock Logout</button>,
}));

const mockLogin = jest.fn();
const mockAuth0 = {
  isAuthenticated: true,
  user: {
    name: 'Test User',
    email: 'test@example.com',
    sub: 'test|123456789'
  },
  Login: mockLogin,
  loginWithRedirect: mockLogin,
  getAccessTokenSilently: jest.fn().mockResolvedValue('test-token')
};

jest.mock('../components/Auth0/Authorize', () => {
  return ({
    login: () => mockLogin.mockResolvedValue('123456789'),
    user: {
      name: 'Test User',
      email: 'test@example.com',
      sub: 'test|123456789'
    },
    isAuthenticated: true,
    isLoading: false,
    useAuth: () => mockAuth0
  });
});
jest.mock('@auth0/auth0-react', () => {
  return {
    loginWithRedirect: () => mockLogin.mockResolvedValue('123456789')
  }
})
jest.mock('../api/tagApi', () => ({
    loginBackendLaser: () => mockBackendLaser.mockResolvedValue(() => Promise.resolve('test-token'))
}));

describe('LoginForm', () => {
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the form', async () => {
    render(<Login />);
    const signIn = screen.getByRole('button', {name:'Register / Sign In'});
    expect(signIn).toBeDefined()
    
    fireEvent.click(signIn);
    
    await waitFor(() => {
      expect(mockAuth0.isAuthenticated).toBe(true);
      expect(mockBackendLaser({})).toReturnWith('test-token');
    });
  });
  
  afterAll(() => {
    jest.clearAllMocks();
  })
});
