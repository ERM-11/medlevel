import type { RankThreshold } from '../types'

export const RANKS: RankThreshold[] = [
  { rank: 'Med Student',          minXP: 0,      color: '#94a3b8', emoji: '🎓' },
  { rank: 'Pre-Clinical Student', minXP: 500,    color: '#60a5fa', emoji: '📚' },
  { rank: 'Clinical Student',     minXP: 2000,   color: '#34d399', emoji: '🏥' },
  { rank: 'Final Year Student',   minXP: 5000,   color: '#a78bfa', emoji: '📝' },
  { rank: 'F1 Doctor',            minXP: 10000,  color: '#f472b6', emoji: '⚕️' },
  { rank: 'F2 Doctor',            minXP: 18000,  color: '#fb923c', emoji: '💊' },
  { rank: 'Core Trainee',         minXP: 30000,  color: '#facc15', emoji: '🔬' },
  { rank: 'Registrar',            minXP: 50000,  color: '#f87171', emoji: '🩺' },
  { rank: 'Consultant',           minXP: 80000,  color: '#FF6B9D', emoji: '🦌' },
]

export function getRank(xp: number): RankThreshold {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i]
  }
  return RANKS[0]
}

export function getNextRank(xp: number): RankThreshold | null {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].minXP) return RANKS[i]
  }
  return null
}

export function getLevelProgress(xp: number): { current: number; next: number; percent: number } {
  const current = getRank(xp)
  const next = getNextRank(xp)
  if (!next) return { current: xp, next: xp, percent: 100 }
  const range = next.minXP - current.minXP
  const progress = xp - current.minXP
  return { current: xp, next: next.minXP, percent: Math.floor((progress / range) * 100) }
}
