import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import "@testing-library/jest-dom";

describe('App', () => {
    test('renders LoginPage by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        const loginPageElement = screen.getByText(/login page/i);
        expect(loginPageElement).toBeInTheDocument();
    });
});
