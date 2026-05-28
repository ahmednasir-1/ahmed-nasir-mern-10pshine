import Sidebar from "./Sidebar.jsx";
import { BrowserRouter} from "react-router-dom";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";


const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate // replace real useNavigate with mockNavigate
    }
})



const renderSidebar = async () => {
    localStorage.setItem('user', JSON.stringify(
        {
            name: 'Ahmed',
            email: 'ahmed@gmail.com'
        }
    ))
    
    render(
        <BrowserRouter>
            <Sidebar />
        </BrowserRouter>
    )
}


describe('Sidebar', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    })


    it('render side bar correctly', () => {
        renderSidebar()
        expect(screen.getByText(/All Notes/i)).toBeInTheDocument()
        expect(screen.getByText(/Trash/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
    })


    it('show user name from local storage', () => {
        renderSidebar()
        expect(screen.getByText('Ahmed')).toBeInTheDocument()

    })

    it('show user email from local storage', () => {
        renderSidebar()
        expect(screen.getByText('ahmed@gmail.com')).toBeInTheDocument()

    })

    it('show first letter of user name as avatar', () => {
        renderSidebar()
        expect(screen.getByText('A')).toBeInTheDocument()

    })

    it('navigate to /dashboard when user clicks on All Notes', async () => {
        renderSidebar()
        await userEvent.click(screen.getByText(/All Notes/i))

        expect(globalThis.location.pathname).toBe('/dashboard')

    })

    it('navigate to /trash when user clicks on Trash', async () => {
        renderSidebar()
        await userEvent.click(screen.getByText(/Trash/i))

        expect(globalThis.location.pathname).toBe('/trash')

    })

    it('should clear local storage when user logouts', async () => {
        renderSidebar()
        await userEvent.click(screen.getByRole("button", {name: /Logout/i}))

        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
    })


})