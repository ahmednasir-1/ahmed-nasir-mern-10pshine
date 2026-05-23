import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Trash from '../pages/Trash'
import * as noteAPI from '../api/note.api'
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

// mock Sidebar
vi.mock('../components/Sidebar', () => ({
  default: () => <div>Sidebar</div>
}))

// mock NoteCard
vi.mock('../components/NoteCard', () => ({
  default: ({ note, onRestore, onDelete, isTrash }) => (
    <div>
      <p>{note.title}</p>
      <p>{note.daysLeft} days left</p>
      <button onClick={() => onRestore(note._id)}>Restore</button>
      <button 
      onClick={() => onDelete(note._id)}
      title='Delete'
        >Delete</button>
    </div>
  )
}))

// fake trash notes
const fakeTrashNotes = [
  {
    _id: '1',
    title: 'Deleted Note 1',
    content: '<p>Content 1</p>',
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    daysLeft: 25,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Deleted Note 2',
    content: '<p>Content 2</p>',
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    daysLeft: 3,
    createdAt: new Date().toISOString()
  }
]

const renderTrash = () => {
  localStorage.setItem('token', 'fake-token')
  render(
    <BrowserRouter>
      <Trash />
    </BrowserRouter>
  )
}

describe('Trash Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ─── Rendering Tests ───────────────────────

  it('should render trash page correctly', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue([])

    renderTrash()
    await waitFor(() => {
      expect(screen.getByText(/Trash/i)).toBeInTheDocument()

    })

  })

  it('should show permanently deleted message', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue([])

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText(/Notes are permanently deleted after 30 days/i)).toBeInTheDocument()

    })
  })

  it('should show loading state initially', () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderTrash()

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })

  // ─── Fetch Tests ────────────────────────────

  it('should call getTrashNotes on mount', async () => {
    const mockGetTrash = vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue([])

    renderTrash()

    await waitFor(() => {
      expect(mockGetTrash).toHaveBeenCalled()
    })
  })

  it('should display trash notes after fetching', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
      expect(screen.getByText('Deleted Note 2')).toBeInTheDocument()
    })
  })

  it('should show empty state when trash is empty', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue([])

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText(/Trash is empty/i)).toBeInTheDocument()
    })
  })

  it('should handle API failure gracefully', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockRejectedValue(
      new Error('Network error')
    )

    renderTrash()

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    })
  })

  // ─── Days Left Tests ────────────────────────

  it('should show days left for each note', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('25 days left')).toBeInTheDocument()
      expect(screen.getByText('3 days left')).toBeInTheDocument()
    })
  })

  // ─── Restore Tests ──────────────────────────

  it('should remove note from list after restore', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)
    vi.spyOn(noteAPI, 'restoreNotes').mockResolvedValue({ message: 'restored' })

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const restoreButtons = screen.getAllByText(/restore/i)
    await userEvent.click(restoreButtons[0])

    await waitFor(() => {
      expect(screen.queryByText('Deleted Note 1')).not.toBeInTheDocument()
    })
  })

  it('should keep other notes after restoring one', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)
    vi.spyOn(noteAPI, 'restoreNotes').mockResolvedValue({ message: 'restored' })

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const restoreButtons = screen.getAllByText(/restore/i)
    await userEvent.click(restoreButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 2')).toBeInTheDocument()
    })
  })

  it('should handle restore failure gracefully', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)
    vi.spyOn(noteAPI, 'restoreNotes').mockRejectedValue(
      new Error('Restore failed')
    )

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const restoreButtons = screen.getAllByText(/Restore/i)
    await userEvent.click(restoreButtons[0])

    // note should still be there since restore failed
    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })
  })

  // ─── Delete Tests ────────────────────────────

  it('should remove note after permanent delete', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)
    vi.spyOn(noteAPI, 'permanentDelNote').mockResolvedValue({ message: 'note deleted successfullly' })

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByTitle(/Delete/i)
    await userEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.queryByText('Deleted Note 1')).not.toBeInTheDocument()
    })
  })

  it('should show empty state after deleting all notes', async () => {
    const singleNote = [fakeTrashNotes[0]]
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(singleNote)
    vi.spyOn(noteAPI, 'permanentDelNote').mockResolvedValue({ message: 'note deleted successfullly' })

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByTitle(/Delete/i)
    await userEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/Trash is empty/i)).toBeInTheDocument()
    })
  })

  it('should handle delete failure gracefully', async () => {
    vi.spyOn(noteAPI, 'getTrashNotes').mockResolvedValue(fakeTrashNotes)
    vi.spyOn(noteAPI, 'permanentDelNote').mockRejectedValue(
      new Error('Delete failed')
    )

    renderTrash()

    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText(/delete/i)
    await userEvent.click(deleteButtons[0])

    // note should still be there since delete failed
    await waitFor(() => {
      expect(screen.getByText('Deleted Note 1')).toBeInTheDocument()
    })
  })

})