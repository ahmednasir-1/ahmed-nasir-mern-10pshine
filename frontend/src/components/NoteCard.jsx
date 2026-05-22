import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { LuPin } from "react-icons/lu";
import { LuPinOff } from "react-icons/lu";
import { MdOutlineRestore } from "react-icons/md";

function NoteCard({ note, onDelete, onDoubleClick, onPin, onRestore, isTrash}) {
  // const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate('')

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }


  // strip HTML tags from content for preview
  const stripHtml = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="relative bg-journal-secondary border border-journal-border rounded-none p-6 flex flex-col min-h-[180px] shadow-journal-card hover:border-journal-accent/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
    >

      <h3 className="font-serif text-lg font-medium text-journal-text-primary leading-tight pr-6 group-hover:text-journal-accent transition-colors">
        {note.title }
      </h3>


      <p className="font-sans font-light text-xs text-journal-text-secondary leading-relaxed line-clamp-3 mt-2 mb-4">
        {stripHtml(note.content) }
      </p>


{!isTrash? (

  <div className="mt-auto pt-3 border-t border-journal-border/30 flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-widest text-journal-text-secondary">
          {formatDate(note.createdAt)}
        </span>
      </div>
):
(

  <div className="mt-auto pt-3 border-t border-journal-border/30 flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-widest text-red-400">
           {note.daysLeft <= 0 ? 'Deleting soon...': `${note.daysLeft} days left`}
        </span>
      </div>
)}




      {/* note buttons  */}
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">


        {/* Normal Mode Buttons */}
        {!isTrash && (
          <div className="flex gap-2 mt-2">

            {/* Pin/Unpin Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPin(note._id)
              }}
              className="p-1.5 bg-journal-primary border border-journal-border text-journal-text-secondary hover:text-journal-accent hover:border-journal-accent/30 transition-colors cursor-pointer"
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              {note.isPinned
                ? <LuPinOff className="w-4 h-4" />   
                : <LuPin className="w-4 h-4" />       
              }
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/notes/edit/${note._id}`)
              }}
              className="p-1.5 bg-journal-primary border border-journal-border text-journal-text-secondary hover:text-journal-accent hover:border-journal-accent/30 transition-colors cursor-pointer"
              title="Edit"
            >
              <BiEdit className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note._id)
              }}
              className="p-1.5 bg-journal-primary border border-journal-border text-journal-text-secondary hover:text-journal-accent hover:border-journal-accent/30 transition-colors cursor-pointer"
              title="Delete"
            >
              <MdDeleteOutline className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* Trash Mode Buttons */}
        {isTrash && (
          <div className="flex gap-2 mt-2">

            {/* Restore Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRestore(note._id)
              }}
              className="p-1.5 bg-journal-primary border border-journal-border text-journal-text-secondary hover:text-journal-accent hover:border-journal-accent/30 transition-colors cursor-pointer"
              title="Restore"
            >
              <MdOutlineRestore className="w-4 h-4" />
            </button>

            {/* Permanent Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note._id)
              }}
              className="p-1.5 bg-journal-primary border border-journal-border text-journal-text-secondary hover:text-journal-accent hover:border-journal-accent/30 transition-colors cursor-pointer"
              title="Delete Permanently"
            >
              <MdDeleteOutline className="w-4 h-4" />
            </button>

          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard