import { render, screen} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'


vi.mock('react-icons', () => ({
    BiEdit: () => <span>Edit</span>,
    MdDeleteOutline: () => <span>Delete</span>,
    LuPin: () => <span>Pin</span>,
    LuPinOff: () => <span>PinOff</span>,
    MdOutlineRestore: () => <span>Restore</span>,
}))


import NoteCard from '../components/NoteCard'


const renderNoteCard = (props) => {
    return render(
        <MemoryRouter>
            <NoteCard {...props} />
        </MemoryRouter>
    )
}

const mockNote = {
    _id: 'note123',
    title: 'Test Note Title',
    content: '<p>Test note content</p>',
    createdAt: new Date().toISOString(),
    isPinned: false,
    daysLeft: 5
}

const defaultProps = {
    note: mockNote,
    onDelete: vi.fn(),
    onDoubleClick: vi.fn(),
    onPin: vi.fn(),
    onRestore: vi.fn(),
    isTrash: false
}

describe('NoteCard ', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })



    it('should render note title', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByText('Test Note Title')).toBeDefined()
    })

    it('should render note content without HTML tags', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByText('Test note content')).toBeDefined()
    })

    it('should render Today for notes created today', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByText('Today')).toBeDefined()
    })

    it('should render formatted date for older notes', () => {
        const oldDate = new Date('2024-01-15')
        const props = { ...defaultProps, note: { ...mockNote, createdAt: oldDate.toISOString() } }
        renderNoteCard(props)
        expect(screen.getByText('Jan 15')).toBeDefined()
    })



    it('should render pin button', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByTitle('Pin')).toBeDefined()
    })

    it('should render edit button', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByTitle('Edit')).toBeDefined()
    })

    it('should render delete button', () => {
        renderNoteCard(defaultProps)
        expect(screen.getByTitle('Delete')).toBeDefined()
    })

    it('should not render restore button in normal mode', () => {
        renderNoteCard(defaultProps)
        expect(screen.queryByTitle('Restore')).toBeNull()
    })

    it('should show Unpin title when note is pinned', () => {
        const props = { ...defaultProps, note: { ...mockNote, isPinned: true } }
        renderNoteCard(props)
        expect(screen.getByTitle('Unpin')).toBeDefined()
    })



    const trashProps = { ...defaultProps, isTrash: true }

    it('should render restore button in trash mode', () => {
        renderNoteCard(trashProps)
        expect(screen.getByTitle('Restore')).toBeDefined()
    })

    it('should render permanent delete button in trash mode', () => {
        renderNoteCard(trashProps)
        expect(screen.getByTitle('Delete Permanently')).toBeDefined()
    })

    it('should not render pin button in trash mode', () => {
        renderNoteCard(trashProps)
        expect(screen.queryByTitle('Pin')).toBeNull()
    })

    it('should not render edit button in trash mode', () => {
        renderNoteCard(trashProps)
        expect(screen.queryByTitle('Edit')).toBeNull()
    })

    it('should show days left when daysLeft > 0', () => {
        renderNoteCard(trashProps)
        expect(screen.getByText('5 days left')).toBeDefined()
    })

  

})