import { useState } from 'react'

const tagColors = {
  Work: 'bg-blue-100 text-blue-800',
  Personal: 'bg-teal-100 text-teal-800',
  Ideas: 'bg-amber-100 text-amber-800',
  Other: 'bg-pink-100 text-pink-800',
}

function NoteCard({ note, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

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
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 min-h-[140px] hover:border-gray-300 transition-all cursor-pointer group">

      {/* Tag */}
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${tagColors[note.tag] || tagColors.Other}`}>
        {note.tag || 'Other'}
      </span>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-900 leading-snug">
        {note.title}
      </h3>

      {/* Preview */}
      <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">
        {stripHtml(note.content)}
      </p>

      {/* Date */}
      <span className="text-xs text-gray-400 mt-auto">
        {formatDate(note.createdAt)}
      </span>

      {/* Menu Button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="text-gray-400 hover:text-gray-600 px-1"
        >
          ···
        </button>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-[120px]">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Edit
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteCard