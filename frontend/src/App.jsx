import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        {/* Protected routes will be added in Phase 3 */}
      </Routes>
    </Router>
  )
}

export default App
