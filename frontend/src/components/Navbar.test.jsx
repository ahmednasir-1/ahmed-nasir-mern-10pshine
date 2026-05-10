import Navbar from "./Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";


const renderNavbar = (props = {}) => {
    render(
        <BrowserRouter>
            <Navbar
                search={props.search || ''}
                setSearch={props.setSearch || vi.fn()} />
        </BrowserRouter>
    )
}

describe('Navbar', () => {

    it('render create note button', () => {
        renderNavbar()
        expect(screen.getByRole('button', { name: /Create Note/i })).toBeInTheDocument()
    })

    it('render search bar', () => {
        renderNavbar()
        expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument()
    })

    it('call setSearch when user types in search bar', async () => {
        const setSearch = vi.fn();
        renderNavbar({ setSearch })

        await userEvent.type(screen.getByPlaceholderText(/search/i), 'my note')

        expect(setSearch).toHaveBeenCalled()
    })

    it('route to notes/new when user clicks on Create Note Button', async () => {

        renderNavbar()

        const button = screen.getByRole('button', { name: /Create Note/i })
        await userEvent.click(button)

        expect(window.location.pathname).toBe('/notes/new')

    })


})