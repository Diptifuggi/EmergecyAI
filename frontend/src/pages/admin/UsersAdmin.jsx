import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { listUsers } from '@/api/usersApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'

export default function UsersAdmin(){
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: () => listUsers() })
  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <Card>
        <table className="w-full text-left">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {data?.map(u => (
              <tr key={u.id} className="border-t"><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role_name}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
