/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import expect from "expect";
import {it, describe} from "@jest/globals";


describe('LoginForm', () => {
  it.only('renders the form', () => {
    render(<Login />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows error on invalid login', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Invalid username or password'
      );
    });
  });

  it('calls onLogin prop with correct data on valid login', async () => {
    const onLogin = jest.fn();
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({ username: 'testuser' });
    });
  });
  it('Does not show error on successful login', async ()=>{
    const onLogin = jest.fn();
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    });
  })
});