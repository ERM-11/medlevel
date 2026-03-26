import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievements'

interface Props {
  xp: number
  achievementIds: string[]
  onDone: () => void
}

export function XPToast({ xp, achievementIds, onDone }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  const achievements = achievementIds.map((id) => ACHIEVEMENTS.find((a) => a.id === id)).filter(Boolean)

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex flex-col gap-2 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-brand-600 text-white rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 font-bold text-lg">
        <span>⚡</span>
        <span>+{xp} XP</span>
      </div>
      {achievements.map((ach) => ach && (
        <div key={ach.id} className="bg-yellow-500 text-black rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 font-semibold">
          <span>{ach.icon}</span>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-70">Achievement unlocked!</div>
            <div>{ach.title}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
