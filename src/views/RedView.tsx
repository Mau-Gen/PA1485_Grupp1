export default function RedView() {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Red Team View */}
      <div className="w-96 bg-slate-800 p-6 flex flex-col gap-6 border-r-4 border-red-600">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Red Team</h1>
          <p className="text-sm text-slate-400 mt-1">Pick three attack sequences</p>
        </div>
        
        {/* Chosen attacks (max 3) */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-2">Chosen attacks</h2>
          <div className="text-sm text-red-400 font-mono">1 of 3 chosen</div>
        </div>

        {/* Catalogue for attack sequences */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Attack Catalogue</h2>
          <div className="p-3 bg-slate-900 rounded border border-slate-700 mb-2 hover:border-red-500 cursor-pointer transition-colors">
            <div className="font-medium text-red-100">SQL Injection (Example)</div>
            <div className="text-sm text-slate-400">Target: Database</div>
          </div>
        </div>
        
        <button className="w-full py-3 bg-red-600 hover:bg-red-500 rounded font-bold transition-colors">
          Execute Attack
        </button>
      </div>

      {/* Shared DFD Space */}
      <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center">
        <p className="text-slate-600 text-xl font-medium border-2 border-dashed border-slate-800 p-12 rounded-xl">
          DFD rendered here
        </p>
      </div>
    </div>
  )
}