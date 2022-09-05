import {render, screen, cleanup, fireEvent } from '@testing-library/react'
import NotFound from "../../Pages/NotFound/notFound"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import { createMemoryHistory } from "history"
import {Routes, Route , Router, Link} from 'react-router-dom';
import App from "../../App"
import NavBar from '../Tools/NavBar/NavBar';
import userEvent from '@testing-library/user-event'

describe('NavBar tests', () => {
    test('Home from "PONG" and "HOME" work', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>);
        const link = screen.getByTestId('HomeLink');
        //console.log(link);
        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/");
    });
    test('Login page from "About" and "Login" work', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>);
        const link = screen.getByText('About');
        //console.log(link);
        fireEvent.click(link);
        expect(window.location.href).toBe("http://localhost/about");
    });
  });

