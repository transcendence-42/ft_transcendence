import {render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import NavBar from '../Components/Tools/NavBar/NavBar';

describe('NavBar tests', () => {
    test('Home from "PONG" work - NavBar: off', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
            )
        const link = screen.getByText('PONG');
        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/");
    });
    test('Home from "Home" work - NavBar: off', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
            )
        const link = screen.getByText('Home');
        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/");
    });
    test('Login page from "About" and "Login" work - NavBar: off', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>);
        const link = screen.getByText('About');

        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/about");
    });
    test('Chat page from "Leaderboard" work - NavBar: off' , () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>);
        const link = screen.getByText('Leaderboard');
        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/leaderboard");
    });
  });

