import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import TextEditor from '../components/TextEditor'
import { getAllNotes, moveToTrash, togglePin } from '../api/note.api'

function Dashboard() {

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [search, setSearch] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)

  const handleCreateNote = () => {
    setSelectedNote(null)
    setShowEditor(true)
  }

  const handleEditNote = (note) => {
    setSelectedNote(note)
    setShowEditor(true)
  }

  const handleClose = () => {
    setShowEditor(false)
    setSelectedNote(null)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const notes = await getAllNotes()
      setNotes(notes)
    } catch (error) {
      console.log('failed to fetch notes', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      await moveToTrash(noteId)

      setNotes(notes.filter((note) => note._id !== noteId))

    } catch (error) {
      console.log('failed delete note')
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )

  const handlePin = async (noteId) => {
    try {
      await togglePin(noteId)

      setNotes(notes.map((note) => note._id === noteId ? { ...note, isPinned: !note.isPinned } : note))
    } catch (error) {

    }
  }
  return (
    <div className="flex h-screen bg-primary text-text-primary font-sans antialiased selection:bg-accent selection:text-primary">

      <div className="flex flex-col flex-1 overflow-hidden">

        <Navbar
          search={search}
          setSearch={setSearch}
          onCreateNote={handleCreateNote}
          showEditor={showEditor}
          setShowSidebar={setShowSidebar}
        />

        {/* siebar  */}
        <Sidebar showSidebar={showSidebar}/>

        {/* Notes Grid */}
        <div className="flex-1 overflow-hidden">

          {showEditor ? (
            <TextEditor
              note={selectedNote}
              onClose={handleClose}
              onSave={fetchNotes}
            />
          ) : (
            <div className="flex-1 overflow-y-auto p-12 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full text-text-secondary text-sm uppercase tracking-widest">
                  Loading notes...
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p className="text-text-secondary text-sm uppercase tracking-widest font-light">
                    No canvases yet. Create your first note!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* pinned section  */}

                  {filteredNotes.some((note) => note.isPinned) && (
                    <>
                      <div className="col-span-full">
                        <p className='text-xs text-gray-400 uppercase tracking-widest font-medium mb-2'>Pinned Notes</p>
                      </div>
                      {filteredNotes.filter((note) => note.isPinned).map((note) => (
                        <NoteCard
                          key={note._id}
                          onDelete={handleDelete}
                          onPin={handlePin}
                          onDoubleClick={() => handleEditNote(note)}
                          note={note}
                          isTrash={false} />
                      ))

                      }
                    </>
                  )

                  }

                  {/* other notes  */}
                  {filteredNotes.some((note) => !note.isPinned) && (
                    <>
                      <div className="col-span-full">
                        <p className='text-xs text-gray-400 uppercase tracking-widest font-medium mb-2'>Unpinned Notes</p>
                      </div>
                      {filteredNotes.filter((note) => !note.isPinned).map((note) => (
                        <NoteCard
                          key={note._id}
                          onDelete={handleDelete}
                          onPin={handlePin}
                          onDoubleClick={() => handleEditNote(note)}
                          note={note} />
                      ))

                      }
                    </>
                  )

                  }

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Dashboard