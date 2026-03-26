import { useStore } from '../store'
import { SPECIALTY_ICONS } from '../data/specialties'
import type { Specialty } from '../types'

// Generate boss for current week
function getMondayOfWeek(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

const BADGE_FOR_SPECIALTY: Partial<Record<Specialty, string>> = {
  'Cardiology':         'Cardio Warrior',
  'Neurology':          'Neuro Knight',
  'Respiratory':        'Lung Champion',
  'Gastroenterology':   'GI Master',
  'Renal':              'Renal Ranger',
  'Haematology':        'Blood Mage',
  'Emergency Medicine': 'ED Veteran',
  'Pharmacology':       'Pharma Lord',
  'Endocrinology':      'Endo Expert',
  'Infectious Disease': 'ID Hunter',
  'Rheumatology':       'Joint Specialist',
  'Paediatrics':        'Paeds Pro',
  'Psychiatry':         'Mind Master',
  'Surgery':            'Surgical Ace',
  'Orthopaedics':       'Bone Breaker',
  'Obstetrics & Gynaecology': 'O&G Champion',
  'Dermatology':        'Skin Savant',
  'Ophthalmology':      'Eye Specialist',
  'ENT':                'ENT Expert',
  'Statistics & EBM':   'Evidence Guru',
}

export function WeeklyBossCard() {
  const { sessions } = useStore()
  const weekStart = getMondayOfWeek(new Date())

  // Pick from specialties that have had at least one session logged
  const studiedSpecialties = [...new Set(sessions.map((s) => s.specialty))]

  if (studiedSpecialties.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <div className="text-red-400 font-bold text-xs uppercase tracking-widest mb-2">⚔️ Weekly Boss</div>
        <div className="text-gray-500 text-sm">Log your first session to unlock the weekly boss challenge.</div>
      </div>
    )
  }

  // Deterministic pick based on week number, cycling through studied specialties
  const weekNum = Math.floor(new Date(weekStart).getTime() / (7 * 24 * 60 * 60 * 1000))
  const specialty = studiedSpecialties[weekNum % studiedSpecialties.length]
  const boss = {
    specialty,
    targetQ: 25,
    targetAcc: 70,
    badge: BADGE_FOR_SPECIALTY[specialty] ?? `${specialty} Champion`,
  }

  // Calculate progress this week
  const weekSessions = sessions.filter((s) => s.date >= weekStart && s.specialty === boss.specialty)
  const doneQ = weekSessions.reduce((a, s) => a + s.passmedQuestions, 0)
  const avgAcc = weekSessions.length
    ? weekSessions.reduce((a, s) => a + s.passmedScore, 0) / weekSessions.length
    : 0

  const progressPct = Math.min(100, Math.round((doneQ / boss.targetQ) * 100))
  const accMet = avgAcc >= boss.targetAcc || weekSessions.length === 0
  const bossDefeated = doneQ >= boss.targetQ && avgAcc >= boss.targetAcc

  return (
    <div className={`bg-gray-900 border rounded-2xl p-6 ${bossDefeated ? 'border-yellow-500/60' : 'border-red-800/60'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-red-400 font-bold text-xs uppercase tracking-widest">
          {bossDefeated ? '✅ Boss Defeated' : '⚔️ Weekly Boss'}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{SPECIALTY_ICONS[boss.specialty]}</span>
        <div>
          <div className="text-white font-bold">{boss.specialty} Challenge</div>
          <div className="text-gray-400 text-sm">
            {boss.targetQ} questions · {boss.targetAcc}%+ accuracy
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-yellow-400 font-bold">+800 XP</div>
          <div className="text-gray-500 text-xs">🏅 {boss.badge}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Questions</span>
          <span>{doneQ}/{boss.targetQ}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: bossDefeated ? '#facc15' : '#f87171',
            }}
          />
        </div>
      </div>

      {weekSessions.length > 0 && (
        <div className={`text-xs mt-2 ${accMet ? 'text-teal-400' : 'text-red-400'}`}>
          Accuracy this week: {Math.round(avgAcc)}%
          {accMet ? ' ✓' : ` (need ${boss.targetAcc}%)`}
        </div>
      )}
    </div>
  )
}
