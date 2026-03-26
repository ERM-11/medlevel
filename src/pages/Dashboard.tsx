import { CharacterCard } from '../components/CharacterCard'
import { StreakCalendar } from '../components/StreakCalendar'
import { WeeklyBossCard } from '../components/WeeklyBoss'
import { StatsCharts } from '../components/StatsCharts'

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="flex flex-col gap-5">
        <CharacterCard />
        <WeeklyBossCard />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-5">
        <StreakCalendar />
        <StatsCharts />
      </div>
    </div>
  )
}
