export type Specialty =
  | 'Cardiology'
  | 'Respiratory'
  | 'Gastroenterology'
  | 'Neurology'
  | 'Renal'
  | 'Endocrinology'
  | 'Haematology'
  | 'Infectious Disease'
  | 'Rheumatology'
  | 'Dermatology'
  | 'Ophthalmology'
  | 'ENT'
  | 'Surgery'
  | 'Orthopaedics'
  | 'Obstetrics & Gynaecology'
  | 'Paediatrics'
  | 'Psychiatry'
  | 'Emergency Medicine'
  | 'Pharmacology'
  | 'Statistics & EBM'

export interface StudySession {
  id: string
  date: string // ISO date string YYYY-MM-DD
  ankiCards: number
  ankiRetention: number // 0-100
  passmedQuestions: number
  passmedScore: number // 0-100
  specialty: Specialty
  xpEarned: number
  bossCompleted?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (sessions: StudySession[]) => boolean
  xpReward: number
}

export interface UnlockedAchievement {
  achievementId: string
  unlockedAt: string // ISO date string
}

export interface WeeklyBoss {
  weekStart: string // ISO date string (Monday)
  specialty: Specialty
  targetQuestions: number
  targetAccuracy: number
  xpReward: number
  badgeTitle: string
  completed: boolean
}

export type Rank =
  | 'Fresher'
  | 'Pre-clinical'
  | 'Clinical Year'
  | 'F1 Doctor'
  | 'F2 Doctor'
  | 'SHO'
  | 'SpR'
  | 'Registrar'
  | 'Consultant'

export interface RankThreshold {
  rank: Rank
  minXP: number
  color: string
  emoji: string
}
