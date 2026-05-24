import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter} from "react-router-dom";
import Dashboard from "./Dashboard";
import * as noteAPI from "../api/note.api.js"
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {

    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

// mock components
vi.mock('../components/Sidebar', () => ({
    default: () => <div>Sidebar</div>
}))

vi.mock('../components/Navbar', () => ({
    default: ({ search, setSearch }) => (
        <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}))

vi.mock('../components/NoteCard', () => ({
  default: ({ note, onDelete }) => (
    <div>
      <p>{note.title}</p>
      <button onClick={() => onDelete(note._id)}>Delete</button>
    </div>
  )
}))

const fakeNotes = [
    {
        _id: '1',
        title: "title-1",
        content: "notes-1",
        createdAt: new Date().toISOString()
    }
    , {
        _id: '2',
        title: "title-2",
        content: "note-2",
        createdAt: new Date().toISOString()
    }
]

const renderDashboard = () => {
    localStorage.setItem('token', 'dummy-token')
    localStorage.setItem('user', JSON.stringify({
        name: "user",
        email: "user@gmail.com",

    }))

    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    )
}


describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    })


    it('show loading state initially', async () => {

        vi.spyOn(noteAPI, 'getAllNotes').mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 1000))
        )

        renderDashboard()
        expect(screen.getByText('Loading notes...')).toBeInTheDocument()
    })


    it('fetch and display notes ', async () => {

        vi.spyOn(noteAPI, 'getAllNotes').mockResolvedValue(fakeNotes)

        renderDashboard()
        await waitFor(() => {
            expect(screen.getByText('title-1')).toBeInTheDocument()
            expect(screen.getByText('title-2')).toBeInTheDocument()

        }
        )
    })


    it('show empty notes when no notes', async () => {

        vi.spyOn(noteAPI, 'getAllNotes').mockResolvedValue([])

        renderDashboard()
        await waitFor(() => {
            expect(screen.getByText('No canvases yet. Create your first note!')).toBeInTheDocument()
        })
    })

    it('remove notes when delete', async () => {

        vi.spyOn(noteAPI, 'getAllNotes').mockResolvedValue(fakeNotes)
        vi.spyOn(noteAPI, 'moveToTrash').mockResolvedValue({message: 'deleted'})
        renderDashboard()

        await waitFor(() => {
            expect(screen.getByText('title-1')).toBeInTheDocument()
        })

        // click delete on note-1
        const deleteButton = screen.getAllByText(/Delete/i)
        await userEvent.click(deleteButton[0])

        // first note should be gone
        await waitFor(() => {
            expect(screen.queryByText('title-1')).not.toBeInTheDocument()
        })
    })



})