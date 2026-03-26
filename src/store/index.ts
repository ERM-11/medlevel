import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudySession, UnlockedAchievement, WeeklyBoss } from '../types'
import { calculateXP } from '../data/xp'
import { ACHIEVEMENTS } from '../data/achievements'

interface AppState {
  sessions: StudySession[]
  unlockedAchievements: UnlockedAchievement[]
  weeklyBosses: WeeklyBoss[]
  streakShields: number
  addSession: (session: Omit<StudySession, 'id' | 'xpEarned'>) => { xpEarned: number; newAchievements: string[] }
  useStreakShield: () => void
  completeBoss: (weekStart: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessions: [],
      unlockedAchievements: [],
      weeklyBosses: [],
      streakShields: 3,

      addSession: (sessionData) => {
        const xpEarned = calculateXP(
          sessionData.ankiCards,
          sessionData.ankiRetention,
          sessionData.passmedQuestions,
          sessionData.passmedScore,
        )
        const newSession: StudySession = {
          ...sessionData,
          id: crypto.randomUUID(),
          xpEarned,
        }

        const prevSessions = get().sessions
        const prevUnlocked = get().unlockedAchievements
        const allSessions = [...prevSessions, newSession]

        // check for new achievement unlocks
        const newAchievements: string[] = []
        for (const ach of ACHIEVEMENTS) {
          const alreadyUnlocked = prevUnlocked.some((u) => u.achievementId === ach.id)
          if (!alreadyUnlocked && ach.condition(allSessions)) {
            newAchievements.push(ach.id)
          }
        }

        const newUnlocked: UnlockedAchievement[] = newAchievements.map((id) => ({
          achievementId: id,
          unlockedAt: new Date().toISOString(),
        }))

        set((state) => ({
          sessions: allSessions,
          unlockedAchievements: [...state.unlockedAchievements, ...newUnlocked],
        }))

        return { xpEarned, newAchievements }
      },

      useStreakShield: () => {
        set((state) => ({ streakShields: Math.max(0, state.streakShields - 1) }))
      },

      completeBoss: (weekStart) => {
        set((state) => ({
          weeklyBosses: state.weeklyBosses.map((b) =>
            b.weekStart === weekStart ? { ...b, completed: true } : b
          ),
        }))
      },
    }),
    { name: 'medlevel-storage' }
  )
)
