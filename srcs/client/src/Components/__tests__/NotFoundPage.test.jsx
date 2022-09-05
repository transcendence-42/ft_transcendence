import {render, screen, cleanup } from '@testing-library/react'
import NotFound from "../../Pages/NotFound/notFound"
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import {Routes, Route} from 'react-router-dom';


/** Test E2E tester robot, Integration checks component in its environment , Unit test a component alone  **/
//A test block has to be organized by 1.render a component -> Find Elements we want to interact -> 3. Interact -> 4 assert the result is good 
describe("Testing of NotFound page", () => {
    describe("Notfound", () => {
        test("NotFound", () => {
            render(
                <BrowserRouter>
                    <NotFound/>
                </BrowserRouter>
                )
                const NotFoundElement = screen.getByTestId('message');
                expect(NotFoundElement).toBeInTheDocument();
            })
        })
    })

