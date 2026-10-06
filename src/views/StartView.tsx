import { Link } from 'react-router-dom'

export default function HomeView() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6">
      <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
        ThreMoLIA
      </h1>
      <p className="text-lg text-slate-400 mb-8 max-w-2xl text-center">
        Choose to defend as Blue Team or exploit weaknesses as Red Team.
      </p>
      <div className="flex gap-4">
        <Link to="/blue" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors">Play as Blue</Link>
        <Link to="/red" className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded font-bold transition-colors">Play as Red</Link>
      </div>
      <div className="mt-6">
        <Link to="/rules" className="px-6 py-3 bg-slate-500 hover:bg-slate-300 rounded font-bold transition-colors">Rules</Link>
      </div>

    </div>
  )
}