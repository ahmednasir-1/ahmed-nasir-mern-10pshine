import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ForgotPassword from '../pages/ForgotPassword'
import * as userAPI from '../api/user.api'
import '@testing-library/jest-dom'

const renderForgotPassword = () => {
  render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  )
}

describe('ForgotPassword Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  

  it('should render forgot password form', () => {
    renderForgotPassword()
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument()
  })

  it('should render email input', () => {
    renderForgotPassword()
    expect(screen.getByPlaceholderText(/name@domain.com/i)).toBeInTheDocument()
  })

  it('should render send resend link button', () => {
    renderForgotPassword()
    expect(screen.getByRole('button', { name: /Send Recovery Link/i })).toBeInTheDocument()
  })

  it('should render back to login link', () => {
    renderForgotPassword()
    expect(screen.getByText(/Return To Login/i)).toBeInTheDocument()
  })

 

  it('should show error if email is empty', async () => {
    renderForgotPassword()

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    })
  })

 

  it('should allow user to type email', async () => {
    renderForgotPassword()

    const emailInput = screen.getByPlaceholderText(/name@domain.com/i)
    await userEvent.type(emailInput, 'john@gmail.com')

    expect(emailInput.value).toBe('john@gmail.com')
  })

  

  it('should call forgotPassword API with email', async () => {
    const mockForgot = vi.spyOn(userAPI, 'forgotPassword').mockResolvedValue({
      message: 'Reset link sent'
    })

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    await waitFor(() => {
      expect(mockForgot).toHaveBeenCalledWith('john@gmail.com')
    })
  })

  it('should show success state after sending email', async () => {
    vi.spyOn(userAPI, 'forgotPassword').mockResolvedValue({
      message: 'Reset link sent'
    })

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    await waitFor(() => {
      expect(screen.getByText(/Email Sent/i)).toBeInTheDocument()
    })
  })



  it('should show loading state while submitting', async () => {
    vi.spyOn(userAPI, 'forgotPassword').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    expect(screen.getByText(/Transmitting.../i)).toBeInTheDocument()
  })

  it('should disable button while loading', async () => {
    vi.spyOn(userAPI, 'forgotPassword').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    const button = screen.getByRole('button', { name: /Send Recovery Link/i })
    await userEvent.click(button)

    expect(button).toBeDisabled()
  })

 

  // it('should show error on API failure', async () => {
  //   vi.spyOn(userAPI, 'forgotPassword').mockRejectedValue(
  //     new Error('Network error')
  //   )

  //   renderForgotPassword()

  //   await userEvent.type(
  //     screen.getByPlaceholderText(/name@domain.com/i),
  //     'john@gmail.com'
  //   )

  //   await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

  //   await waitFor(() => {
  //     expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  //   })
  // })

  

  it('should show Resend Link button after success', async () => {
    vi.spyOn(userAPI, 'forgotPassword').mockResolvedValue({
      message: 'Reset link sent'
    })

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    await waitFor(() => {
      expect(screen.getByText(/Resend Link/i)).toBeInTheDocument()
    })
  })

  it('should go back to form when send again clicked', async () => {
    vi.spyOn(userAPI, 'forgotPassword').mockResolvedValue({
      message: 'Reset link sent'
    })

    renderForgotPassword()

    await userEvent.type(
      screen.getByPlaceholderText(/name@domain.com/i),
      'john@gmail.com'
    )

    await userEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }))

    await waitFor(() => {
      expect(screen.getByText(/Resend Link/i)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText(/Resend Link/i))

    // form should show again
    expect(screen.getByPlaceholderText(/name@domain.com/i)).toBeInTheDocument()
  })

  

})