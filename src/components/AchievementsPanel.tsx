import { useStore } from '../store'
import { ACHIEVEMENTS } from '../data/achievements'

export function AchievementsPanel() {
  const { sessions, unlockedAchievements } = useStore()
  const unlockedIds = new Set(unlockedAchievements.map((u) => u.achievementId))

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">
        Achievements{' '}
        <span className="text-gray-500 font-normal text-sm">
          {unlockedIds.size}/{ACHIEVEMENTS.length}
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedIds.has(ach.id)
          // progress hint
          const totalQ = sessions.reduce((a, s) => a + s.passmedQuestions, 0)
          const totalCards = sessions.reduce((a, s) => a + s.ankiCards, 0)

          return (
            <div
              key={ach.id}
              className={`flex items-start gap-3 rounded-xl p-3 border transition-all ${
                unlocked
                  ? 'bg-yellow-500/10 border-yellow-500/40'
                  : 'bg-gray-800/50 border-gray-700 opacity-60'
              }`}
            >
              <span className="text-2xl">{unlocked ? ach.icon : '🔒'}</span>
              <div className="min-w-0">
                <div className={`font-semibold text-sm ${unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {ach.title}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{ach.description}</div>
                <div className="text-brand-400 text-xs mt-1">+{ach.xpReward} XP</div>
              </div>
              {unlocked && (
                <span className="ml-auto text-yellow-400 text-lg shrink-0">✓</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
