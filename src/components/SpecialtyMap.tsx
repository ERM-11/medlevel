import { useStore } from '../store'
import { SPECIALTIES, SPECIALTY_ICONS } from '../data/specialties'
import type { Specialty } from '../types'

function getStars(accuracy: number, questions: number): number {
  if (questions === 0) return 0
  if (accuracy >= 85 && questions >= 50) return 4
  if (accuracy >= 75 && questions >= 30) return 3
  if (accuracy >= 65 && questions >= 15) return 2
  if (questions >= 5) return 1
  return 0
}

export function SpecialtyMap() {
  const { sessions } = useStore()

  const stats = SPECIALTIES.map((sp: Specialty) => {
    const spSessions = sessions.filter((s) => s.specialty === sp)
    const totalQ = spSessions.reduce((a, s) => a + s.passmedQuestions, 0)
    const avgAcc =
      spSessions.length === 0
        ? 0
        : spSessions.reduce((a, s) => a + s.passmedScore, 0) / spSessions.length
    const stars = getStars(avgAcc, totalQ)
    return { sp, totalQ, avgAcc, stars }
  })

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">Specialty Map</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map(({ sp, totalQ, avgAcc, stars }) => {
          const barColor =
            totalQ === 0
              ? '#374151'
              : avgAcc >= 75
              ? '#14b8a6'
              : avgAcc >= 60
              ? '#f59e0b'
              : '#f87171'

          return (
            <div key={sp} className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">{SPECIALTY_ICONS[sp]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 text-xs truncate">{sp}</span>
                  <span className="text-gray-500 text-xs ml-2 shrink-0">
                    {totalQ > 0 ? `${Math.round(avgAcc)}% · ${totalQ}Q` : '—'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totalQ / 100) * 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
              <div className="text-yellow-400 text-xs shrink-0">
                {'⭐'.repeat(stars)}{'☆'.repeat(4 - stars)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
