/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor, getByRole, getByLabelText } from '@testing-library/react';
import Login from '../components/Login';
import {it, describe, expect, jest, beforeEach, afterAll} from "@jest/globals";
import {Auth0Provider} from "@auth0/auth0-react"; 


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn().mockReturnValue(mockNavigate),
}));

const mockAuth0 = {
  isAuthenticated: true,
  user: {
    name: 'Test User',
    email: 'test@example.com',
    sub: 'test|123456789'
  },
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
  getAccessTokenSilently: jest.fn().mockResolvedValue('test-token')
};

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockAuth0,
}));

describe('LoginForm', () => {
  it('renders the form', async () => {
    render(<Login />);
    const signIn = screen.getByRole('button', {name:'Register / Sign In'});
    expect(signIn).toBeDefined()
    fireEvent.click(signIn);
    
    await waitFor(() => {
      expect(mockAuth0.loginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
  
  afterAll(() => {
    jest.clearAllMocks();
  })
});
