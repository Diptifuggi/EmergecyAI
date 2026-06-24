import React, { useMemo, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Phone,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Zap,
  Activity,
  Clock,
  MapPin,
  RefreshCw,
  Eye,
} from 'lucide-react'

import StatCard from '@/components/ui/StatCard'
import { PriorityBadge, StatusBadge } from '@/components/ui'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
} from '@/components/ui'

import dashboardApi from '@/api/dashboardApi'
import formatters from '@/lib/formatters'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title, PointElement, LineElement)

const CHART_HEIGHT = 180

const callRateOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [4, 4] } } },
}

const stackedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { stacked: true }, y: { stacked: true } },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const id = useId()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 30000,
  })

  const lastUpdated = useMemo(() => {
    const ts = data?.updated_at ? new Date(data.updated_at) : new Date()
    return format(ts, 'PPpp')
  }, [data])

  // Stat values
  const stats = useMemo(() => {
    const d = data || {}
    return [
      { label: 'Total Calls', value: formatters.number(d.total_calls || 0), icon: <Phone className="w-4 h-4 text-gray-700" />, iconBg: 'bg-gray-100', delta: d.total_calls_delta || 0, deltaDirection: d.total_calls_delta >= 0 ? 'up' : 'down' },
      { label: 'Critical', value: formatters.number(d.critical_calls || 0), icon: <AlertTriangle className="w-4 h-4 text-yellow-700" />, iconBg: 'bg-yellow-100', delta: d.critical_calls_delta || 0, deltaDirection: d.critical_calls_delta >= 0 ? 'up' : 'down' },
      { label: "Today's Calls", value: formatters.number(d.todays_calls || 0), icon: <TrendingUp className="w-4 h-4 text-gray-700" />, iconBg: 'bg-gray-100', delta: d.todays_calls_delta || 0, deltaDirection: d.todays_calls_delta >= 0 ? 'up' : 'down' },
      { label: 'Resolved', value: formatters.number((d.calls_by_status?.Resolved) || 0), icon: <CheckCircle2 className="w-4 h-4 text-green-700" />, iconBg: 'bg-green-100', delta: d.resolved_delta || 0, deltaDirection: d.resolved_delta >= 0 ? 'up' : 'down' },
      { label: 'Dispatched', value: formatters.number(d.active_incidents || 0), icon: <Zap className="w-4 h-4 text-indigo-700" />, iconBg: 'bg-indigo-100', delta: d.dispatched_delta || 0, deltaDirection: d.dispatched_delta >= 0 ? 'up' : 'down' },
      { label: 'Avg Severity', value: `${((d.average_severity || 0) / 100).toFixed(1)}/100`, icon: <Activity className="w-4 h-4 text-purple-700" />, iconBg: 'bg-purple-100', delta: d.average_severity_delta || 0, deltaDirection: d.average_severity_delta >= 0 ? 'up' : 'down' },
      { label: 'Pending', value: formatters.number(d.calls_by_status?.Pending || 0), icon: <Clock className="w-4 h-4 text-gray-700" />, iconBg: 'bg-gray-100', delta: d.pending_delta || 0, deltaDirection: d.pending_delta >= 0 ? 'up' : 'down' },
      { label: 'Active Incidents', value: formatters.number(d.active_incidents || 0), icon: <MapPin className="w-4 h-4 text-red-700" />, iconBg: 'bg-red-100', delta: d.active_incidents_delta || 0, deltaDirection: d.active_incidents_delta >= 0 ? 'up' : 'down' },
    ]
  }, [data])

  // Call Rate chart data
  const callRateData = useMemo(() => {
    const days = (data?.call_rate?.labels && data.call_rate.labels.length) ? data.call_rate.labels : (() => {
      const arr = []
      for (let i = 13; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        arr.push(format(d, 'MMM d'))
      }
      return arr
    })()

    const values = data?.call_rate?.values || new Array(days.length).fill(0)

    return {
      labels: days,
      datasets: [
        {
          label: 'Call Rate',
          data: values,
          backgroundColor: '#111',
        },
      ],
    }
  }, [data])

  // Event Status doughnut
  const eventStatusData = useMemo(() => {
    const counts = data?.event_status || {}
    const pending = counts.Pending || 0
    const processing = counts.Processing || 0
    const assigned = counts.Assigned || 0
    const resolved = counts.Resolved || 0
    const total = pending + processing + assigned + resolved || 1
    return {
      datasets: [
        {
          data: [pending, processing, assigned, resolved],
          backgroundColor: ['#000', '#555', '#999', '#ddd'],
        },
      ],
      labels: ['Pending', 'Processing', 'Assigned', 'Resolved'],
      meta: { total },
    }
  }, [data])

  // Calls by Category - stacked bar
  const categoryStackedData = useMemo(() => {
    const categories = data?.calls_by_category_top5 || []
    const states = data?.state_breakdown || [] // expected [{state, counts: {cat1: n, cat2: n}}]

    const labels = categories.map((c) => c.name)
    const colors = ['#111', '#333', '#555', '#777', '#aaa']

    const datasets = (categories || []).map((cat, idx) => ({
      label: cat.name,
      data: states.map((s) => (s.counts?.[cat.name] || 0)),
      backgroundColor: colors[idx % colors.length],
    }))

    return { labels: states.map((s) => s.state || 'Unknown'), datasets }
  }, [data])

  // Severity distribution horizontal
  const severityData = useMemo(() => {
    const s = data?.severity_distribution || { Critical: 0, 'Very High': 0, High: 0, Moderate: 0, Low: 0 }
    const labels = ['Critical', 'Very High', 'High', 'Moderate', 'Low']
    const colors = ['#dc2626', '#f97316', '#f59e0b', '#16a34a', '#3b82f6']
    return {
      labels,
      datasets: [
        {
          label: 'Severity',
          data: labels.map((l) => s[l] || 0),
          backgroundColor: colors,
        },
      ],
    }
  }, [data])

  // Recent critical calls
  const recent = data?.recent_critical_calls || []

  const callTypeRatio = useMemo(() => {
    const ratio = data?.call_type_ratio || { voice: 0, sms: 0, other: 0 }
    const labels = Object.keys(ratio)
    const values = labels.map((k) => ratio[k])
    const colors = ['#111', '#555', '#999']
    return { labels, datasets: [{ data: values, backgroundColor: colors }] }
  }, [data])

  const onView = (id) => navigate(`/calls/${id}`)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Operations Dashboard</h1>
          <div className="text-sm text-gray-500">National Emergency Response Center · 112 / 100 / 101 / 108</div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="text-right">
            <div className="text-xs text-gray-500">Last Updated:</div>
            <div className="font-medium">{lastUpdated}</div>
          </div>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? new Array(8).fill(0).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))
          : stats.map((s, idx) => (
              <StatCard key={idx} icon={s.icon} iconBg={s.iconBg} label={s.label} value={s.value} delta={s.delta} deltaDirection={s.deltaDirection} />
            ))}
      </div>

      {/* Row 1 charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Call Rate — Last 14 Days</h3>
          </div>
          <div style={{ height: CHART_HEIGHT }}>
            {isLoading ? <Skeleton className="h-full w-full" /> : <Bar data={callRateData} options={callRateOptions} />}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Event Status</h3>
          </div>
          <div style={{ height: CHART_HEIGHT }} className="flex flex-col md:flex-row items-center">
            <div className="w-36 h-36">
              {isLoading ? <Skeleton className="w-36 h-36 rounded-full" /> : <Doughnut data={eventStatusData} options={doughnutOptions} />}
            </div>
            <div className="ml-4 flex-1">
              {!isLoading && (
                <div>
                  <div className="text-sm text-gray-500">Total Count</div>
                  <div className="text-2xl font-semibold">{eventStatusData.meta.total}</div>

                  <div className="mt-4 space-y-2">
                    {eventStatusData.labels.map((label, i) => {
                      const count = eventStatusData.datasets[0].data[i] || 0
                      const pct = ((count / eventStatusData.meta.total) * 100).toFixed(1)
                      const color = eventStatusData.datasets[0].backgroundColor[i]
                      return (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: color }} />
                            <div className="text-sm">{label}</div>
                          </div>
                          <div className="text-sm text-gray-600">{count} • {pct}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Calls by Category — State Breakdown</h3>
          </div>
          <div style={{ height: CHART_HEIGHT }}>
            {isLoading ? <Skeleton className="h-full w-full" /> : <Bar data={categoryStackedData} options={stackedOptions} />}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Severity Distribution</h3>
          </div>
          <div style={{ height: CHART_HEIGHT }}>
            {isLoading ? <Skeleton className="h-full w-full" /> : <Bar data={severityData} options={{ ...stackedOptions, indexAxis: 'y' }} />}
          </div>
          {!isLoading && (
            <div className="mt-3 space-y-2">
              {severityData.labels.map((label, i) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: severityData.datasets[0].backgroundColor[i] }} />
                    <div className="text-sm">{label}</div>
                  </div>
                  <div className="text-sm text-gray-600">{severityData.datasets[0].data[i]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Recent Critical Calls</h3>
          </div>

          <div>
            {isLoading ? (
              <div className="space-y-2">
                {new Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/12" />
                    <Skeleton className="h-4 w-1/12" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-2 py-1 border-b">
                  <div className="col-span-4">Caller + Phone</div>
                  <div className="col-span-1">Time</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-1">Score</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">View</div>
                </div>

                {recent.map((r) => (
                  <div key={r.id} className={`grid grid-cols-12 gap-2 items-center px-2 py-3 border-l-4 ${r.priority === 'Critical' ? 'border-red-500' : r.priority === 'Very High' ? 'border-orange-500' : 'border-transparent'}`}>
                    <div className="col-span-4">
                      <div className="text-sm font-medium">{r.caller_name}</div>
                      <div className="text-xs text-gray-500">{r.phone}</div>
                    </div>
                    <div className="col-span-1 text-sm">{format(new Date(r.time), 'hh:mm a')}</div>
                    <div className="col-span-2 text-sm">{r.category}</div>
                    <div className="col-span-1"><PriorityBadge value={r.priority} /></div>
                    <div className="col-span-1 flex items-center">
                      <div className="w-8 h-3 bg-gray-200 rounded mr-2" style={{ width: 30 }}>
                        <div className="h-3 bg-green-500 rounded" style={{ width: `${Math.min(100, r.score || 0)}%` }} />
                      </div>
                      <div className="text-sm">{r.score}</div>
                    </div>
                    <div className="col-span-2"><StatusBadge value={r.status} /></div>
                    <div className="col-span-1">
                      <Button size="sm" onClick={() => onView(r.id)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="mb-3">
            <h3 className="text-lg font-medium">India Emergency Network</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 border rounded-md flex flex-col items-start">
              <div className="text-sm font-medium">ERSS 112</div>
              <div className="text-xs text-gray-500">Emergency Response</div>
            </div>
            <div className="p-3 border rounded-md flex flex-col items-start">
              <div className="text-sm font-medium">Police 100</div>
              <div className="text-xs text-gray-500">Law Enforcement</div>
            </div>
            <div className="p-3 border rounded-md flex flex-col items-start">
              <div className="text-sm font-medium">Ambulance 108</div>
              <div className="text-xs text-gray-500">Medical</div>
            </div>
            <div className="p-3 border rounded-md flex flex-col items-start">
              <div className="text-sm font-medium">Fire 101</div>
              <div className="text-xs text-gray-500">Fire & Rescue</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Call Type Ratio</div>
            <div style={{ height: 120 }} className="mt-3">
              {isLoading ? <Skeleton className="h-full w-full" /> : <Doughnut data={callTypeRatio} options={doughnutOptions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
