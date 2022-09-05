import {render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Leaderboard from '../Pages/Leaderboard/leaderboard';

describe("Testing of Leaderboard page", () => {
    describe("Leaderboard", () => {
        test("Page is displayed", () => {
            render(
                <BrowserRouter>
                    <Leaderboard/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('tracker');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

