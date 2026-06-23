// import React from 'react'
// import { Navigate } from 'react-router-dom'
// import { Loader2 } from 'lucide-react'
// import { useAuth } from '@/context/AuthContext'

// export default function ProtectedRoute({ children, requiredRole }) {
//   const { isLoading, isAuthenticated, user } = useAuth()
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center">
//         <Loader2 className="animate-spin" />
//       </div>
//     )
//   }
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   if (requiredRole && user?.role_name !== requiredRole) return <Navigate to="/dashboard" replace />
//   return children
// }
import React from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({
  children,
  requiredRole,
}) {
  const {
    isLoading,
    isAuthenticated,
    user,
  } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (
    requiredRole &&
    user?.role_name !== requiredRole
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}