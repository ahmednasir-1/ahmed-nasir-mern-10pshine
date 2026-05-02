import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'

function Dashboard() {

    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    // fetch all notes
    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const notes = await axios.get('http://localhost:5000/api/v1/notes', {
                headers: {
                    Authorization: `${token}`
                }
            })

            console.log(notes);
            setNotes(notes.data)


        } catch (error) {
            console.log("failed to fetch notes", error);

        }
        finally {
            setLoading(false)
        }

    }

    // delete note
    const handleDelete = async (noteId) => {

    }

    // filter notes by search
    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <Navbar />

            {/* Notes Grid */}
            <div className="flex-1 overflow-y-auto p-6">

                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Loading notes...
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p className="text-gray-400 text-sm">No notes yet. Create your first note!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filteredNotes.map((note) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>

    )
}

export default Dashboard