import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { listRoles } from '@/api/usersApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'

export default function RolesAdmin(){
  const { data, isLoading, error } = useQuery({ queryKey: ['roles'], queryFn: () => listRoles() })
  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Roles</h1>
      <Card>
        <ul>
          {data?.map(r => <li key={r.id}>{r.name}</li>)}
        </ul>
      </Card>
    </div>
  )
}
