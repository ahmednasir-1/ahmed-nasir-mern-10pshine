export default function Navbar() {
    return (<>

        <div className="flex flex-col flex-1 overflow-hidden">

            {/* Topbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <h1 className="text-base font-semibold text-gray-900">All Notes</h1>

                <div className="flex items-center gap-3">

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-44"
                        />
                    </div>

                    {/* New Note Button */}
                    <button
                        onClick={() => navigate('/notes/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Note
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}