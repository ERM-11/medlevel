import { useStore } from '../store'

function getLast90Days(): string[] {
  const days: string[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getXPForDate(sessions: ReturnType<typeof useStore>['sessions'], date: string): number {
  return sessions.filter((s) => s.date === date).reduce((a, s) => a + s.xpEarned, 0)
}

export function StreakCalendar() {
  const { sessions } = useStore()
  const days = getLast90Days()

  const maxXP = Math.max(...days.map((d) => getXPForDate(sessions, d)), 1)

  const weeks: string[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Study Activity — Last 90 Days</h2>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => {
              const xp = getXPForDate(sessions, day)
              const intensity = xp === 0 ? 0 : Math.max(0.15, xp / maxXP)
              const today = new Date().toISOString().slice(0, 10)
              const isToday = day === today
              return (
                <div
                  key={day}
                  title={`${day}: ${xp} XP`}
                  className={`w-4 h-4 rounded-sm transition-all ${isToday ? 'ring-1 ring-white' : ''}`}
                  style={{
                    backgroundColor:
                      xp === 0
                        ? '#1f2937'
                        : `rgba(99, 102, 241, ${intensity})`,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>Less</span>
        {[0.1, 0.3, 0.6, 0.85, 1].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: v === 0.1 ? '#1f2937' : `rgba(99, 102, 241, ${v})` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
