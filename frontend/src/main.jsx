// Opt-in to React Router v7 future flags to suppress upgrade warnings
// These flags should be set before react-router is imported/executed.
// They are non-destructive and only affect dev-time warnings.
if (typeof window !== 'undefined') {
  window.__RR__ = window.__RR__ || {}
  window.__RR__.v7_startTransition = true
  window.__RR__.v7_relativeSplatPath = true
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Chart, registerables } from 'chart.js'
// Import the explicit JSX entry to avoid accidental resolution to App.tsx
import App from '@/App.jsx'
import '@/index.css'

Chart.register(...registerables)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
