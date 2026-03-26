import type { Achievement, StudySession } from '../types'

function totalQuestions(sessions: StudySession[]) {
  return sessions.reduce((a, s) => a + s.passmedQuestions, 0)
}
function totalCards(sessions: StudySession[]) {
  return sessions.reduce((a, s) => a + s.ankiCards, 0)
}
function sessionsForSpecialty(sessions: StudySession[], specialty: string) {
  return sessions.filter((s) => s.specialty === specialty)
}
function avgAccuracy(sessions: StudySession[]) {
  if (!sessions.length) return 0
  return sessions.reduce((a, s) => a + s.passmedScore, 0) / sessions.length
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first Passmed session',
    icon: '🩸',
    xpReward: 100,
    condition: (s) => s.some((x) => x.passmedQuestions > 0),
  },
  {
    id: 'century',
    title: 'Century',
    description: 'Answer 100 Passmed questions total',
    icon: '💯',
    xpReward: 200,
    condition: (s) => totalQuestions(s) >= 100,
  },
  {
    id: 'question_machine',
    title: 'Question Machine',
    description: 'Answer 1,000 Passmed questions total',
    icon: '⚙️',
    xpReward: 500,
    condition: (s) => totalQuestions(s) >= 1000,
  },
  {
    id: 'card_shark',
    title: 'Card Shark',
    description: 'Review 500 Anki cards total',
    icon: '🃏',
    xpReward: 200,
    condition: (s) => totalCards(s) >= 500,
  },
  {
    id: 'memory_palace',
    title: 'Memory Palace',
    description: 'Review 5,000 Anki cards total',
    icon: '🏛️',
    xpReward: 500,
    condition: (s) => totalCards(s) >= 5000,
  },
  {
    id: 'cardio_god',
    title: 'Cardio God',
    description: '75%+ accuracy in Cardiology over 50 questions',
    icon: '❤️',
    xpReward: 400,
    condition: (s) => {
      const sp = sessionsForSpecialty(s, 'Cardiology')
      return totalQuestions(sp) >= 50 && avgAccuracy(sp) >= 75
    },
  },
  {
    id: 'neuro_ninja',
    title: 'Neuro Ninja',
    description: '75%+ accuracy in Neurology over 50 questions',
    icon: '🧠',
    xpReward: 400,
    condition: (s) => {
      const sp = sessionsForSpecialty(s, 'Neurology')
      return totalQuestions(sp) >= 50 && avgAccuracy(sp) >= 75
    },
  },
  {
    id: 'consistent',
    title: 'Consistent',
    description: 'Achieve a 7-day streak',
    icon: '🔥',
    xpReward: 300,
    condition: (s) => getMaxStreak(s) >= 7,
  },
  {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Achieve a 30-day streak',
    icon: '⚔️',
    xpReward: 1000,
    condition: (s) => getMaxStreak(s) >= 30,
  },
  {
    id: 'breadth',
    title: 'Breadth of Knowledge',
    description: 'Study 10 different specialties',
    icon: '🗺️',
    xpReward: 600,
    condition: (s) => new Set(s.map((x) => x.specialty)).size >= 10,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% in a Passmed session of 10+ questions',
    icon: '✨',
    xpReward: 500,
    condition: (s) => s.some((x) => x.passmedScore === 100 && x.passmedQuestions >= 10),
  },
  {
    id: 'the_consultant',
    title: 'The Consultant',
    description: 'Reach max rank: Consultant',
    icon: '👨‍⚕️',
    xpReward: 2000,
    condition: (s) => s.reduce((a, x) => a + x.xpEarned, 0) >= 80000,
  },
]

function getMaxStreak(sessions: StudySession[]): number {
  if (!sessions.length) return 0
  const dates = [...new Set(sessions.map((s) => s.date))].sort()
  let max = 1
  let current = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      current++
      max = Math.max(max, current)
    } else {
      current = 1
    }
  }
  return max
}
