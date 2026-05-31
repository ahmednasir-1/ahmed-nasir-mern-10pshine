import { useEffect, useState } from "react"
import Quill from "./Quill.jsx"
import { createNote, updateNote } from "../api/note.api.js"
import { RxCrossCircled } from "react-icons/rx";
import PropTypes from "prop-types";
import { Logger } from 'react-logger-lib'

export default function TextEditor({ note, onClose, onSave }) {

  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditMode = !!note

  // fill editor when note prop changes
  useEffect(() => {

    Logger.of('App.TextEditor').info('Text Editor component rendered')

    if (note) {
      setTitle(note.title)
      setContent(note.content)

      Logger.of('App.TextEditor').info("Editing a note")
    } else {
      setTitle('')
      setContent('')

      Logger.of('App.TextEditor').info("Creating a new note")
    }
  }, [note])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        await updateNote(note._id, title, content)

        Logger.of('App.TextEditor').info("Updated a note successfully")

      } else {
        await createNote(title, content)

        Logger.of('App.TextEditor').info("Created a new note successfully")
      }

      onSave()
      onClose()

    } catch (error) {
      Logger.of('App.TextEditor').error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const noteLabel = note ? 'Commit Changes' : 'Initialize Note';
  const buttonLabel = loading ? 'Transmitting Data...' : noteLabel;

  return (
    <div className="flex flex-col h-full bg-journal-secondary border-l border-journal-border font-sans antialiased text-journal-text-primary">


      <div className="flex items-center justify-between px-6 py-4 border-b border-journal-border shrink-0 select-none">
        <span className="font-sans text-[10px] uppercase tracking-widest font-semibold text-journal-text-secondary">

        </span>
        <button
          onClick={onClose}
          className="px-3 py-3 text-journal-text-secondary hover:text-journal-accent text-sm p-1 transition-colors cursor-pointer"
          title="Close Workspace"
        >
          <RxCrossCircled />
        </button>
      </div>


      <input
        type="text"
        placeholder="Untitled Canvas..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-6 py-4 bg-transparent font-serif text-2xl font-medium tracking-tight text-journal-text-primary outline-none border-b border-journal-border/50 placeholder-journal-text-secondary/30"
      />


      <div className="flex-1 overflow-y-auto p-6 font-sans font-light text-base leading-relaxed notion-editor-glow">
        <Quill value={content} onChange={setContent} />
      </div>


      <div className="flex items-center justify-center px-6 py-4 border-t border-journal-border bg-journal-primary/30 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className=" px-3 py-3 bg-white hover:bg-accent text-primary font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-btn disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer rounded-none"
        >
          {buttonLabel}
        </button>
      </div>

    </div>
  )
}

TextEditor.propTypes = {
  note: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,

}