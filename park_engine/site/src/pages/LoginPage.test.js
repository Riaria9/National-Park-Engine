import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        render(<LoginPage/>);
    });
    afterEach(() => {
        window.history.pushState(null, document.title, "/");
    });

    test('contains app name', () => {
        expect(screen.getByText('Let\'s Go Camping!')).toBeInTheDocument();
    });

    test('contains team number', () => {
        expect(screen.getByText('35')).toBeInTheDocument();
    });

    test('renders correctly', () => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('submits form with incorrect username and password', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({message: 'Incorrect login credentials'}),
            })
        );

        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password123'}});
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.getByText('Incorrect login credentials')).toBeInTheDocument();
        });
    });

    test('submits form with correct username and password', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({message: 'Login successful'}),
            })
        );

        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'existUser'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password'}});
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.getByText('Login successful')).toBeInTheDocument();
        });
    });

});
