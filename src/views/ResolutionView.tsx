export default function ResolutionView() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6">
      <div className="w-full max-w-4xl bg-slate-900 p-8 rounded-lg border border-slate-800">
        <h1 className="text-3xl font-bold text-center mb-8">Result</h1>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 p-6 rounded border-t-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Blue Team</h2>
            <p className="text-slate-300">Remaining budget: <span className="font-mono text-white">5 pts</span></p>
            <p className="text-slate-300">Blocked attacks: <span className="font-mono text-green-400">2</span></p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-red-400 mb-4">Red Team</h2>
            <p className="text-slate-300">Attacks chosen: <span className="font-mono text-white">3</span></p>
            <p className="text-slate-300">Succeded intrusions: <span className="font-mono text-green-400">1</span></p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded border border-slate-700">
          <h2 className="text-lg font-bold mb-4">Systemlog</h2>
          <div className="font-mono text-sm space-y-2 text-slate-400">
            <p><span className="text-blue-400">[BLUE]</span> Encrypted Database-1.</p>
            <p><span className="text-red-400">[RED]</span> SQL Injection towards Database-1 failed (Blocked).</p>
            <p><span className="text-red-400">[RED]</span> Phishing-campaign towards User-Node succeded.</p>
          </div>
        </div>
      </div>
    </div>
  )
}