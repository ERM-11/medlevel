import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Specialties } from './pages/Specialties'
import { Achievements } from './pages/Achievements'
import { History } from './pages/History'
import { LogSessionModal } from './components/LogSessionModal'
import { XPToast } from './components/XPToast'

type Page = 'dashboard' | 'specialties' | 'achievements' | 'history'

const NAV_ITEMS: Array<{ id: Page; label: string; icon: string }> = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '🏠' },
  { id: 'specialties',  label: 'Specialties',  icon: '🗺️' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'history',      label: 'History',      icon: '📋' },
]

interface Toast {
  xp: number
  achievements: string[]
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [showLog, setShowLog] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-40">
        <div className="flex items-center gap-2">
          <span className="text-brand-400 font-black text-xl tracking-tight">Med</span>
          <span className="text-white font-black text-xl tracking-tight">Level</span>
        </div>
        <nav className="hidden sm:flex gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === item.id
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setShowLog(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Log Session
        </button>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden flex border-b border-gray-800 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors whitespace-nowrap px-2 ${
              page === item.id ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-500'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        {page === 'dashboard'    && <Dashboard />}
        {page === 'specialties'  && <Specialties />}
        {page === 'achievements' && <Achievements />}
        {page === 'history'      && <History />}
      </main>

      {/* Log modal */}
      {showLog && (
        <LogSessionModal
          onClose={() => setShowLog(false)}
          onSuccess={(xp, achievements) => setToast({ xp, achievements })}
        />
      )}

      {/* XP toast */}
      {toast && (
        <XPToast
          xp={toast.xp}
          achievementIds={toast.achievements}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}
