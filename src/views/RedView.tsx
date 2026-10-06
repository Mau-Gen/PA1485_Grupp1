export default function RedView() {
  return (
    <div className="flex h-full text-white">
      {/* Red Team View */}
      <div className="w-72 bg-slate-800 p-4 flex flex-col gap-4 border-r-2 border-red-600 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-red-500">Red Team</h1>
          <p className="text-xs text-slate-400 mt-1">Pick three attack sequences</p>
        </div>

        {/* Chosen attacks (max 3) */}
        <div className="bg-slate-900 p-3 rounded border border-slate-700">
          <h2 className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Chosen attacks</h2>
          <div className="text-xl text-red-400 font-mono">1 of 3 chosen</div>
        </div>

        {/* Catalogue for attack sequences */}
        <div className="flex-1 overflow-y-auto pr-1">
          <h2 className="text-sm font-semibold mb-2">Attack Catalogue</h2>
          <div className="p-2 bg-slate-900 rounded border border-slate-700 mb-2 hover:border-red-500 cursor-pointer transition-colors text-sm">
            <div className="font-medium text-red-100">SQL Injection (Example)</div>
            <div className="text-xs text-slate-400 mt-1">Target: Database</div>
          </div>
        </div>

        <button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-bold transition-colors">
          Excecute Attack
        </button>
      </div>

      {/* Shared DFD Space */}
      <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center">
        <p className="text-slate-600 text-sm font-medium border-2 border-dashed border-slate-800 p-6 rounded-lg text-center">
          DFD rendered here
        </p>
      </div>

      <div className="w-80 bg-slate-900 p-4 flex flex-col border-l-2 border-slate-800 shrink-0">
        <h2 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">STRIDE-Analysis</h2>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-2 font-medium rounded-tl">Category</th>
                <th className="p-2 font-medium rounded-tr">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-2 font-medium text-white">Spoofing</td>
                <td className="p-2 text-red-400">Critical</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-white">Tampering</td>
                <td className="p-2 text-yellow-500">Warning</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-white">Repudiation</td>
                <td className="p-2 text-green-400">Secure</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-white">Information Disclosure</td>
                <td className="p-2 text-red-400">Critical</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-white">Denial of Service</td>
                <td className="p-2 text-slate-500">-</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-white">Elevation of Privilege</td>
                <td className="p-2 text-slate-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}