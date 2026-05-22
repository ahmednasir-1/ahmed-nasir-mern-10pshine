import { Link, useLocation, useNavigate } from 'react-router-dom'

function Sidebar({showSidebar}) {
  const location = useLocation()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const navItems = [
    {
      label: 'All Notes',
      path: '/dashboard',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      label: 'Trash',
      path: '/trash',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      )
    }
  ]

  return (
    // <div className="w-64 bg-secondary border-r border-border flex flex-col h-full p-8 shrink-0 select-none">
    <div className={`fixed flex flex-col top-16 left-0 p-8 w-64 bg-secondary text-white
  h-[calc(100vh-4rem)] transition-transform duration-300
  ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>


      {/* Nav */}
      <nav className="flex flex-col space-y-4 text-sm flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2.5 transition-colors ${location.pathname === item.path
              ? 'font-medium text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            {location.pathname === item.path && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            )}
            <span className={location.pathname !== item.path ? 'pl-4' : ''}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Area */}
      <div className="pt-4 border-t border-border flex items-center space-x-3">
        <div className="w-8 h-8 rounded-none bg-primary border border-border flex items-center justify-center font-serif text-sm font-semibold text-accent shrink-0">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate text-text-primary">
            {user.name || 'User'}
          </p>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider truncate">
            {user.email || ''}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
          title="Logout"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

    </div>


  )
}

export default Sidebar