import {render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import About from '../Pages/About/about';
import '@testing-library/jest-dom'

describe("Testing of About page", () => {
    describe("About", () => {
        test("Page is displayed", () => {
            render(
            <BrowserRouter>
                <About/>
            </BrowserRouter>
            )
            const NotFoundElement = screen.getByTestId('tracker');
            expect(NotFoundElement).toBeInTheDocument();
         })
     })
})
