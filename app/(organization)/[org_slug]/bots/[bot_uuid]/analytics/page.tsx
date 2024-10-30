"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', queries: 400 },
  { name: 'Tue', queries: 300 },
  { name: 'Wed', queries: 500 },
  { name: 'Thu', queries: 280 },
  { name: 'Fri', queries: 390 },
  { name: 'Sat', queries: 190 },
  { name: 'Sun', queries: 250 },
]

export default function AnalyticsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Queries per Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="queries" fill='hsl(var(--primary))' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}