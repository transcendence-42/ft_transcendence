import {render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
<<<<<<< HEAD
import Chat from '../Pages/Chat/Chat';
=======
import Chat from '../Pages/Chat/good_chat';
>>>>>>> origin/justine_front_chat

describe("Testing of chat page", () => {
    describe("Chat", () => {
        test("Page is displayed", () => {
            render(
                <BrowserRouter>
                    <Chat/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('tracker');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

