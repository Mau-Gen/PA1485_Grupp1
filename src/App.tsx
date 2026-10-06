import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StartView from './views/StartView'
import RulesView from './views/RulesView'
import BlueView from './views/BlueView'
import RedView from './views/RedView'
import ResolutionView from './views/ResolutionView'

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
        <nav className="p-3 bg-slate-900 border-b border-slate-800 flex gap-6 text-sm font-medium items-center">
          <Link to="/" className="text-white hover:text-slate-300 font-bold tracking-wide">ThreMoLIA</Link>
          <div className="w-px h-4 bg-slate-700"></div>
          <Link to="/rules" className="text-slate-400 hover:text-white">Rules</Link>
          <Link to="/blue" className="text-blue-400 hover:text-blue-300">Blue Team</Link>
          <Link to="/red" className="text-red-400 hover:text-red-300">Red Team</Link>
          <Link to="/resolution" className="text-yellow-500 hover:text-yellow-400 ml-auto">Result</Link>
        </nav>
        
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<StartView />} />
            <Route path="/rules" element={<RulesView />} />
            <Route path="/blue" element={<BlueView />} />
            <Route path="/red" element={<RedView />} />
            <Route path="/resolution" element={<ResolutionView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}