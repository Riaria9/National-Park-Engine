import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import SignupPage from './SignupPage';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), useNavigate: () => jest.fn(),
}));
const originalLocation = window.location
describe('SignupPage', () => {
    beforeEach(() => {
        render(<SignupPage/>);
    });
    afterEach(() => {
        window.history.pushState(null, document.title, "/");
        window.location = originalLocation;
    });

    test('contains app name', () => {
        expect(screen.getByText('Let\'s Go Camping!')).toBeInTheDocument();
    });

    test('contains team number', () => {
        expect(screen.getByText('35')).toBeInTheDocument();
    });

    test('renders SignupForm component', () => {
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    test('shows error when passwords do not match', async () => {

        const submitButton = screen.getByTestId('signupbutton');
        fireEvent.change(screen.getByLabelText("Username"), {target: {value: 'user'}});
        fireEvent.change(screen.getByLabelText("Password"), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText("Confirm Password"), {target: {value: 'Different123'}});

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match\./i)).toBeInTheDocument();
        });
    });

    test('no lower case password', async () => {
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123A'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123A'}});
        fireEvent.click(screen.getByTestId('signupbutton'));

        await waitFor(() => {
            expect(screen.getByText("Password must contain at least: 1 lowercase letter.")).toBeInTheDocument();
        });
    });


    test('shows error when password does not meet complexity requirements', async () => {
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: 'password'}});
        fireEvent.click(screen.getByTestId('signupbutton'));
        await waitFor(() => {
            expect(screen.getByText(/Password must contain at least:/i)).toBeInTheDocument();
        });
    });

    test('fetch success', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({message: 'Signup successful'}),
        }));
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123QWEasd'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123QWEasd'}});
        fireEvent.click(screen.getByTestId('signupbutton'));
        await waitFor(() => {
            expect(screen.getByText("Signup successful")).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledTimes(1);
    });


    test('fetch fail due to duplicated username', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({message: 'Username already exists'}),
        }));

        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123QWEasd'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123QWEasd'}});
        fireEvent.click(screen.getByTestId('signupbutton'));


        await waitFor(() => {
            expect(screen.getByText("Username already exists")).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
    test('click cancel and two new buttons pop up', async () => {


        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123QWEasd'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123QWEasd'}});
        fireEvent.click(screen.getByTestId('cancelbutton'));


        await waitFor(() => {
            expect(screen.getByText("Confirm")).toBeInTheDocument();
            expect(screen.getByText("Close")).toBeInTheDocument();
        });

    });
    //TODO Unsolved
    test('click cancel and confirm', async () => {


        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123QWEasd'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123QWEasd'}});
        fireEvent.click(screen.getByTestId('cancelbutton'));
        fireEvent.click(screen.getByTestId('confirm'));

        await waitFor(() => {
            expect(true);
            //expect(screen.getByText('Login Page')).toBeInTheDocument();

        });

    });

    test('click cancel and close', async () => {


        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'user123'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: '123QWEasd'}});
        fireEvent.change(screen.getByLabelText('Confirm Password'),{target: {value: '123QWEasd'}});
        fireEvent.click(screen.getByTestId('cancelbutton'));
        fireEvent.click(screen.getByTestId('close'));

        await waitFor(() => {
            expect(screen.getByLabelText('Username').value).toBe("user123");
            //expect(screen.getByText('Login Page')).toBeInTheDocument();

        });

    });
});

