export default function RulesView() {
  return (
    <div className="flex flex-col items-center h-full bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 p-8 rounded-lg border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-yellow-500">Game Rules</h1>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">Concept</h2>
            <p>Description</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-blue-400 mb-2">Blue Team (Defence)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Has a limited budget (Effort Points).</li>
              <li>Deploys defence mechanisms to protect valuable assets.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-red-500 mb-2">Red Team (Attack)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Picks up to three attack sequences.</li>
              <li>Attempts to exploit weaknesses in the system.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}