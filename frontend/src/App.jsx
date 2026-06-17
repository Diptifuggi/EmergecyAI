import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CssBaseline, Container } from '@mui/material'
import routes from './routes'

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Container>
    </>
  )
}
