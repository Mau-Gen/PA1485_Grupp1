import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useGame } from '../game/useGame'
import { assets, vulnerabilities, type VulnerabilityId } from '../game/gameData'

type DesktopWindow = 'terminal' | VulnerabilityId

export default function RedView() {
  const [activeWindow, setActiveWindow] = useState<DesktopWindow | null>('terminal')
  const [command, setCommand] = useState('')
  const [lines, setLines] = useState([
    'THREMOLIA RED TEAM WORKSTATION  v1.4',
    'Isolated training environment. No external systems are contacted.',
    'Preparation: ping, scan <host>, list, inspect <id>, select <id>.',
  ])
  const terminalOutputRef = useRef<HTMLDivElement>(null)
  const { game, discoverAssets, discoverVulnerabilities, selectAttack, beginAttackPhase, resolveAttack } = useGame()

  useEffect(() => {
    const output = terminalOutputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [lines])

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = command.trim()
    if (!input) return

    const [verb, ...args] = input.split(/\s+/)
    const action = verb.toLowerCase()
    const reference = args[0]?.toUpperCase()
    const item = vulnerabilities.find((vulnerability) => vulnerability.id === reference)
    const asset = assets.find(({ address, host }) => address === reference || host.toUpperCase() === reference)
    let response: string[]

    if (action === 'help') {
      response = ['ping | assets | scan <IP-or-host> | list | inspect <VULN-ID> | select <VULN-ID>', 'status | phase attack | attack <VULN-ID>']
    } else if (action === 'ping') {
      if (game.phase !== 'preparation') {
        response = ['Asset discovery is only available during preparation.']
      } else {
        discoverAssets()
        response = [
          'Simulated ping sweep complete: isolated lab subnet 10.0.4.0/24.',
          ...assets.map(({ address, host }) => `${address}  ${host}  ONLINE`),
          'Run "scan <IP>" to check a discovered asset for potential vulnerabilities.',
        ]
      }
    } else if (action === 'assets') {
      const foundAssets = assets.filter(({ id }) => game.discoveredAssets.includes(id))
      response = foundAssets.length
        ? foundAssets.map(({ address, host, service }) => `${address}  ${host}  ${service}`)
        : ['No assets discovered. Run "ping" first.']
    } else if (action === 'scan') {
      if (game.phase !== 'preparation') {
        response = ['Asset scanning is only available during preparation.']
      } else if (!asset || !game.discoveredAssets.includes(asset.id)) {
        response = ['Asset not found in discovery results. Run "ping" and scan a discovered IP or hostname.']
      } else {
        const found = discoverVulnerabilities(asset.id)
        const findings = found.map((id) => {
          const finding = vulnerabilities.find(({ id: vulnerabilityId }) => vulnerabilityId === id)
          return `${id}  ${finding?.name}  [${finding?.severity}]`
        })
        response = [`Scan complete: ${asset.host} (${asset.address}).`, ...findings, 'Open the unlocked catalogue file or use "inspect <VULN-ID>".']
      }
    } else if (action === 'list') {
      const findings = vulnerabilities.filter(({ id }) => game.discoveredVulnerabilities.includes(id))
      response = findings.length
        ? findings.map(({ id, name, category, attackName }) => `${id}  ${name}  ${category}  [${attackName}]`)
        : ['No vulnerabilities identified yet. Run "ping", then "scan <IP>" on a discovered asset.']
    } else if (action === 'inspect') {
      const targetAsset = item && assets.find(({ id }) => id === item.assetId)
      response = item && game.discoveredVulnerabilities.includes(item.id)
        ? [`${item.id} / ${item.category} / ${item.severity}`, `Asset: ${targetAsset?.host} (${targetAsset?.address})`, item.summary, `Attack option: ${item.attackName}`, item.attackDescription]
        : ['Finding not identified. Run "ping", then "scan" its asset before inspecting it.']
    } else if (action === 'select') {
      if (!item) {
        response = ['Finding not found. Use "list" to see identified vulnerability IDs.']
      } else if (!game.discoveredVulnerabilities.includes(item.id)) {
        response = ['Finding not identified yet. Run "ping" and scan its asset before selecting it.']
      } else if (game.phase !== 'preparation') {
        response = ['Selection is locked after the preparation phase.']
      } else if (game.selectedAttacks.includes(item.id)) {
        response = [`${item.id} is already selected.`]
      } else if (game.selectedAttacks.length >= 3) {
        response = ['Selection limit reached: choose up to three briefings.']
      } else {
        selectAttack(item.id)
        response = [`${item.id} / ${item.attackName} added to the operation plan.`, `${game.selectedAttacks.length + 1} of 3 selections used.`]
      }
    } else if (action === 'status') {
      response = [
        `Phase: ${game.phase}`,
        `Assets discovered: ${game.discoveredAssets.length}`,
        `Vulnerabilities identified: ${game.discoveredVulnerabilities.length}`,
        `Selected attacks: ${game.selectedAttacks.length ? game.selectedAttacks.join(', ') : 'none'}`,
        `Attacks simulated: ${game.attackResults.length}`,
      ]
    } else if (action === 'phase' && args[0]?.toLowerCase() === 'attack') {
      if (game.selectedAttacks.length === 0) {
        response = ['Select at least one briefing before starting the attack phase.']
      } else if (beginAttackPhase()) {
        response = ['Attack phase started. Use "attack <ID>" to run a local simulation.']
      } else {
        response = ['The attack phase cannot start in the current game state.']
      }
    } else if (action === 'attack') {
      if (game.phase !== 'attack') {
        response = ['Start the attack phase first with "phase attack".']
      } else if (!item || !game.selectedAttacks.includes(item.id)) {
        response = ['That ID is not in the operation plan. Use "status" to review your selections.']
      } else {
        const result = resolveAttack(item.id)
        response = result
          ? [`${item.attackName}: ${result.status.toUpperCase()}.`, 'Local simulation complete. No external system was contacted.']
          : [`${item.id} has already been simulated.`]
      }
    } else {
      response = ['Unknown command. Type "help" for the command list.']
    }

    setLines((current) => [...current, `red@workstation:~$ ${input}`, ...response])
    setCommand('')
  }

  const currentBriefing = vulnerabilities.find(({ id }) => id === activeWindow)
  const currentAsset = currentBriefing && assets.find(({ id }) => id === currentBriefing.assetId)
  const activeTitle = activeWindow === 'terminal' ? 'REDTEAM.EXE - Command Terminal' : currentBriefing?.file

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#087e78] font-mono text-sm text-white selection:bg-[#f5d547] selection:text-[#171717]">
      <div className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.035)_50%,rgba(0,0,0,0.035)_75%,transparent_75%)] bg-size-[12px_12px]">
        <header className="flex items-center justify-between border-b-2 border-[#9af2d1] bg-[#075f5b] px-4 py-2 shadow-[0_2px_0_#004b47]">
          <div>
            <h1 className="text-base font-black tracking-[0.12em] text-[#fff3bc]">RED TEAM DESKTOP</h1>
            <p className="text-[10px] text-[#b8e5d3]">THREMOLIA SYSTEMS / TRAINING NODE 04</p>
          </div>
          <div className="text-right text-[10px] leading-4 text-[#d7f5e8]">
            <div>NETWORK: ISOLATED</div>
            <div>HOSTS: {game.discoveredAssets.length}/{assets.length} FOUND</div>
            <div>PHASE: <span className={game.phase === 'attack' ? 'text-[#ffb2a5]' : 'text-[#fff3bc]'}>{game.phase.toUpperCase()}</span></div>
          </div>
        </header>

        <main className="relative min-h-0 flex-1 overflow-auto p-3 pb-5 sm:p-5">
          <div className="grid w-full grid-cols-2 gap-2 sm:w-28 sm:grid-cols-1 sm:gap-3">
            {vulnerabilities.map((vulnerability) => {
              const discovered = game.discoveredVulnerabilities.includes(vulnerability.id)
              return (
                <button
                  key={vulnerability.id}
                  type="button"
                  onClick={() => setActiveWindow(vulnerability.id)}
                  disabled={!discovered}
                  className={`group flex min-h-16 items-center gap-2 border border-transparent p-2 text-left text-[10px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-21 sm:flex-col sm:justify-center sm:gap-1 sm:text-center ${discovered ? 'hover:border-red-300 hover:bg-[#ffffff1c]' : 'opacity-50'}`}
                  aria-label={discovered ? `Open attack option ${vulnerability.file}: ${vulnerability.attackName}` : `Locked file ${vulnerability.file}`}
                >
                  <span className={`relative flex h-9 w-8 shrink-0 items-center justify-center border-2 border-[#e5e5e5] bg-[#fffdf0] text-[8px] font-black text-[#303030] shadow-[2px_2px_0_#003f3c] sm:h-11 sm:w-9 ${discovered ? '' : 'grayscale'}`}>
                    <span className="absolute inset-x-0 top-0.5 border-y border-[#cc5555] py-0.5 text-center text-[7px] text-[#a72929]">PDF</span>
                    <span className="mt-3 text-[7px] text-[#555]">{discovered ? 'OPEN' : 'LOCK'}</span>
                  </span>
                  <span className="break-all leading-3 drop-shadow">{vulnerability.file}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setActiveWindow('terminal')}
              className="group flex min-h-16 items-center gap-2 border border-transparent p-2 text-left text-[10px] text-white hover:border-[#b6e9df] hover:bg-[#ffffff1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-21 sm:flex-col sm:justify-center sm:gap-1 sm:text-center"
              aria-label="Open command terminal"
            >
              <span className="flex h-9 w-10 shrink-0 items-center justify-center border-2 border-[#e5e5e5] bg-[#202a35] text-sm font-bold text-[#9eff9b] shadow-[2px_2px_0_#003f3c] sm:h-10 sm:w-12">&gt;_</span>
              <span className="leading-3 drop-shadow">COMMAND<br className="hidden sm:block" /> TERMINAL</span>
            </button>
          </div>

          {activeWindow && (
            <section className="absolute inset-2 flex min-h-0 flex-col border-2 border-[#f4f4f4] bg-[#c6c6c6] p-1 text-[#171717] shadow-[3px_3px_0_#004b47] sm:inset-y-5 sm:left-[9.5rem] sm:right-6">
              <div className="flex h-7 shrink-0 items-center justify-between bg-[#101e55] px-2 text-xs font-bold text-white">
                <span className="truncate">{activeTitle}</span>
                <button
                  type="button"
                  onClick={() => setActiveWindow(null)}
                  className="ml-2 flex h-5 w-6 shrink-0 items-center justify-center border-2 border-t-white border-l-white border-b-[#555] border-r-[#555] bg-[#c6c6c6] text-sm font-black leading-none text-black hover:bg-[#e7e7e7] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                  aria-label="Close window"
                >×</button>
              </div>

              {activeWindow === 'terminal' ? (
                <div className="flex min-h-0 flex-1 flex-col border-2 border-t-[#777] border-l-[#777] border-b-white border-r-white bg-[#101010] p-3 text-[#a8f5a1]">
                  <div className="mb-2 flex shrink-0 items-center justify-between border-b border-[#315238] pb-2 text-[10px] text-[#a1cfa0]">
                    <span>{game.phase === 'preparation' ? 'ATTACK CATALOGUE' : 'ATTACK EXECUTION'}</span>
                    <span>{game.selectedAttacks.length}/3 OPTIONS</span>
                  </div>
                  <div ref={terminalOutputRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto text-xs leading-5" aria-live="polite">
                    {lines.map((line, index) => <p key={`${index}-${line}`} className={line.startsWith('red@') ? 'text-[#fff3bc]' : ''}>{line}</p>)}
                  </div>
                  <form onSubmit={runCommand} className="mt-2 flex shrink-0 items-center gap-2 border-t border-[#315238] pt-2">
                    <label htmlFor="red-terminal-command" className="shrink-0 text-xs text-[#fff3bc]">&gt;_</label>
                    <input
                      id="red-terminal-command"
                      value={command}
                      onChange={(event) => setCommand(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-xs text-[#a8f5a1] outline-none placeholder:text-[#648264]"
                      placeholder="type a command"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button type="submit" className="border border-[#91bd8d] px-2 py-1 text-[10px] text-[#d7f5d3] hover:bg-[#253c29] focus-visible:outline-2 focus-visible:outline-white">ENTER</button>
                  </form>
                  {game.phase === 'preparation' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (beginAttackPhase()) setLines((current) => [...current, 'Attack phase started. Use "attack <VULN-ID>" to simulate each selected option.'])
                      }}
                      disabled={game.selectedAttacks.length === 0}
                      className="mt-2 self-start border border-[#dfb7a9] px-3 py-1.5 text-[10px] font-bold text-[#ffe1d4] enabled:hover:bg-[#4a2925] disabled:opacity-40"
                    >
                      BEGIN ATTACK PHASE
                    </button>
                  )}
                  {game.phase === 'attack' && <p className="mt-2 shrink-0 border-t border-[#315238] pt-2 text-[10px] text-[#ffe1d4]">Run <code>attack &lt;VULN-ID&gt;</code> for each selected option.</p>}
                </div>
              ) : currentBriefing ? (
                <article className="min-h-0 flex-1 overflow-y-auto border-2 border-t-[#777] border-l-[#777] border-b-white border-r-white bg-[#fffdf5] p-4 sm:p-6">
                  <div className="mx-auto max-w-2xl">
                    <div className="flex items-start justify-between gap-4 border-b-2 border-[#303030] pb-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-[#a72929]">Thremolia security assessment / confidential</p>
                        <h2 className="mt-2 text-lg font-black leading-tight sm:text-2xl">{currentBriefing.attackName}</h2>
                      </div>
                      <span className="shrink-0 border-2 border-[#a72929] px-2 py-1 text-[10px] font-black text-[#a72929]">{currentBriefing.severity.toUpperCase()}</span>
                    </div>
                    <dl className="my-4 grid grid-cols-[5.5rem_1fr] gap-y-2 text-xs sm:text-sm">
                      <dt className="font-bold">REFERENCE</dt><dd>{currentBriefing.id}</dd>
                      <dt className="font-bold">STRIDE</dt><dd>{currentBriefing.category}</dd>
                      <dt className="font-bold">ASSET</dt><dd>{currentAsset?.name}</dd>
                      <dt className="font-bold">HOST</dt><dd>{currentAsset?.host} / {currentAsset?.address}</dd>
                    </dl>
                    <div className="border-l-4 border-[#a72929] bg-[#f2eee4] p-3 text-xs leading-5 sm:text-sm">
                      <h3 className="mb-1 font-bold">VULNERABILITY</h3>
                      <p>{currentBriefing.summary}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase">Attack option</h3>
                      <p className="mt-1 text-xs leading-5 text-[#444] sm:text-sm">{currentBriefing.attackDescription}</p>
                    </div>
                    <p className="mt-4 text-[10px] font-bold uppercase text-[#a72929]">
                      {game.selectedAttacks.includes(currentBriefing.id) ? 'IN ATTACK PLAN' : game.phase === 'preparation' ? 'READY TO ADD TO ATTACK PLAN' : 'ATTACK PLAN LOCKED'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectAttack(currentBriefing.id)) {
                          setLines((current) => [...current, `red@workstation:~$ select ${currentBriefing.id}`, `${currentBriefing.id} added to the attack plan.`, `${game.selectedAttacks.length + 1} of 3 selections used.`])
                        }
                        setActiveWindow('terminal')
                      }}
                      disabled={!game.discoveredVulnerabilities.includes(currentBriefing.id) || game.selectedAttacks.includes(currentBriefing.id) || game.phase !== 'preparation' || game.selectedAttacks.length >= 3}
                      className="mt-5 border-2 border-t-white border-l-white border-b-[#555] border-r-[#555] bg-[#c6c6c6] px-3 py-2 text-xs font-bold enabled:hover:bg-[#dedede] disabled:opacity-50"
                    >
                      {game.selectedAttacks.includes(currentBriefing.id) ? 'IN ATTACK PLAN' : game.phase === 'preparation' ? 'SELECT ATTACK OPTION' : 'ATTACK PLAN LOCKED'}
                    </button>
                  </div>
                </article>
              ) : null}
            </section>
          )}
        </main>
      </div>

      <footer className="z-10 flex h-11 shrink-0 items-center gap-2 border-t-2 border-white bg-[#c6c6c6] px-2 text-[#111] shadow-[0_-2px_0_#777]">
        <button type="button" onClick={() => setActiveWindow('terminal')} className="flex h-7 items-center gap-2 border-2 border-t-white border-l-white border-b-[#555] border-r-[#555] bg-[#c6c6c6] px-2 text-xs font-black hover:bg-[#e4e4e4]">
          <span className="text-[#a72929]">T</span> START
        </button>
        {activeWindow && (
          <button type="button" onClick={() => setActiveWindow(activeWindow)} className="flex h-7 min-w-0 max-w-48 items-center border-2 border-t-[#777] border-l-[#777] border-b-white border-r-white bg-[#b5b5b5] px-2 text-[10px] font-bold">
            <span className="truncate">{activeTitle}</span>
          </button>
        )}
        <div className="ml-auto flex h-7 items-center gap-2 border-2 border-t-[#777] border-l-[#777] border-b-white border-r-white px-2 text-[10px]">
          <span className="h-2 w-2 rounded-full bg-[#168644]" /> LOCAL
        </div>
      </footer>
    </div>
  )
}