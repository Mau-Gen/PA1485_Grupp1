import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../game/useGame'
import { assets, defenseBudget, defenses, meetingNotes, vulnerabilities, type AssetId } from '../game/gameData'

const diagramPoints: Record<AssetId, { left: string; top: string }> = {
  portal: { left: '28.2%', top: '56.7%' },
  identity: { left: '44.5%', top: '26.3%' },
  orders: { left: '51.5%', top: '68.3%' },
  database: { left: '77.2%', top: '68%' },
}

export default function BlueView() {
  const navigate = useNavigate()
  const { game, remainingBudget, canLockDefenses, identifyAsset, confirmVulnerability, toggleDefense, lockDefenses } = useGame()
  const [activeNote, setActiveNote] = useState<AssetId | null>(null)
  const [feedback, setFeedback] = useState('SELECT A FIELD NOTE TO BEGIN THE REVIEW')

  function handleIdentifyAsset(assetId: AssetId) {
    const asset = assets.find(({ id }) => id === assetId)
    if (!asset) return
    if (game.identifiedAssets.includes(assetId)) {
      setFeedback(`${asset.name.toUpperCase()} ALREADY LOCATED`)
    } else if (!activeNote) {
      setFeedback('SELECT A FIELD NOTE BEFORE MARKING THE DFD')
    } else if (activeNote !== assetId) {
      setFeedback('THAT LOCATION DOES NOT MATCH THE ACTIVE NOTE')
    } else {
      identifyAsset(assetId)
      setActiveNote(null)
      setFeedback(`${asset.name.toUpperCase()} LOCATED · REVIEW ITS FINDING BELOW`)
    }
  }

  function handleLockDefenses() {
    if (lockDefenses()) navigate('/red')
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#18251f] text-[#f4efdf]">
      <header className="flex shrink-0 items-center justify-between border-b-4 border-[#826342] bg-[#202c25] px-4 py-3 sm:px-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#b9a879]">THREMOLIA / SECURITY REVIEW / ROOM 04</p>
          <h1 className="mt-1 text-lg font-bold text-[#f2e8ca] sm:text-xl">Blue Team · Boardroom review</h1>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <div className="text-right">
            <p className="text-[10px] text-[#b9a879]">ASSETS LOCATED</p>
            <p className="text-lg font-bold text-[#f2e8ca]">{game.identifiedAssets.length}<span className="text-[#9ca79a]"> / {assets.length}</span></p>
          </div>
          <div className="border-l border-[#697468] pl-4 text-right">
            <p className="text-[10px] text-[#b9a879]">DEFENSE BUDGET</p>
            <p className="text-lg font-bold text-[#f2e8ca]">{remainingBudget}<span className="text-[#9ca79a]"> / {defenseBudget}</span></p>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,#465247_0%,#25352d_54%,#17231e_100%)] p-3 sm:p-5">
        <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <div className="mb-3 flex items-end justify-between border-b border-[#899181] pb-2">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#c7b78b]">FIELD NOTES</p>
                <h2 className="text-sm font-bold text-[#f0e8d3]">Meeting minutes</h2>
              </div>
              <span className="font-mono text-[10px] text-[#c7b78b]">{game.identifiedAssets.length} FILED</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {meetingNotes.map((note, index) => {
                const isIdentified = game.identifiedAssets.includes(note.assetId)
                const isActive = activeNote === note.assetId
                return (
                  <button
                    key={note.assetId}
                    type="button"
                    onClick={() => {
                      if (isIdentified) return
                      setActiveNote(isActive ? null : note.assetId)
                      setFeedback(isActive ? 'SELECT A FIELD NOTE TO BEGIN THE REVIEW' : `NOTE ${String(index + 1).padStart(2, '0')} IN REVIEW`)
                    }}
                    disabled={isIdentified}
                    aria-pressed={isActive}
                    className={`relative min-h-28 border p-3 text-left text-[#303329] shadow-[2px_3px_0_#14221b] transition sm:min-h-32 ${isIdentified ? 'border-[#95aa89] bg-[#d9e0c8]' : isActive ? 'z-10 -rotate-1 border-[#e4be55] bg-[#fff1b8] ring-2 ring-[#e4be55]/50' : 'border-[#d0c08e] bg-[#f0e3b5] hover:-translate-y-0.5 hover:bg-[#fff1c8]'}`}
                  >
                    <span className="absolute -top-1 left-1/2 h-3 w-8 -translate-x-1/2 rotate-2 bg-[#c3aa6c]/80" />
                    <span className="flex items-center justify-between font-mono text-[9px] font-bold tracking-[0.12em] text-[#766745]">
                      <span>{note.subject}</span>
                      <span>{isIdentified ? 'FILED' : `0${index + 1}`}</span>
                    </span>
                    <span className="mt-2 block text-xs leading-5">{note.note}</span>
                    {isIdentified && <span className="mt-2 block font-mono text-[9px] font-bold uppercase text-[#3d6947]">Location marked on DFD</span>}
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="relative rounded-[3rem_3rem_1.25rem_1.25rem] border-4 border-[#87968c] bg-[linear-gradient(110deg,#465d5d,#314a4c_35%,#465d5d_72%,#283e42)] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:rounded-[5rem_5rem_1.5rem_1.5rem] sm:p-5">
              <div className="mb-3 flex items-center justify-between px-2 font-mono text-[9px] tracking-[0.13em] text-[#e0d2a9] sm:px-4 sm:text-[10px]">
                <span>DATA FLOW DIAGRAM / REV 03</span>
                <span>CLASSIFIED</span>
              </div>
              <div className="overflow-x-auto border-4 border-[#ddd4bd] bg-[#eee9d9] shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-[5/3] min-w-[620px] text-[#29332e]">
                  <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <defs>
                      <pattern id="dfd-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#b8b7a8" strokeWidth="1" opacity="0.3" />
                      </pattern>
                      <marker id="dfd-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 z" fill="#586b60" />
                      </marker>
                    </defs>
                    <rect width="1000" height="600" fill="url(#dfd-grid)" />
                    <text x="38" y="45" fill="#7a7b6d" fontSize="15" fontFamily="monospace">EXTERNAL</text>
                    <text x="255" y="45" fill="#7a7b6d" fontSize="15" fontFamily="monospace">APPLICATION BOUNDARY</text>
                    <text x="50" y="225" fill="#586b60" fontSize="14" fontFamily="monospace">Customer</text>
                    <circle cx="125" cy="300" r="55" fill="#f5f1e5" stroke="#586b60" strokeWidth="3" />
                    <text x="125" y="305" textAnchor="middle" fill="#37473f" fontSize="14" fontFamily="monospace">USER</text>
                    <rect x="260" y="245" width="170" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                    <text x="345" y="297" textAnchor="middle" fill="#37473f" fontSize="15" fontFamily="monospace">PROCESS 1</text>
                    <text x="345" y="320" textAnchor="middle" fill="#657166" fontSize="12" fontFamily="monospace">{assets[0].address}</text>
                    <rect x="430" y="70" width="180" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                    <text x="520" y="122" textAnchor="middle" fill="#37473f" fontSize="15" fontFamily="monospace">PROCESS 2</text>
                    <text x="520" y="145" textAnchor="middle" fill="#657166" fontSize="12" fontFamily="monospace">{assets[1].address}</text>
                    <rect x="500" y="320" width="180" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                    <text x="590" y="372" textAnchor="middle" fill="#37473f" fontSize="15" fontFamily="monospace">PROCESS 3</text>
                    <text x="590" y="395" textAnchor="middle" fill="#657166" fontSize="12" fontFamily="monospace">{assets[2].address}</text>
                    <path d="M760 320 H940 V430 H760 Z" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                    <path d="M760 337 H940 M760 413 H940" stroke="#586b60" strokeWidth="2" />
                    <text x="850" y="375" textAnchor="middle" fill="#37473f" fontSize="15" fontFamily="monospace">DATA STORE 1</text>
                    <text x="850" y="397" textAnchor="middle" fill="#657166" fontSize="11" fontFamily="monospace">PROFILES / EMAIL / ORDERS</text>
                    <path d="M180 300 H260" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                    <path d="M430 300 H465 V375 H500" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                    <path d="M680 375 H760" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                    <path d="M345 245 V215 H520 V180" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                    <path d="M520 180 V205 H380 V245" fill="none" stroke="#7d8174" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#dfd-arrow)" />
                    <text x="187" y="286" fill="#73796e" fontSize="11" fontFamily="monospace">request</text>
                    <text x="687" y="360" fill="#73796e" fontSize="11" fontFamily="monospace">records</text>
                  </svg>

                  {assets.map((asset) => {
                    const isIdentified = game.identifiedAssets.includes(asset.id)
                    const point = diagramPoints[asset.id]
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleIdentifyAsset(asset.id)}
                        style={{ left: point.left, top: point.top }}
                        aria-label={isIdentified ? `${asset.name}, ${asset.address}, identified on DFD` : `DFD location ${asset.marker}`}
                        className="group absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18251f]"
                      >
                        <span className={`h-3.5 w-3.5 rounded-full border-2 border-white transition-all ${isIdentified ? 'scale-110 bg-[#4f985e] ring-4 ring-[#4f985e]/30 shadow-[0_0_14px_#5cac69]' : 'bg-[#a55c43] shadow-[0_1px_5px_#333]'}`} />
                        <span className="pointer-events-none absolute left-[calc(100%+2px)] top-1/2 -translate-y-1/2 whitespace-nowrap border border-[#bcb6a4] bg-[#f3eedf]/95 px-1 py-0.5 font-mono text-[9px] font-bold text-[#37473f] shadow-sm">
                          {isIdentified ? '✓' : asset.marker}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 px-2 font-mono text-[9px] text-[#f0dcb4] sm:px-4 sm:text-[10px]">
                <span className="truncate">{feedback}</span>
                <span className="shrink-0">{activeNote ? 'NOTE ACTIVE' : 'REVIEW IN PROGRESS'}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <section className="border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">THREAT REVIEW</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Vulnerability findings</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#c7b78b]">{game.identifiedVulnerabilities.length} / {vulnerabilities.length}</span>
                </div>
                <div className="space-y-2">
                  {vulnerabilities.map((vulnerability) => {
                    const asset = assets.find(({ id }) => id === vulnerability.assetId)
                    const located = game.identifiedAssets.includes(vulnerability.assetId)
                    const confirmed = game.identifiedVulnerabilities.includes(vulnerability.id)
                    return (
                      <article key={vulnerability.id} className="border border-[#58685f] bg-[#17231f] p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-mono text-[9px] text-[#b9a879]">{vulnerability.id} · {asset?.name ?? 'Unknown asset'}</p>
                            <h3 className="text-xs font-bold text-[#f1ead8]">{located ? vulnerability.name : 'Unreviewed DFD asset'}</h3>
                          </div>
                          {confirmed ? (
                            <span className="font-mono text-[9px] font-bold text-[#a9d19f]">FINDING CONFIRMED</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => confirmVulnerability(vulnerability.id)}
                              disabled={!located}
                              className="border border-[#a9c0a9] px-2 py-1 font-mono text-[9px] text-[#d8e6d1] enabled:hover:bg-[#3b5747] disabled:opacity-40"
                            >
                              {located ? 'CONFIRM FINDING' : 'LOCATE ASSET FIRST'}
                            </button>
                          )}
                        </div>
                        {located && <p className="mt-2 text-xs leading-5 text-[#c4cec4]">{vulnerability.summary}</p>}
                      </article>
                    )
                  })}
                </div>
              </section>

              <section className="border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">DEFENSE CATALOGUE</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Mitigation plan</h2>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#f0dca8]">{remainingBudget} <span className="text-[9px] font-normal text-[#b9a879]">POINTS LEFT</span></p>
                </div>
                <div className="space-y-2">
                  {defenses.map((defense) => {
                    const vulnerability = vulnerabilities.find(({ id }) => id === defense.vulnerabilityId)
                    const findingConfirmed = game.identifiedVulnerabilities.includes(defense.vulnerabilityId)
                    const selected = game.selectedDefenses.includes(defense.id)
                    const overBudget = !selected && defense.cost > remainingBudget
                    return (
                      <button
                        key={defense.id}
                        type="button"
                        onClick={() => toggleDefense(defense.id)}
                        disabled={!findingConfirmed || overBudget || game.phase !== 'preparation'}
                        aria-pressed={selected}
                        className={`w-full border p-3 text-left transition ${selected ? 'border-[#a9c997] bg-[#34483b]' : 'border-[#58685f] bg-[#17231f] enabled:hover:border-[#c9bd8d] disabled:opacity-45'}`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span>
                            <span className="block text-xs font-bold text-[#f1ead8]">{defense.name}</span>
                            <span className="mt-1 block text-[10px] leading-4 text-[#c4cec4]">{defense.description}</span>
                            <span className="mt-1 block font-mono text-[9px] text-[#b9a879]">COVERS {vulnerability?.id}</span>
                          </span>
                          <span className="shrink-0 font-mono text-xs font-bold text-[#f0dca8]">{defense.cost} PTS</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={handleLockDefenses}
                  disabled={!canLockDefenses}
                  className="mt-4 w-full border border-[#f0dca8] bg-[#d6c18d] px-3 py-3 text-xs font-bold text-[#1e2b23] enabled:hover:bg-[#f0dfad] disabled:opacity-40"
                >
                  LOCK DEFENSES AND PASS TO RED TEAM
                </button>
                <p className="mt-2 text-[10px] leading-4 text-[#b6c0b3]">
                  Confirm all four findings and choose at least one mitigation without exceeding {defenseBudget} points.
                </p>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}