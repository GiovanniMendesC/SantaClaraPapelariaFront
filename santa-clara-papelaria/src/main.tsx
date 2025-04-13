import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { AuthProvider } from './AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StrictMode>
      
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </StrictMode>,
  </React.StrictMode>
)
