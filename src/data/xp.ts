import type { StudySession } from '../types'

/**
 * XP Formula:
 * Anki: 0.5 XP per card, multiplied by retention bonus
 *   retention < 70%  → 0.8x
 *   retention 70-84% → 1.0x
 *   retention 85-94% → 1.2x
 *   retention ≥ 95%  → 1.5x
 *
 * Passmed: 3 XP per question, multiplied by accuracy bonus
 *   score < 50%  → 0.5x
 *   score 50-69% → 0.8x
 *   score 70-84% → 1.0x
 *   score 85-94% → 1.3x
 *   score ≥ 95%  → 1.6x
 */
export function calculateXP(
  ankiCards: number,
  ankiRetention: number,
  passmedQuestions: number,
  passmedScore: number
): number {
  let ankiXP = ankiCards * 0.5
  if (ankiRetention < 70) ankiXP *= 0.8
  else if (ankiRetention < 85) ankiXP *= 1.0
  else if (ankiRetention < 95) ankiXP *= 1.2
  else ankiXP *= 1.5

  let passmedXP = passmedQuestions * 3
  if (passmedScore < 50) passmedXP *= 0.5
  else if (passmedScore < 70) passmedXP *= 0.8
  else if (passmedScore < 85) passmedXP *= 1.0
  else if (passmedScore < 95) passmedXP *= 1.3
  else passmedXP *= 1.6

  return Math.round(ankiXP + passmedXP)
}

export function getTotalXP(sessions: StudySession[]): number {
  return sessions.reduce((a, s) => a + s.xpEarned, 0)
}

export function getStreak(sessions: StudySession[]): number {
  if (!sessions.length) return 0
  const today = new Date().toISOString().slice(0, 10)
  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse()

  // streak must include today or yesterday
  if (dates[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (dates[0] !== yesterday) return 0
  }

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) streak++
    else break
  }
  return streak
}
