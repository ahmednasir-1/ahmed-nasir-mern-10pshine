import SignUp from "./SignUp.jsx";
import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import * as authAPI from "../api/auth.api.js"



const renderSignUp = () => {
    render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    )
}

describe('Sign Up Page Headings Text', () => {

    it('render text in SignUp Page', () => {
        renderSignUp()
        expect(screen.getByText("Sign Up")).toBeInTheDocument()
    })


})

describe('Sign Up Form', () => {

    it('render signup form ', () => {
        renderSignUp()

        expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole("button", {
            name: /Create an Account/i
        })).toBeInTheDocument()
    })

    it('allow user to enter name ', async () => {
        renderSignUp()
        const input = screen.getByPlaceholderText("Enter your name")
        await userEvent.type(input, "ahmed")
        expect(input.value).toBe("ahmed")
    })

    it('allow user to enter email', async () => {
        renderSignUp()
        const input = screen.getByPlaceholderText("Enter email")
        await userEvent.type(input, "ahmed@gmail.com")
        expect(input.value).toBe("ahmed@gmail.com")
    })

    it('allow user to enter password', async () => {
        renderSignUp()
        const input = screen.getByPlaceholderText("Password")
        await userEvent.type(input, "abc123")
        expect(input.value).toBe("abc123")
    })


})

describe('form Submission tests', () => {

    it('call register function when user submits the form', async () => {
        const checkSignUp = vi.spyOn(authAPI, 'registerAPI').mockResolvedValue({
            name: "ahmed",
            email: 'ahmed@gmail.com',
            password: 'abc123'
        })

        renderSignUp()
        await userEvent.type(screen.getByPlaceholderText('Enter your name'), "ahmed")
        await userEvent.type(screen.getByPlaceholderText('Enter email'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('Password'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Create an Account/i
        }))

        await waitFor(() => {
            expect(checkSignUp).toHaveBeenCalledWith('ahmed', 'ahmed@gmail.com', 'abc123')
        })
    })

    it('show error if user already exists', async ()=>{
        const check = vi.spyOn(authAPI, 'registerAPI').mockRejectedValue({
            response: {data: {message: "User already exists"}}
        })

        renderSignUp()
        await userEvent.type(screen.getByPlaceholderText('Enter your name'), "name")
        await userEvent.type(screen.getByPlaceholderText('Enter email'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('Password'), "pass")
        await userEvent.click(screen.getByRole('button', {
            name: /Create an Account/i
        }))

        await waitFor(()=>{
            expect(check).toHaveBeenCalledWith('name','ahmed@gmail.com', 'pass')
        })
    })

    it("show error when user enter invalid email format", async () => {
        const checkSignUp = vi.spyOn(authAPI, 'registerAPI').mockRejectedValue({
            response: { data: { message: "Email format is invalid" } }
        })

        renderSignUp()
        await userEvent.type(screen.getByPlaceholderText('Enter your name'), "ahmed")
        await userEvent.type(screen.getByPlaceholderText('Enter email'), "wrongemail")
        await userEvent.type(screen.getByPlaceholderText('Password'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Create an Account/i
        }))

        await waitFor(() => {
            expect(checkSignUp).toHaveBeenCalledWith('ahmed', 'wrongemail', 'abc123')
        })
    })

    it('show loading state when submitting', async () => {
        vi.spyOn(authAPI, 'registerAPI').mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 2000))
        )

        renderSignUp()
        await userEvent.type(screen.getByPlaceholderText('Enter your name'), "ahmed")
        await userEvent.type(screen.getByPlaceholderText('Enter email'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('Password'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Create an Account/i
        }))

        expect(screen.getByText(/Signing Up.../i)).toBeInTheDocument()
    })
})