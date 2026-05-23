import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import UserProfile from '../pages/UserProfile'
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

// fake user data
const fakeUser = {
  _id: '1',
  name: 'John Doe',
  email: 'john@gmail.com',
  isVerified: true,
  createdAt: new Date().toISOString()
}

const renderProfile = () => {
  localStorage.setItem('token', 'fake-token')
  localStorage.setItem('user', JSON.stringify(fakeUser))

  render(
    <BrowserRouter>
      <UserProfile />
    </BrowserRouter>
  )
}

describe('UserProfile Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ─── Rendering Tests ───────────────────────

  it('should show loading state initially', () => {
    vi.spyOn(userAPI, 'getProfile').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderProfile()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render profile after fetching', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should show user email', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByDisplayValue('john@gmail.com')).toBeInTheDocument()
    })
  })

  it('should show first letter of name as avatar', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument()
    })
  })

  it('should show verified account badge', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText(/verified account/i)).toBeInTheDocument()
    })
  })

  it('should disable email input', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      const emailInput = screen.getByDisplayValue('john@gmail.com')
      expect(emailInput).toBeDisabled()
    })
  })

  // ─── Update Profile Tests ───────────────────

  it('should allow user to change name', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })

    const nameInput = screen.getByDisplayValue('John Doe')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')

    expect(nameInput.value).toBe('New Name')
  })

  it('should show success message after profile update', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)
    vi.spyOn(userAPI, 'updateProfile').mockResolvedValue({
      ...fakeUser,
      name: 'New Name'
    })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })

    const nameInput = screen.getByDisplayValue('John Doe')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument()
    })
  })

  it('should show error message if profile update fails', async () => {
  vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)  // ← always mock getProfile!
  vi.spyOn(userAPI, 'updateProfile').mockRejectedValue(
    new Error('Update failed')
  )

  renderProfile()

  await waitFor(() => {
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: /save changes/i })
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})

  it('should show loading state while saving', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)
    vi.spyOn(userAPI, 'updateProfile').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderProfile()

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    })

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await userEvent.click(saveButton)

    expect(screen.getByText(/saving/i)).toBeInTheDocument()
  })

  // ─── Change Password Tests ──────────────────

  it('should show error if passwords do not match', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'currentpass')
    await userEvent.type(inputs[1], 'newpass123')
    await userEvent.type(inputs[2], 'differentpass')  // ← different!

    const changeButton = screen.getByRole('button', { name: /change password/i })
    await userEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('should show success after password change', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)
    vi.spyOn(userAPI, 'changePassword').mockResolvedValue({
      message: 'Password changed successfully'
    })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'currentpass')
    await userEvent.type(inputs[1], 'newpass123')
    await userEvent.type(inputs[2], 'newpass123')

    const changeButton = screen.getByRole('button', { name: /change password/i })
    await userEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument()
    })
  })

  it('should show error if current password is wrong', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)
    vi.spyOn(userAPI, 'changePassword').mockRejectedValue({
      response: { data: { message: 'Current password is incorrect' } }
    })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'wrongpass')
    await userEvent.type(inputs[1], 'newpass123')
    await userEvent.type(inputs[2], 'newpass123')

    const changeButton = screen.getByRole('button', { name: /change password/i })
    await userEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('should clear password fields after success', async () => {
    vi.spyOn(userAPI, 'getProfile').mockResolvedValue(fakeUser)
    vi.spyOn(userAPI, 'changePassword').mockResolvedValue({
      message: 'Password changed successfully'
    })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const inputs = screen.getAllByPlaceholderText('••••••••')
    await userEvent.type(inputs[0], 'currentpass')
    await userEvent.type(inputs[1], 'newpass123')
    await userEvent.type(inputs[2], 'newpass123')

    const changeButton = screen.getByRole('button', { name: /change password/i })
    await userEvent.click(changeButton)

    await waitFor(() => {
      expect(inputs[0].value).toBe('')  // ← cleared!
      expect(inputs[1].value).toBe('')
      expect(inputs[2].value).toBe('')
    })
  })

 


})