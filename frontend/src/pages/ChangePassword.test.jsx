import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ChangePassword from '../pages/ChangePassword'
import * as userAPI from '../api/user.api'
import '@testing-library/jest-dom'

// mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// helper - renders with fake token in URL
const renderChangePassword = () => {
  render(
    <MemoryRouter initialEntries={['/reset-password/fake-token-123']}>
      <Routes>
        <Route path="/reset-password/:token" element={<ChangePassword />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ChangePassword Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  

 it('should render the page correctly', () => {
  renderChangePassword()

  // ✅ find by exact text in heading div
  expect(screen.getByText('Reset Password', {
    selector: 'div'  // ← only find div not button
  })).toBeInTheDocument()
})

  it('should render return to login link', () => {
    renderChangePassword()
    expect(screen.getByText(/return to login/i)).toBeInTheDocument()
  })

  it('should render new password input', () => {
    renderChangePassword()
    const inputs = screen.getAllByPlaceholderText('••••••••')
    expect(inputs[0]).toBeInTheDocument()
  })

  it('should render confirm password input', () => {
    renderChangePassword()
    const inputs = screen.getAllByPlaceholderText('••••••••')
    expect(inputs[1]).toBeInTheDocument()
  })

  it('should render reset password button', () => {
    renderChangePassword()
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument()
  })

  it('should render description text', () => {
    renderChangePassword()
    expect(screen.getByText(/enter and confirm your new password/i)).toBeInTheDocument()
  })

 

  it('should allow user to type in password field', async () => {
    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')

    expect(inputs[0].value).toBe('newpass123')
  })

  it('should allow user to type in confirm password field', async () => {
    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[1], 'newpass123')

    expect(inputs[1].value).toBe('newpass123')
  })

  

  it('should show error if passwords do not match', async () => {
    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'differentpass')  // ← different!

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.getByText(/password dont match/i)).toBeInTheDocument()
    })
  })

  it('should not call API if passwords do not match', async () => {
    const mockReset = vi.spyOn(userAPI, 'resetPassword')

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'differentpass')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    expect(mockReset).not.toHaveBeenCalled()
  })

 

  it('should call resetPassword API with token and password', async () => {
    const mockReset = vi.spyOn(userAPI, 'resetPassword').mockResolvedValue({
      message: 'Password reset successfully'
    })

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith('fake-token-123', 'newpass123')
    })
  })

  it('should show loading state while submitting', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should disable button while loading', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    const button = screen.getByRole('button', { name: /reset password/i })
    await userEvent.click(button)

    expect(button).toBeDisabled()
  })

  it('should show success message after reset', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockResolvedValue({
      message: 'Password reset successfully!'
    })

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByTitle(/Reset Password/i))

    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()  
    })
  })

  

  it('should show error from backend', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockRejectedValue({
      response: { data: { message: 'Invalid or expired reset token' } }
    })

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired reset token/i)).toBeInTheDocument()
    })
  })

  it('should show generic error on network failure', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockRejectedValue(
      new Error('Network error')
    )

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('should clear error when submitting again', async () => {
    vi.spyOn(userAPI, 'resetPassword').mockResolvedValue({
      message: 'Password reset successfully'
    })

    renderChangePassword()

    const inputs = screen.getAllByPlaceholderText('••••••••')

    // first submit with wrong passwords
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'differentpass')
    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.getByText(/password dont match/i)).toBeInTheDocument()
    })

    // fix passwords and submit again
    await userEvent.clear(inputs[1])
    await userEvent.type(inputs[1], 'newpass123')
    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(screen.queryByText(/password dont match/i)).not.toBeInTheDocument()
    })
  })

  

  it('should handle empty password fields', async () => {
    const mockReset = vi.spyOn(userAPI, 'resetPassword')

    renderChangePassword()

    // click without typing anything
    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith('fake-token-123', '')
    })
  })

  it('should use token from URL params', async () => {
    const mockReset = vi.spyOn(userAPI, 'resetPassword').mockResolvedValue({
      message: 'Password reset successfully'
    })

    render(
      <MemoryRouter initialEntries={['/reset-password/my-special-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ChangePassword />} />
        </Routes>
      </MemoryRouter>
    )

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'newpass123')
    await userEvent.type(inputs[1], 'newpass123')

    await userEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith('my-special-token', 'newpass123')
    })
  })

})