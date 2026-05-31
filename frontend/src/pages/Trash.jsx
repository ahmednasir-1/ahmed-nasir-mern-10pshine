import { useEffect, useState } from "react"
import { getTrashNotes, permanentDelNote, restoreNotes } from "../api/note.api"
import NoteCard from "../components/NoteCard"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { Logger } from "react-logger-lib"

export default function Trash() {

    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState([])
    const [showSidebar, setShowSidebar] = useState(false);


    useEffect(() => {
        Logger.of('App.Trash').info('Trash Page loaded')
        fetchTrashNotes()
    }, [])

    const fetchTrashNotes = async () => {
        try {
            const data = await getTrashNotes()
            setNotes(Array.isArray(data) ? data : [])

        } catch (error) {
            Logger.of('App.Trash').error(`Failed to fetch trash note - ${error}`)
            setNotes([])

        }
        finally {
            setLoading(false)
        }
    }

    const handleRestore = async (id) => {
        try {
            await restoreNotes(id)

             Logger.of('App.Trash').info('Restored the note')
            setNotes((prev) => prev.filter((note) => note._id !== id))
        } catch (error) {
             Logger.of('App.Trash').error(`FAiled to restore note - ${error}`)
        }
    }

    const handlePermanentDel = async (id) => {
        try {

            await permanentDelNote(id)

            Logger.of('App.Trash').info('Permanently Deleted the note')

            setNotes((prev) => prev.filter((note) => note._id !== id))
        } catch (error) {
            Logger.of('App.Trash').error(`FAiled to Permanent Delete note - ${error}`)
        }
    }

    const notesContent = notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-2">
            <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
            </svg>
            <p className="text-gray-400 text-sm">Trash is empty</p>
        </div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {notes.map((note) => (
                <NoteCard
                    key={note._id}
                    note={note}
                    isTrash={true}
                    onRestore={handleRestore}
                    onDelete={handlePermanentDel}
                />
            ))}
        </div>
    )


    return (
        <div className="flex h-screen bg-primary text-text-primary font-sans antialiased selection:bg-accent selection:text-primary">


            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar setShowSidebar={setShowSidebar} />

                <Sidebar showSidebar={showSidebar} />

                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-200">
                    <h1 className="text-base font-semibold text-gray-900">Trash</h1>
                    <p className="text-xs text-gray-400">
                        Notes are permanently deleted after 30 days
                    </p>
                </div>

                {/* Notes Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Loading...
                        </div>
                    ) : (

                        <div>
                            {notesContent}
                        </div>



                    )}
                </div>

            </div>
        </div>
    )
}


