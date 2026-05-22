import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";

export default function Navbar({ search, setSearch, onCreateNote, showEditor, setShowSidebar, showSidebar }) {

  
  return (


    <div className="h-16 bg-secondary border-b border-border flex items-center justify-between px-12 shrink-0">

      <div className="flex items-center space-x-4">

        <GiHamburgerMenu 
        className="cursor-pointer"
        onClick={() => setShowSidebar(prev => !prev)} />
        

        <span className="font-sans text-xs uppercase tracking-widest text-text-secondary">
          Notes Application
        </span>
        <span className="text-border">/</span>
        <span className="font-sans text-xs font-medium uppercase tracking-widest text-text-primary">
          {showEditor ? 'Editor' : 'All Notes'}
        </span>
      </div>

      <div className="flex items-center gap-4">

        {/* Search */}
        {!showEditor && (
          <div className="flex items-center gap-2 bg-primary border border-border px-3 py-2">
            <svg className="w-3.5 h-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs outline-none text-text-primary placeholder:text-text-secondary uppercase tracking-widest w-44"
            />
          </div>
        )}

        {!showEditor && (

          <button
            onClick={onCreateNote}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn cursor-pointer"
          >
            {showEditor ? 'Save Note' : '+ New Note'}
          </button>
        )}

      </div>
    </div>
  )
}