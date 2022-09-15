import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Home from '../Pages/Home/home';

describe("Testing of Login page", () => {
    describe("Login", () => {
        test("Page is displayed", () => {
            render(
                <BrowserRouter>
                    <Home/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('tracker');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

