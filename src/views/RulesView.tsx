export default function RulesView() {
  return (
    <div className="flex flex-col items-center h-full bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 p-8 rounded-lg border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-yellow-500">Game Rules</h1>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">Concept</h2>
            <p>ThreMoLIA is a two-team threat-modeling exercise. Blue Team turns a company briefing into a data-flow diagram, assesses its risks, and chooses defenses. Red Team then tests selected findings in a local simulation.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-blue-400 mb-2">Blue Team (Defence)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Read the Northstar Market company brief and place its checkout, cold-chain, stock, and loyalty processes in the DFD.</li>
              <li>Draw the trust boundaries at the customer, payment provider, sensor network, and head-office connections.</li>
              <li>Assess all six STRIDE categories for every process and trust boundary, then confirm to lock your choices and reveal the risks they surface. If risks are missed, you may redo the STRIDE table once at a cost of 2 defense points.</li>
              <li>You may write mitigation notes for identified threats, then use the limited defense budget to confirm which catalog mitigations to fund. Written notes are optional.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-red-500 mb-2">Red Team (Attack)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Discovers supermarket systems and scans them for the exercise findings.</li>
              <li>Selects up to four of the available attack simulations and sees whether Blue Team’s funded mitigations block them.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}