import { render, screen } from '@testing-library/react'
import NotFound from "../Pages/NotFound/notFound"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

describe("Testing of NotFound page", () => {
    describe("Notfound", () => {
        test("Page is displayed", () => {
            render(
                <BrowserRouter>
                    <NotFound/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('tracker');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

