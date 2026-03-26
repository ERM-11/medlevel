import { getRank, getNextRank, getLevelProgress } from '../data/ranks'
import { getTotalXP, getStreak } from '../data/xp'
import { useStore } from '../store'

export function CharacterCard() {
  const { sessions, unlockedAchievements, streakShields } = useStore()
  const totalXP = getTotalXP(sessions)
  const streak = getStreak(sessions)
  const rank = getRank(totalXP)
  const nextRank = getNextRank(totalXP)
  const { percent } = getLevelProgress(totalXP)

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((s) => s.date === today)
  const doneAnki = todaySessions.some((s) => s.ankiCards > 0)
  const donePassmed = todaySessions.some((s) => s.passmedQuestions > 0)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
          style={{ borderColor: rank.color, backgroundColor: rank.color + '22' }}
        >
          {rank.emoji}
        </div>
        <div>
          <div className="text-white font-bold text-lg">Dr. Ethan</div>
          <div className="text-sm font-semibold" style={{ color: rank.color }}>
            {rank.rank}
          </div>
          <div className="text-gray-400 text-xs">{totalXP.toLocaleString()} XP total</div>
        </div>
        {streak > 0 && (
          <div className="ml-auto text-right">
            <div className="text-2xl">🔥</div>
            <div className="text-white font-bold text-sm">{streak}-day streak</div>
            {streakShields > 0 && (
              <div className="text-gray-400 text-xs">{streakShields} 🛡️ shields</div>
            )}
          </div>
        )}
      </div>

      {/* XP progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{totalXP.toLocaleString()} XP</span>
          {nextRank ? (
            <span>{nextRank.minXP.toLocaleString()} XP → {nextRank.rank}</span>
          ) : (
            <span>MAX RANK</span>
          )}
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percent}%`, backgroundColor: rank.color }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">{percent}% to next rank</div>
      </div>

      {/* Today's checklist */}
      <div className="border-t border-gray-700 pt-3">
        <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Today</div>
        <div className="flex gap-4">
          <div className={`flex items-center gap-1 text-sm ${doneAnki ? 'text-teal-400' : 'text-gray-500'}`}>
            {doneAnki ? '✅' : '⬜'} Anki
          </div>
          <div className={`flex items-center gap-1 text-sm ${donePassmed ? 'text-teal-400' : 'text-gray-500'}`}>
            {donePassmed ? '✅' : '⬜'} Passmed
          </div>
        </div>
      </div>

      {/* Badge count */}
      <div className="text-gray-400 text-xs">
        🏆 {unlockedAchievements.length} / 12 achievements unlocked
      </div>
    </div>
  )
}
