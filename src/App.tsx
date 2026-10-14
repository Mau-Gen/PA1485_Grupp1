import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import StartView from './views/StartView'
import RulesView from './views/RulesView'
import BlueView from './views/BlueView'
import RedView from './views/RedView'
import ResolutionView from './views/ResolutionView'
import { GameProvider } from './game/GameProvider'
import { useGame } from './game/useGame'

function AppRoutes() {
  const { game } = useGame()
  const destination = game.phase === 'complete' ? '/resolution' : game.stage === 'red' ? '/red' : '/blue'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950">
      <nav className="flex items-center gap-5 border-b border-slate-800 bg-slate-900 p-3 text-sm font-medium">
        <Link to="/" className="font-bold tracking-wide text-white hover:text-slate-300">ThreMoLIA</Link>
        <div className="h-4 w-px bg-slate-700" />
        <Link to="/rules" className="text-slate-400 hover:text-white">Rules</Link>
        <Link to="/" className="font-bold text-blue-300 hover:text-blue-200">Play</Link>
        <span className="ml-auto font-mono text-[10px] text-slate-400">
          {game.phase === 'complete' ? 'ROUND COMPLETE' : `${game.stage.toUpperCase()} / ${game.phase.toUpperCase()}`}
        </span>
      </nav>

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<StartView />} />
          <Route path="/rules" element={<RulesView />} />
          <Route path="/blue" element={game.stage === 'blue' && game.phase === 'preparation' ? <BlueView /> : <Navigate to={destination} replace />} />
          <Route path="/red" element={game.stage === 'red' && game.phase !== 'complete' ? <RedView /> : <Navigate to={destination} replace />} />
          <Route path="/resolution" element={game.phase === 'complete' ? <ResolutionView /> : <Navigate to={destination} replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  )
}