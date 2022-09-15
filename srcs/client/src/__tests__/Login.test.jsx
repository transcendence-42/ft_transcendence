import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Login from '../Pages/Login/Login';

describe("Testing of Login page", () => {
    describe("Login", () => {
        test("Page is displayed", () => {
            render(
                <BrowserRouter>
                    <Login/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('tracker');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

