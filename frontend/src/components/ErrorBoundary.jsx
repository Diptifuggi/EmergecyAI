import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null } }
  static getDerivedStateFromError(error){ return { error } }
  componentDidCatch(error, info){ console.error('ErrorBoundary caught', error, info) }
  render(){
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <div className="text-sm text-gray-600 mt-2">{this.state.error?.message || 'An unexpected error occurred.'}</div>
            <div className="mt-4">
              <button onClick={()=> window.location.reload()} className="px-4 py-2 bg-zinc-900 text-white rounded">Reload</button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
