import axios from 'axios'
import { createNote, updateNote, getAllNotes, togglePin, getTrashNotes, restoreNotes, permanentDelNote, getNoteById } from './note.api'
import '@testing-library/jest-dom'

vi.mock('axios')

const BASE_URL = 'http://localhost:5000/api/v1/notes'
const mockToken = 'mock-token-123'
const authHeader = { headers: { Authorization: mockToken } }

beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', mockToken)
})

describe('Note API  [note.api.test.js] ', () => {



    it('should call create note ', async () => {
        axios.post.mockResolvedValue({ data: { _id: '1', title: 'Test', content: 'Hello' } })
        await createNote('Test', 'Hello')
        expect(axios.post).toHaveBeenCalledWith(
            `${BASE_URL}/create`,
            { title: 'Test', content: 'Hello' },
            authHeader
        )
    })


    it('should call get all notes', async () => {
        axios.get.mockResolvedValue({ data: [] })
        await getAllNotes()
        expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/`, authHeader)
    })


    it('should call get note by single id', async () => {
        axios.get.mockResolvedValue({ data: { _id: '1', title: 'Test' } })
        await getNoteById('1')
        expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/1`, authHeader)
    })


    it('should call update note', async () => {
        axios.patch.mockResolvedValue({ data: { _id: '1', title: 'Updated' } })
        await updateNote('1', 'Updated', 'New content')
        expect(axios.patch).toHaveBeenCalledWith(
            `${BASE_URL}/update/1`,
            { title: 'Updated', content: 'New content' },
            authHeader
        )
    })


    it('should call toggle pin', async () => {
        axios.put.mockResolvedValue({ data: { _id: '1', isPinned: true } })
        await togglePin('1')
        expect(axios.put).toHaveBeenCalledWith(
            `${BASE_URL}/pin/1`,
            {},
            authHeader
        )
    })


    it('should call get trash notes', async () => {
        axios.get.mockResolvedValue({ data: [] })
        await getTrashNotes()
        expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/trash`, authHeader)
    })


    it('should call restore notes', async () => {
        axios.put.mockResolvedValue({ data: { message: 'note restored successfullly' } })
        await restoreNotes('1')
        expect(axios.put).toHaveBeenCalledWith(
            `${BASE_URL}/restore/1`,
            {},
            authHeader
        )
    })


    it('should call permanent del note', async () => {
        axios.delete.mockResolvedValue({ data: { message: 'note deleted successfullly' } })
        await permanentDelNote('1')
        expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/permanent/1`, authHeader)
    })

})
