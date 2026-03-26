import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { useStore } from '../store'

function getLast14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10))
  }
  return days
}

export function StatsCharts() {
  const { sessions } = useStore()
  const days = getLast14Days()

  const dailyXP = days.map((date) => ({
    date: date.slice(5), // MM-DD
    xp: sessions.filter((s) => s.date === date).reduce((a, s) => a + s.xpEarned, 0),
  }))

  const dailyAccuracy = days.map((date) => {
    const daySessions = sessions.filter((s) => s.date === date && s.passmedQuestions > 0)
    const avg = daySessions.length
      ? daySessions.reduce((a, s) => a + s.passmedScore, 0) / daySessions.length
      : null
    return { date: date.slice(5), accuracy: avg !== null ? Math.round(avg) : null }
  })

  const tooltipStyle = {
    backgroundColor: '#111827',
    border: '1px solid #374151',
    borderRadius: 8,
    color: '#fff',
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-white font-semibold">Stats — Last 14 Days</h2>

      <div>
        <div className="text-gray-400 text-sm mb-2">Daily XP</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={dailyXP} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1f2937' }} />
            <Bar dataKey="xp" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div className="text-gray-400 text-sm mb-2">Passmed Accuracy %</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={dailyAccuracy} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#2dd4bf"
              strokeWidth={2}
              dot={{ fill: '#2dd4bf', r: 3 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
