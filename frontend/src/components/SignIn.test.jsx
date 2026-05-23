import SignIn from "./SignIn";
import { BrowserRouter } from "react-router-dom";
import { screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { login } from "../api/auth.api.js";
import * as authAPI from "../api/auth.api.js"


const renderLogin = () => {
    render(
        <BrowserRouter>
            <SignIn />
        </BrowserRouter>
    )
}

describe('Sign in Page Headings Text', () => {

    it('render text in SignIn Page', () => {
        renderLogin()

        expect(screen.getByText("Notes Application")).toBeInTheDocument()
        expect(screen.getByText("Welcome Back.")).toBeInTheDocument()
        
    })


})

describe('Sign In Form', () => {

    it('render signin form ', () => {
        renderLogin()

        expect(screen.getByPlaceholderText('name@domain.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
        expect(screen.getByRole("button", {
            name: /Login/i
        })).toBeInTheDocument()
    })

    it('allow user to name@domain.com', async()=>{
        renderLogin()
        const input = screen.getByPlaceholderText("name@domain.com")
        await userEvent.type(input, "ahmed@gmail.com")
        expect(input.value).toBe("ahmed@gmail.com") 
    })

    it('allow user to enter ••••••••', async()=>{
        renderLogin()
        const input = screen.getByPlaceholderText("••••••••")
        await userEvent.type(input, "abc123")
        expect(input.value).toBe("abc123") 
    })

    
})

describe('form Submission tests', ()=>{

    it('call login function when user submits the form', async ()=>{
        const checkLogin = vi.spyOn(authAPI, 'login').mockResolvedValue({
            email: 'ahmed@gmail.com',
            password : 'abc123'
        })

        renderLogin()
        await userEvent.type(screen.getByPlaceholderText('name@domain.com'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('••••••••'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Login/i
        }))

        await waitFor(()=>{
            expect(checkLogin).toHaveBeenCalledWith('ahmed@gmail.com', 'abc123')
        })
    })

    it('show error on failed login', async ()=>{
        const checkLogin = vi.spyOn(authAPI, 'login').mockRejectedValue({
            response: {data: {message: "Invalid Credentials"}}
        })

        renderLogin()
        await userEvent.type(screen.getByPlaceholderText('name@domain.com'), "wrongemail")
        await userEvent.type(screen.getByPlaceholderText('••••••••'), "wrongpass")
        await userEvent.click(screen.getByRole('button', {
            name: /Login/i
        }))

        await waitFor(()=>{
            expect(checkLogin).toHaveBeenCalledWith('wrongemail', 'wrongpass')
        })
    })

    it("show error when user email doesn't exist", async ()=>{
        const checkLogin = vi.spyOn(authAPI, 'login').mockRejectedValue({
           response: {data: {message: "User doesnot exist"}}
        })

        renderLogin()
        await userEvent.type(screen.getByPlaceholderText('name@domain.com'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('••••••••'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Login/i
        }))

        await waitFor(()=>{
            expect(checkLogin).toHaveBeenCalledWith('ahmed@gmail.com', 'abc123')
        })
    })

    it('show loading state when submitting', async ()=>{
        vi.spyOn(authAPI, 'login').mockImplementation(
            () => new Promise((resolve)=> setTimeout(resolve, 2000))
        )

        renderLogin()
        await userEvent.type(screen.getByPlaceholderText('name@domain.com'), "ahmed@gmail.com")
        await userEvent.type(screen.getByPlaceholderText('••••••••'), "abc123")
        await userEvent.click(screen.getByRole('button', {
            name: /Login/i
        }))

        expect(screen.getByText(/Logging In.../i)).toBeInTheDocument()
    })
})