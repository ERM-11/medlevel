import { useState } from 'react'
import { useStore } from '../store'
import { SPECIALTIES } from '../data/specialties'
import { calculateXP } from '../data/xp'
import { ACHIEVEMENTS } from '../data/achievements'
import type { Specialty } from '../types'

interface Props {
  onClose: () => void
  onSuccess: (xp: number, achievements: string[]) => void
}

export function LogSessionModal({ onClose, onSuccess }: Props) {
  const addSession = useStore((s) => s.addSession)

  const [ankiCards, setAnkiCards] = useState('')
  const [ankiRetention, setAnkiRetention] = useState('')
  const [passmedQuestions, setPassmedQuestions] = useState('')
  const [passmedScore, setPassmedScore] = useState('')
  const [specialty, setSpecialty] = useState<Specialty>('Cardiology')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const previewXP = calculateXP(
    Number(ankiCards) || 0,
    Number(ankiRetention) || 0,
    Number(passmedQuestions) || 0,
    Number(passmedScore) || 0,
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { xpEarned, newAchievements } = addSession({
      date,
      ankiCards: Number(ankiCards) || 0,
      ankiRetention: Number(ankiRetention) || 0,
      passmedQuestions: Number(passmedQuestions) || 0,
      passmedScore: Number(passmedScore) || 0,
      specialty,
    })
    onSuccess(xpEarned, newAchievements)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-lg">Log Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Date */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Anki */}
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-2">🃏 Anki</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Cards reviewed</label>
                <input
                  type="number" min="0" placeholder="0"
                  value={ankiCards}
                  onChange={(e) => setAnkiCards(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Retention %</label>
                <input
                  type="number" min="0" max="100" placeholder="0"
                  value={ankiRetention}
                  onChange={(e) => setAnkiRetention(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Passmed */}
          <div>
            <div className="text-gray-300 font-semibold text-sm mb-2">📋 Passmed</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Questions done</label>
                <input
                  type="number" min="0" placeholder="0"
                  value={passmedQuestions}
                  onChange={(e) => setPassmedQuestions(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Score %</label>
                <input
                  type="number" min="0" max="100" placeholder="0"
                  value={passmedScore}
                  onChange={(e) => setPassmedScore(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Specialty */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as Specialty)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
            >
              {SPECIALTIES.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </div>

          {/* XP preview */}
          {previewXP > 0 && (
            <div className="bg-brand-900/40 border border-brand-700 rounded-lg px-4 py-2 text-center">
              <span className="text-brand-300 font-bold">+{previewXP} XP</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            Submit Session
          </button>
        </form>
      </div>
    </div>
  )
}
