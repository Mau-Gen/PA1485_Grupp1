export default function BlueView() {
    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/*Blue Team View*/}
            <div className="w-96 bg-slate-800 p-6 flex flex-col gap-6 border-r-4 border-blue-600">
                <div>
                    <h1 className="text-3xl font-bold text-blue-400">Blue Team</h1>
                    <p className="text-sm text-slate-400 mt-1">Secure the system</p>    
                </div>

                {/* Budget */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-1">Effort Budget</h2>
                    <div className="text-3xl font-mono text-blue-300">15 / 20</div>
                </div>

                {/* Mitigation Catalogue */}
                <div className="flex-1 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-3">Mitigation Catalogue</h2>
                    <div className="p-3 bg-slate-900 rounded border border-slate-700 mb-2 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="font-medium">Encrypt Database (Example)</div>
                        <div className="text-sm text-slate-400">Cost: 5 pts</div>        
                    </div>
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors">
                    Lock Choices
                </button>
            </div>

            {/* Shared DFD space */}
            <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center">
                <p className="text-slate-600 text-xl font-medium border-2 border-dashed border-slate-800 p-12 rounded-xl">
                    DFD Presented Here    
                </p>
            </div>
        </div>
    )
}