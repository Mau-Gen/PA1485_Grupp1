import { Link } from 'react-router-dom'
import { useGame } from '../game/useGame'
import { assets, defenseBudget, defenses, vulnerabilities } from '../game/gameData'

export default function ResolutionView() {
  const { game, remainingBudget } = useGame()
  const blocked = game.attackResults.filter(({ status }) => status === 'blocked').length
  const succeeded = game.attackResults.filter(({ status }) => status === 'succeeded').length

  return (
    <div className="h-full overflow-y-auto bg-[#17231e] p-4 text-[#f4efdf] sm:p-8">
      <main className="mx-auto max-w-5xl">
        <header className="mb-6 border-b border-[#65766a] pb-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#c7b78b]">THREMOLIA / ROUND REPORT</p>
          <h1 className="mt-2 text-2xl font-bold text-[#f2e8ca] sm:text-3xl">Exercise results</h1>
          <p className="mt-2 text-sm text-[#c0c9bd]">Red’s attack simulations resolved against Blue’s locked defenses.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="border border-[#63796a] border-t-4 border-t-[#81a2c4] bg-[#202d28] p-5">
            <h2 className="text-lg font-bold text-[#a9c7e1]">Blue Team</h2>
            <dl className="mt-4 space-y-2 text-sm text-[#d0d8ce]">
              <div className="flex justify-between gap-3"><dt>Defense budget left</dt><dd className="font-mono text-white">{remainingBudget} / {defenseBudget} pts</dd></div>
              <div className="flex justify-between gap-3"><dt>Confirmed findings</dt><dd className="font-mono text-white">{game.identifiedVulnerabilities.length}</dd></div>
              <div className="flex justify-between gap-3"><dt>Attacks blocked</dt><dd className="font-mono text-[#a9d19f]">{blocked}</dd></div>
            </dl>
          </article>

          <article className="border border-[#63796a] border-t-4 border-t-[#c08070] bg-[#202d28] p-5">
            <h2 className="text-lg font-bold text-[#e3a99a]">Red Team</h2>
            <dl className="mt-4 space-y-2 text-sm text-[#d0d8ce]">
              <div className="flex justify-between gap-3"><dt>Attack options selected</dt><dd className="font-mono text-white">{game.selectedAttacks.length}</dd></div>
              <div className="flex justify-between gap-3"><dt>Simulations completed</dt><dd className="font-mono text-white">{game.attackResults.length}</dd></div>
              <div className="flex justify-between gap-3"><dt>Successful intrusions</dt><dd className="font-mono text-[#e3a99a]">{succeeded}</dd></div>
            </dl>
          </article>
        </section>

        <section className="mt-5 border border-[#63796a] bg-[#202d28] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#e4d7b4]">Attack simulation log</h2>
          <div className="mt-3 divide-y divide-[#44564b]">
            {game.attackResults.map((result) => {
              const vulnerability = vulnerabilities.find(({ id }) => id === result.vulnerabilityId)
              const asset = vulnerability && assets.find(({ id }) => id === vulnerability.assetId)
              const defense = defenses.find(({ vulnerabilityId }) => vulnerabilityId === result.vulnerabilityId)
              return (
                <article key={result.vulnerabilityId} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-[#aebaae]">{result.vulnerabilityId} · {asset?.name} · {asset?.address}</p>
                    <h3 className="text-sm font-semibold text-[#f0eadb]">{vulnerability?.attackName}</h3>
                    <p className="text-xs text-[#b8c4b8]">{result.status === 'blocked' ? defense?.name ?? 'Selected mitigation' : 'No selected mitigation covered this vulnerability.'}</p>
                  </div>
                  <span className={`font-mono text-xs font-bold ${result.status === 'blocked' ? 'text-[#a9d19f]' : 'text-[#e3a99a]'}`}>
                    {result.status.toUpperCase()}
                  </span>
                </article>
              )
            })}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-4 border-t border-[#65766a] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#aebaae]">Defenses selected: {game.selectedDefenses.map((id) => defenses.find((defense) => defense.id === id)?.name).filter(Boolean).join(', ') || 'None'}.</p>
          <Link to="/" className="self-start border border-[#f0dca8] bg-[#d6c18d] px-4 py-2 text-sm font-bold text-[#1e2b23] hover:bg-[#f0dfad]">Start a new round</Link>
        </div>
      </main>
    </div>
  )
}