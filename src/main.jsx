import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router'
import './index.css'
import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.js'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
)
