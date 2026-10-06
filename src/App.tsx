import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BlueView from './views/BlueView'
import RedView from './views/RedView'
import ResolutionView from './views/ResolutionView'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#222', display: 'flex', gap: '1rem' }}>
        <Link to="/blue" style={{ color: 'lightblue' }}>Blue Team</Link>
        <Link to="/red" style={{ color: 'lightcoral' }}>Red Team</Link>
        <Link to="/resolution" style={{ color: 'gold' }}>Result</Link>
      </nav>
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<h1>Welcome to ThreMoLIA</h1>} />
          <Route path="/blue" element={<BlueView />} />
          <Route path="/red" element={<RedView />} />
          <Route path="/resolution" element={<ResolutionView />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}