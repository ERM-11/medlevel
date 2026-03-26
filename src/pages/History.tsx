import { useStore } from '../store'
import { SPECIALTY_ICONS } from '../data/specialties'

export function History() {
  const { sessions } = useStore()
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date))

  if (!sorted.length) {
    return (
      <div className="text-gray-500 text-center py-20">
        No sessions yet. Log your first session to get started!
      </div>
    )
  }

  return (
    <div className="max-w-2xl flex flex-col gap-3">
      <h2 className="text-white font-semibold text-lg">Session History</h2>
      {sorted.map((s) => (
        <div key={s.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex gap-4 items-start">
          <span className="text-2xl mt-0.5">{SPECIALTY_ICONS[s.specialty]}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-sm">{s.specialty}</span>
              <span className="text-brand-400 font-bold text-sm">+{s.xpEarned} XP</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{s.date}</div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              {s.ankiCards > 0 && (
                <span>🃏 {s.ankiCards} cards · {s.ankiRetention}% retention</span>
              )}
              {s.passmedQuestions > 0 && (
                <span>📋 {s.passmedQuestions} Qs · {s.passmedScore}% score</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
