import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../game/useGame'
import {
  assets,
  defenseBudget,
  defenses,
  strideRedoPenalty,
  processNotes,
  strideCategories,
  strideTargets,
  trustBoundaries,
  vulnerabilities,
  type AssetId,
  type BoundaryId,
} from '../game/gameData'

const diagramPoints: Record<AssetId, { left: string; top: string }> = {
  checkout: { left: '34.5%', top: '50%' },
  'cold-chain': { left: '52%', top: '20.8%' },
  inventory: { left: '59%', top: '62.5%' },
  loyalty: { left: '85%', top: '62.5%' },
}

const boundaryPoints: Record<BoundaryId, { left: string; top: string }> = {
  'customer-checkout': { left: '22%', top: '50%' },
  'payment-provider': { left: '69%', top: '30%' },
  'sensor-network': { left: '39%', top: '18%' },
  'store-cloud': { left: '72%', top: '62.5%' },
}

export default function BlueView() {
  const navigate = useNavigate()
  const {
    game,
    remainingBudget,
    canConfirmStride,
    canLockDefenses,
    identifyAsset,
    identifyBoundary,
    assessStride,
    confirmStride,
    redoStride,
    confirmVulnerability,
    saveMitigation,
    toggleDefense,
    lockDefenses,
  } = useGame()
  const [activeNote, setActiveNote] = useState<AssetId | null>(null)
  const [activeBoundary, setActiveBoundary] = useState<BoundaryId | null>(null)
  const [feedback, setFeedback] = useState('READ THE COMPANY BRIEF, THEN PLACE ITS PROCESSES')

  function handleIdentifyAsset(assetId: AssetId) {
    const asset = assets.find(({ id }) => id === assetId)
    if (!asset) return
    if (game.identifiedAssets.includes(assetId)) {
      setFeedback(`${asset.name.toUpperCase()} ALREADY ON THE DFD`)
    } else if (activeNote !== assetId) {
      setFeedback('SELECT THE MATCHING PROCESS IN THE COMPANY BRIEF FIRST')
    } else {
      identifyAsset(assetId)
      setActiveNote(null)
      setFeedback(`${asset.name.toUpperCase()} ADDED TO THE DFD`)
    }
  }

  function handleIdentifyBoundary(boundaryId: BoundaryId) {
    const boundary = trustBoundaries.find(({ id }) => id === boundaryId)
    if (!boundary) return
    if (game.identifiedBoundaries.includes(boundaryId)) {
      setFeedback(`${boundary.marker} ALREADY DRAWN`)
    } else if (activeBoundary !== boundaryId) {
      setFeedback('SELECT A TRUST BOUNDARY BRIEFING FIRST')
    } else {
      identifyBoundary(boundaryId)
      setActiveBoundary(null)
      setFeedback(`${boundary.marker} DRAWN ON THE DFD`)
    }
  }

  function handleLockDefenses() {
    if (lockDefenses()) navigate('/red')
  }

  const locatedStrideThreats = Object.entries(game.strideAssessments)
    .filter(([, assessment]) => assessment === 'threat')
    .map(([key]) => {
      const [targetId, category] = key.split(':')
      return {
        key,
        target: strideTargets.find(({ id }) => id === targetId),
        category,
      }
    })
  const detectedVulnerabilities = vulnerabilities.filter(({ assetId, boundaryId, category }) => {
    return game.strideAssessments[`${assetId}:${category}`] === 'threat'
      && game.strideAssessments[`${boundaryId}:${category}`] === 'threat'
  })

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#18251f] text-[#f4efdf]">
      <header className="flex shrink-0 items-center justify-between border-b-4 border-[#826342] bg-[#202c25] px-4 py-3 sm:px-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#b9a879]">THREMOLIA / SUPERMARKET SECURITY REVIEW / ROOM 04</p>
          <h1 className="mt-1 text-lg font-bold text-[#f2e8ca] sm:text-xl">Blue Team · DFD workshop</h1>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <div className="text-right">
            <p className="text-[10px] text-[#b9a879]">PROCESSES</p>
            <p className="text-lg font-bold text-[#f2e8ca]">{game.identifiedAssets.length}<span className="text-[#9ca79a]"> / {assets.length}</span></p>
          </div>
          <div className="border-l border-[#697468] pl-4 text-right">
            <p className="text-[10px] text-[#b9a879]">DEFENSE BUDGET</p>
            <p className="text-lg font-bold text-[#f2e8ca]">{remainingBudget}<span className="text-[#9ca79a]"> / {defenseBudget - (game.strideRedoUsed ? strideRedoPenalty : 0)}</span></p>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,#465247_0%,#25352d_54%,#17231e_100%)] p-3 sm:p-5">
        <div className="mx-auto max-w-[1500px] space-y-5">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            <article className="border-2 border-[#c7b78b] bg-[#f0e3b5] p-4 text-[#303329] shadow-[3px_4px_0_#14221b] sm:p-5">
              <div className="flex items-start justify-between gap-4 border-b border-[#aa9c72] pb-3">
                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.17em] text-[#766745]">COMPANY PROFILE / INTERNAL BRIEFING</p>
                  <h2 className="mt-1 text-xl font-black">Northstar Market</h2>
                </div>
                <span className="shrink-0 border border-[#9a895b] px-2 py-1 font-mono text-[9px] font-bold text-[#766745]">DOCUMENT 01</span>
              </div>
              <p className="mt-3 text-sm leading-6">
                Northstar is a neighborhood supermarket with staffed and self-checkout lanes, refrigerated food cases, a supplier network, and a customer loyalty program. One store connects to a head-office network for purchasing and customer services. The store manager has asked for a data-flow diagram before a security review.
              </p>
              <p className="mt-2 text-sm leading-6">
                Use the process notes to decompose the store into its main processes. Add each process to the blank DFD, draw the trust boundaries where information crosses between people, devices, networks, or organizations, then assess every process and boundary with STRIDE.
              </p>
            </article>

            <aside className="border border-[#87968c] bg-[#202d28]/95 p-4">
              <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">WORKSHOP CHECKLIST</p>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-[#d0d8ce]">
                <li><span className="font-mono text-[#f0dca8]">01</span> Decompose the business into four DFD processes.</li>
                <li><span className="font-mono text-[#f0dca8]">02</span> Draw all four trust boundaries on the diagram.</li>
                <li><span className="font-mono text-[#f0dca8]">03</span> Assess each STRIDE category for every process and boundary.</li>
                <li><span className="font-mono text-[#f0dca8]">04</span> Write mitigations, then choose which to fund.</li>
              </ol>
            </aside>
          </section>

          <section className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <section className="border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">PROCESS NOTES</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Decompose the store</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#c7b78b]">{game.identifiedAssets.length} / {assets.length}</span>
                </div>
                <div className="space-y-2">
                  {processNotes.map((note, index) => {
                    const isIdentified = game.identifiedAssets.includes(note.assetId)
                    const isActive = activeNote === note.assetId
                    const asset = assets.find(({ id }) => id === note.assetId)
                    return (
                      <button
                        key={note.assetId}
                        type="button"
                        onClick={() => {
                          if (isIdentified) return
                          setActiveNote(isActive ? null : note.assetId)
                          setFeedback(isActive ? 'CHOOSE A PROCESS NOTE TO PLACE' : `PROCESS NOTE 0${index + 1} SELECTED · PLACE ${asset?.marker}`)
                        }}
                        disabled={isIdentified}
                        aria-pressed={isActive}
                        className={`w-full border p-3 text-left transition ${isIdentified ? 'border-[#95aa89] bg-[#d9e0c8] text-[#303329]' : isActive ? 'border-[#e4be55] bg-[#fff1b8] text-[#303329] ring-2 ring-[#e4be55]/40' : 'border-[#58685f] bg-[#17231f] hover:border-[#c9bd8d]'}`}
                      >
                        <span className="flex items-center justify-between gap-2 font-mono text-[9px] font-bold tracking-[0.1em] text-[#b9a879]">
                          <span>{note.subject}</span>
                          <span>{isIdentified ? 'PLACED' : `P${index + 1}`}</span>
                        </span>
                        <span className={`mt-2 block text-xs leading-5 ${isIdentified || isActive ? '' : 'text-[#d0d8ce]'}`}>{note.note}</span>
                        {isIdentified && <span className="mt-2 block font-mono text-[9px] font-bold uppercase text-[#3d6947]">{asset?.name} added to DFD</span>}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">BOUNDARY NOTES</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Mark the crossings</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#c7b78b]">{game.identifiedBoundaries.length} / {trustBoundaries.length}</span>
                </div>
                <div className="space-y-2">
                  {trustBoundaries.map((boundary) => {
                    const isDrawn = game.identifiedBoundaries.includes(boundary.id)
                    const isActive = activeBoundary === boundary.id
                    return (
                      <button
                        key={boundary.id}
                        type="button"
                        onClick={() => {
                          if (isDrawn) return
                          setActiveBoundary(isActive ? null : boundary.id)
                          setFeedback(isActive ? 'SELECT A BOUNDARY NOTE BEFORE DRAWING' : `${boundary.marker} SELECTED · MARK ITS CROSSING ON THE DFD`)
                        }}
                        disabled={isDrawn}
                        aria-pressed={isActive}
                        className={`w-full border p-3 text-left transition ${isDrawn ? 'border-[#95aa89] bg-[#d9e0c8] text-[#303329]' : isActive ? 'border-[#e4be55] bg-[#fff1b8] text-[#303329] ring-2 ring-[#e4be55]/40' : 'border-[#58685f] bg-[#17231f] hover:border-[#c9bd8d]'}`}
                      >
                        <span className={`block font-mono text-[9px] font-bold tracking-[0.1em] ${isDrawn || isActive ? 'text-[#766745]' : 'text-[#b9a879]'}`}>{boundary.marker} · {boundary.name}</span>
                        <span className={`mt-1 block text-xs leading-5 ${isDrawn || isActive ? '' : 'text-[#d0d8ce]'}`}>{boundary.detail}</span>
                        {isDrawn && <span className="mt-2 block font-mono text-[9px] font-bold uppercase text-[#3d6947]">Boundary drawn on DFD</span>}
                      </button>
                    )
                  })}
                </div>
              </section>
            </aside>

            <section className="min-w-0">
              <div className="relative rounded-[3rem_3rem_1.25rem_1.25rem] border-4 border-[#87968c] bg-[linear-gradient(110deg,#465d5d,#314a4c_35%,#465d5d_72%,#283e42)] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:rounded-[5rem_5rem_1.5rem_1.5rem] sm:p-5">
                <div className="mb-3 flex items-center justify-between px-2 font-mono text-[9px] tracking-[0.13em] text-[#e0d2a9] sm:px-4 sm:text-[10px]">
                  <span>SUPERMARKET DATA FLOW DIAGRAM / WORKING COPY</span>
                  <span>REV 01</span>
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
                      <text x="38" y="45" fill="#7a7b6d" fontSize="15" fontFamily="monospace">CUSTOMERS / EXTERNAL SERVICES</text>
                      <text x="255" y="45" fill="#7a7b6d" fontSize="15" fontFamily="monospace">NORTHSTAR MARKET SYSTEMS</text>
                      <circle cx="125" cy="300" r="55" fill="#f5f1e5" stroke="#586b60" strokeWidth="3" />
                      <text x="125" y="305" textAnchor="middle" fill="#37473f" fontSize="14" fontFamily="monospace">CUSTOMER</text>
                      <rect x="260" y="245" width="170" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                      <text x="345" y="290" textAnchor="middle" fill="#37473f" fontSize="13" fontFamily="monospace">{game.identifiedAssets.includes('checkout') ? 'CHECKOUT' : 'PROCESS 1'}</text>
                      <text x="345" y="316" textAnchor="middle" fill="#657166" fontSize="11" fontFamily="monospace">{game.identifiedAssets.includes('checkout') ? assets[0].address : 'PLACE PROCESS'}</text>
                      <rect x="430" y="70" width="180" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                      <text x="520" y="115" textAnchor="middle" fill="#37473f" fontSize="13" fontFamily="monospace">{game.identifiedAssets.includes('cold-chain') ? 'COLD-CHAIN' : 'PROCESS 2'}</text>
                      <text x="520" y="141" textAnchor="middle" fill="#657166" fontSize="11" fontFamily="monospace">{game.identifiedAssets.includes('cold-chain') ? assets[1].address : 'PLACE PROCESS'}</text>
                      <rect x="500" y="320" width="180" height="110" rx="9" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                      <text x="590" y="365" textAnchor="middle" fill="#37473f" fontSize="13" fontFamily="monospace">{game.identifiedAssets.includes('inventory') ? 'STOCK' : 'PROCESS 3'}</text>
                      <text x="590" y="391" textAnchor="middle" fill="#657166" fontSize="11" fontFamily="monospace">{game.identifiedAssets.includes('inventory') ? assets[2].address : 'PLACE PROCESS'}</text>
                      <path d="M760 320 H940 V430 H760 Z" fill="#f8f4e8" stroke="#586b60" strokeWidth="3" />
                      <path d="M760 337 H940 M760 413 H940" stroke="#586b60" strokeWidth="2" />
                      <text x="850" y="375" textAnchor="middle" fill="#37473f" fontSize="13" fontFamily="monospace">{game.identifiedAssets.includes('loyalty') ? 'LOYALTY DATA' : 'DATA STORE 1'}</text>
                      <text x="850" y="397" textAnchor="middle" fill="#657166" fontSize="10" fontFamily="monospace">MEMBER / PURCHASE RECORDS</text>
                      <rect x="770" y="85" width="160" height="75" rx="9" fill="#f5f1e5" stroke="#8b8067" strokeWidth="2" />
                      <text x="850" y="117" textAnchor="middle" fill="#5b594c" fontSize="12" fontFamily="monospace">PAYMENT PROVIDER</text>
                      <text x="850" y="138" textAnchor="middle" fill="#777466" fontSize="10" fontFamily="monospace">EXTERNAL ENTITY</text>
                      <path d="M180 300 H260" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                      <path d="M430 300 H465 V375 H500" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                      <path d="M680 375 H760" fill="none" stroke="#586b60" strokeWidth="3" markerEnd="url(#dfd-arrow)" />
                      <path d="M345 245 V215 H520 V180" fill="none" stroke="#7d8174" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#dfd-arrow)" />
                      <path d="M430 260 L770 145" fill="none" stroke="#586b60" strokeWidth="2" markerEnd="url(#dfd-arrow)" />
                      <path d="M320 125 H430" fill="none" stroke="#586b60" strokeWidth="2" markerEnd="url(#dfd-arrow)" />
                      <text x="190" y="286" fill="#73796e" fontSize="11" fontFamily="monospace">basket / payment</text>
                      <text x="685" y="360" fill="#73796e" fontSize="11" fontFamily="monospace">member records</text>
                      <path d="M180 300 H260" fill="none" stroke="#aa674e" strokeWidth="5" strokeDasharray="3 7" opacity={game.identifiedBoundaries.includes('customer-checkout') ? 1 : 0} />
                      <path d="M430 260 L770 145" fill="none" stroke="#aa674e" strokeWidth="5" strokeDasharray="3 7" opacity={game.identifiedBoundaries.includes('payment-provider') ? 1 : 0} />
                      <path d="M320 125 H430" fill="none" stroke="#aa674e" strokeWidth="5" strokeDasharray="3 7" opacity={game.identifiedBoundaries.includes('sensor-network') ? 1 : 0} />
                      <path d="M720 320 V430" fill="none" stroke="#aa674e" strokeWidth="5" strokeDasharray="3 7" opacity={game.identifiedBoundaries.includes('store-cloud') ? 1 : 0} />
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
                          aria-label={isIdentified ? `${asset.name}, placed on DFD` : `DFD process location ${asset.marker}`}
                          className="group absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18251f]"
                        >
                          <span className={`h-3.5 w-3.5 rounded-full border-2 border-white transition-all ${isIdentified ? 'scale-110 bg-[#4f985e] ring-4 ring-[#4f985e]/30 shadow-[0_0_14px_#5cac69]' : 'bg-[#a55c43] shadow-[0_1px_5px_#333]'}`} />
                          <span className="pointer-events-none absolute left-[calc(100%+2px)] top-1/2 -translate-y-1/2 whitespace-nowrap border border-[#bcb6a4] bg-[#f3eedf]/95 px-1 py-0.5 font-mono text-[9px] font-bold text-[#37473f] shadow-sm">{isIdentified ? '✓' : asset.marker}</span>
                        </button>
                      )
                    })}

                    {trustBoundaries.map((boundary) => {
                      const isDrawn = game.identifiedBoundaries.includes(boundary.id)
                      const point = boundaryPoints[boundary.id]
                      return (
                        <button
                          key={boundary.id}
                          type="button"
                          onClick={() => handleIdentifyBoundary(boundary.id)}
                          style={{ left: point.left, top: point.top }}
                          aria-label={`${boundary.marker} ${boundary.name}${isDrawn ? ', drawn' : ', draw trust boundary'}`}
                          className="absolute z-20 flex h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18251f]"
                        >
                          <span className={`whitespace-nowrap border px-1 py-0.5 font-mono text-[9px] font-bold shadow-sm ${isDrawn ? 'border-[#3d6947] bg-[#d9e0c8] text-[#3d6947]' : 'border-[#a55c43] bg-[#fff1b8] text-[#704432]'}`}>{isDrawn ? `✓ ${boundary.marker}` : boundary.marker}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 px-2 font-mono text-[9px] text-[#f0dcb4] sm:px-4 sm:text-[10px]">
                  <span className="truncate">{feedback}</span>
                  <span className="shrink-0">{activeNote ? 'PROCESS SELECTED' : activeBoundary ? 'BOUNDARY SELECTED' : 'WORKING COPY'}</span>
                </div>
              </div>

              <section className="mt-5 border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">STRIDE THREAT MODEL</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">{game.strideLocked ? 'Assessment locked' : 'Assess every process and boundary'}</h2>
                  </div>
                  <p className="text-[10px] text-[#c4cec4]">{game.strideLocked ? 'Your selections are locked. Confirmed threats are available in the risk review below.' : 'Choose Threat or No threat for all six categories on every row.'}</p>
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  {strideTargets.map((target) => {
                    const located = target.kind === 'PROCESS'
                      ? game.identifiedAssets.includes(target.id as AssetId)
                      : game.identifiedBoundaries.includes(target.id as BoundaryId)
                    const reviewedCount = strideCategories.filter(({ id }) => Boolean(game.strideAssessments[`${target.id}:${id}`])).length
                    return (
                      <article key={target.id} className={`border p-3 ${located ? 'border-[#58685f] bg-[#17231f]' : 'border-[#58685f] bg-[#17231f]/50 opacity-70'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-mono text-[9px] text-[#b9a879]">{target.kind} · {reviewedCount} / {strideCategories.length} REVIEWED</p>
                            <h3 className="mt-1 text-xs font-bold text-[#f1ead8]">{target.name}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => strideCategories.forEach(({ id }) => assessStride(target.id, id, 'clear'))}
                            disabled={!located || game.strideLocked}
                            className="shrink-0 border border-[#a9c0a9] px-2 py-1 font-mono text-[8px] text-[#d8e6d1] enabled:hover:bg-[#3b5747] disabled:opacity-40"
                          >
                            MARK ALL NO THREAT
                          </button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {strideCategories.map((category) => {
                            const key = `${target.id}:${category.id}`
                            const assessment = game.strideAssessments[key]
                            return (
                              <div key={category.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[#33443a] pt-2">
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[10px] font-bold text-[#e7e1d2]">{category.id}</span>
                                  <span className="block text-[9px] leading-4 text-[#aebaae]">{category.prompt}</span>
                                </span>
                                <span className="flex shrink-0 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => assessStride(target.id, category.id, 'threat')}
                                    disabled={!located || game.strideLocked}
                                    aria-pressed={assessment === 'threat'}
                                    className={`border px-2 py-1 font-mono text-[8px] disabled:opacity-40 ${assessment === 'threat' ? 'border-[#e3a99a] bg-[#633d35] text-[#ffe0d7]' : 'border-[#58685f] text-[#c4cec4] enabled:hover:border-[#e3a99a]'}`}
                                  >
                                    THREAT
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => assessStride(target.id, category.id, 'clear')}
                                    disabled={!located || game.strideLocked}
                                    aria-pressed={assessment === 'clear'}
                                    className={`border px-2 py-1 font-mono text-[8px] disabled:opacity-40 ${assessment === 'clear' ? 'border-[#a9c997] bg-[#34483b] text-[#e0f0d8]' : 'border-[#58685f] text-[#c4cec4] enabled:hover:border-[#a9c997]'}`}
                                  >
                                    NO THREAT
                                  </button>
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </article>
                    )
                  })}
                </div>
                <div className="mt-4 border-t border-[#5f7065] pt-4">
                  {game.strideLocked ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-[#a9d19f]">STRIDE choices confirmed and locked · {detectedVulnerabilities.length} of {vulnerabilities.length} scenario risks surfaced</p>
                      {game.strideRedoUsed && (
                        <span className="font-mono text-[9px] text-[#e3a99a]">REDO USED · {strideRedoPenalty}-POINT DEDUCTION</span>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={confirmStride}
                      disabled={!canConfirmStride}
                      className="w-full border border-[#f0dca8] bg-[#d6c18d] px-3 py-3 text-xs font-bold text-[#1e2b23] enabled:hover:bg-[#f0dfad] disabled:opacity-40"
                    >
                      CONFIRM STRIDE CHOICES AND LOCK ASSESSMENT
                    </button>
                  )}
                  {!game.strideLocked && (
                    <p className="mt-2 text-[10px] leading-4 text-[#b6c0b3]">Place all processes and boundaries and choose a response for every STRIDE category before confirming. The risk review will open after the choices are locked.</p>
                  )}
                </div>
              </section>

              <section className="mt-5 border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between gap-3 border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">SCENARIO FINDINGS</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Risks surfaced by your STRIDE review</h2>
                  </div>
                  {game.strideLocked && <span className="font-mono text-[10px] text-[#c7b78b]">{game.identifiedVulnerabilities.length} CONFIRMED · {detectedVulnerabilities.length} FOUND / {vulnerabilities.length}</span>}
                </div>
                {!game.strideLocked ? (
                  <p className="text-xs leading-5 text-[#b6c0b3]">Confirm and lock the STRIDE assessment above to reveal the risks supported by your choices.</p>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                  {detectedVulnerabilities.map((vulnerability) => {
                    const asset = assets.find(({ id }) => id === vulnerability.assetId)
                    const boundary = trustBoundaries.find(({ id }) => id === vulnerability.boundaryId)
                    const confirmed = game.identifiedVulnerabilities.includes(vulnerability.id)
                    return (
                      <article key={vulnerability.id} className="border border-[#58685f] bg-[#17231f] p-3">
                        <p className="font-mono text-[9px] text-[#b9a879]">{vulnerability.id} · {asset?.name} · {boundary?.name}</p>
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-[#f1ead8]">{vulnerability.name}</h3>
                          {confirmed ? (
                            <span className="font-mono text-[9px] font-bold text-[#a9d19f]">RISK CONFIRMED</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => confirmVulnerability(vulnerability.id)}
                              className="border border-[#a9c0a9] px-2 py-1 font-mono text-[9px] text-[#d8e6d1] enabled:hover:bg-[#3b5747] disabled:opacity-40"
                            >
                              CONFIRM RISK
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#c4cec4]">{vulnerability.summary}</p>
                      </article>
                    )
                  })}
                  {detectedVulnerabilities.length === 0 && <p className="text-xs leading-5 text-[#b6c0b3]">No scenario risks matched this assessment. You can proceed without confirming a risk or use your one STRIDE redo.</p>}
                  </div>
                )}
                {game.strideLocked && detectedVulnerabilities.length < vulnerabilities.length && !game.strideRedoUsed && (
                  <div className="mt-4 border-t border-[#5f7065] pt-4">
                    <p className="text-xs leading-5 text-[#d0d8ce]">Some scenario risks were not surfaced. You may redo the STRIDE table once; doing so clears its choices, risk confirmations, notes, and selected mitigations.</p>
                    <button
                      type="button"
                      onClick={redoStride}
                      className="mt-3 border border-[#e3a99a] bg-[#633d35] px-3 py-2 text-xs font-bold text-[#ffe0d7] hover:bg-[#75493f]"
                    >
                      REDO STRIDE REVIEW · DEDUCT {strideRedoPenalty} DEFENSE POINTS
                    </button>
                  </div>
                )}
              </section>

              <section className="mt-5 border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 border-b border-[#5f7065] pb-2">
                  <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">MITIGATION WORKSHEET</p>
                  <h2 className="text-sm font-bold text-[#f0e8d3]">Write a response for each identified STRIDE threat</h2>
                  <p className="mt-1 text-[10px] leading-4 text-[#b6c0b3]">Optional exercise notes. You can leave any or all responses blank; choose funded mitigations in the budget section below.</p>
                </div>
                {locatedStrideThreats.length === 0 ? (
                  <p className="text-xs leading-5 text-[#b6c0b3]">Mark a STRIDE category as a threat to add it to this worksheet.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {locatedStrideThreats.map(({ key, target, category }) => (
                      <label key={key} className="block border border-[#58685f] bg-[#17231f] p-3">
                        <span className="font-mono text-[9px] font-bold text-[#e3a99a]">{target?.kind} · {target?.name} · {category}</span>
                        <span className="mt-1 block text-[10px] leading-4 text-[#b6c0b3]">Describe a control that would reduce this risk.</span>
                        <textarea
                          value={game.mitigationNotes[key] ?? ''}
                          onChange={(event) => {
                            if (target) {
                              const categoryId = strideCategories.find(({ id }) => id === category)?.id
                              if (categoryId) saveMitigation(target.id, categoryId, event.target.value)
                            }
                          }}
                          disabled={!target}
                          rows={2}
                          className="mt-2 w-full resize-y border border-[#58685f] bg-[#101a16] p-2 text-xs text-[#f1ead8] outline-none focus:border-[#d6c18d] disabled:opacity-50"
                          placeholder="e.g. Require signed sensor readings and alert on unrecognized devices."
                        />
                      </label>
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-5 border border-[#87968c] bg-[#202d28]/90 p-4">
                <div className="mb-3 flex items-end justify-between border-b border-[#5f7065] pb-2">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-[#c7b78b]">DEFENSE BUDGET / {game.strideRedoUsed ? defenseBudget - strideRedoPenalty : defenseBudget} POINTS</p>
                    <h2 className="text-sm font-bold text-[#f0e8d3]">Select mitigations to fund</h2>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#f0dca8]">{remainingBudget} <span className="text-[9px] font-normal text-[#b9a879]">LEFT</span></p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
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
                  {game.identifiedVulnerabilities.length === 0 && game.selectedDefenses.length === 0
                    ? 'PASS TO RED TEAM WITHOUT FUNDED MITIGATIONS'
                    : 'CONFIRM FUNDED MITIGATIONS AND PASS TO RED TEAM'}
                </button>
                <p className="mt-2 text-[10px] leading-4 text-[#b6c0b3]">
                  Complete the process and boundary diagram, lock all STRIDE choices, confirm the risks you found, and select funded mitigations within your {game.strideRedoUsed ? defenseBudget - strideRedoPenalty : defenseBudget}-point budget. You may proceed without finding every risk; written mitigation notes are optional.
                </p>
              </section>
            </section>
          </section>
        </div>
      </main>
    </div>
  )
}
