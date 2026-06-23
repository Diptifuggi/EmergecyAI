import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/api/dashboardApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend)

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  const stats = data?.stats || { total_calls: 0, critical:0, active_dispatches:0, resolved:0, avg_response_time: 0 }

  const priorityData = {
    labels: data?.by_priority?.map((p) => p.priority) || [],
    datasets: [{ label: 'Calls', data: data?.by_priority?.map((p) => p.count) || [], backgroundColor: ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6'] }]
  }

  const categoryData = {
    labels: data?.by_category?.map((c) => c.category) || [],
    datasets: [{ data: data?.by_category?.map((c) => c.count) || [], backgroundColor: ['#111111','#444444','#888888','#bbbbbb'] }]
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Calls Today">{stats.total_calls}</Card>
        <Card title="Critical Cases">{stats.critical}</Card>
        <Card title="Active Dispatches">{stats.active_dispatches}</Card>
        <Card title="Resolved Cases">{stats.resolved}</Card>
        <Card title="Avg Response Time">{stats.avg_response_time} mins</Card>
        <Card title="AI Processing Status">{data?.ai_status || 'Idle'}</Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Calls by Priority"><Bar data={priorityData} /></Card>
        <Card title="Calls by Category"><Pie data={categoryData} /></Card>
        <Card title="Hourly Trends"><Line data={{labels: data?.hourly?.map(h=>h.hour)||[], datasets:[{label:'Calls', data:data?.hourly?.map(h=>h.count)||[], borderColor:'#111', backgroundColor:'#111'}]}}/></Card>
      </div>

      <div className="mt-6">
        <Card title="Recent Emergency Calls">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Call ID</th><th>Caller</th><th>Category</th><th>Priority</th><th>Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent?.map(call => (
                <tr key={call.id} className="border-t">
                  <td>{call.id}</td>
                  <td>{call.caller}</td>
                  <td>{call.category}</td>
                  <td>{call.priority}</td>
                  <td>{new Date(call.time).toLocaleString()}</td>
                  <td>{call.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
