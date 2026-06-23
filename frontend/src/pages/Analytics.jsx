import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '@/api/analyticsApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'
import { Bar, Line } from 'react-chartjs-2'

export default function Analytics() {
  const { data, isLoading, error } = useQuery({ queryKey: ['analytics'], queryFn: getAnalytics })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  const categoryData = {
    labels: data?.by_category?.map(c=>c.category)||[],
    datasets: [{label:'Calls', data: data?.by_category?.map(c=>c.count)||[], backgroundColor:'#111'}]
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Calls per Category"><Bar data={categoryData} /></Card>
        <Card title="Daily Trends"><Line data={{labels:data?.daily?.map(d=>d.date)||[], datasets:[{label:'Calls', data:data?.daily?.map(d=>d.count)||[], borderColor:'#111'}]}}/></Card>
      </div>
    </div>
  )
}
