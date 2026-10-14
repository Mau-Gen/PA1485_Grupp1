import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGame } from '../game/useGame'

export default function HomeView() {
  const navigate = useNavigate()
  const { resetGame } = useGame()
  const [introStarted, setIntroStarted] = useState(false)

  useEffect(() => {
    if (!introStarted) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/blue')
      return
    }

    const timeout = window.setTimeout(() => navigate('/blue'), 6900)
    return () => window.clearTimeout(timeout)
  }, [introStarted, navigate])

  return (
    <div className={`intro-scene relative h-full overflow-hidden bg-[#182923] text-white ${introStarted ? 'intro-scene-running' : ''}`}>
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="room-wall" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2a3940" />
            <stop offset="1" stopColor="#1b272d" />
          </linearGradient>
          <linearGradient id="room-table" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#536a69" />
            <stop offset="0.5" stopColor="#344c4f" />
            <stop offset="1" stopColor="#23373c" />
          </linearGradient>
          <linearGradient id="door-light" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#67b9a4" stopOpacity="0.1" />
            <stop offset="1" stopColor="#67b9a4" stopOpacity="0.72" />
          </linearGradient>
          <pattern id="room-panels" width="120" height="28" patternUnits="userSpaceOnUse">
            <path d="M0 8 H120 M0 23 H120" stroke="#b4c8c1" strokeOpacity="0.1" />
            <path d="M18 0 V8 M88 8 V23 M45 23 V28" stroke="#101b20" strokeOpacity="0.18" />
          </pattern>
        </defs>

        <rect width="1000" height="700" fill="url(#room-wall)" />
        <path d="M0 0 H1000 V470 H0 Z" fill="url(#room-wall)" />
        <path d="M0 470 L1000 470 L1000 700 L0 700 Z" fill="#202d31" />
        <path d="M0 490 H1000 M0 560 H1000 M0 630 H1000" stroke="#829792" strokeOpacity="0.12" strokeWidth="2" />
        <path d="M40 55 H710 V329 H40 Z" fill="#202d32" stroke="#71817b" strokeWidth="4" />
        <path d="M54 69 H370 V244 H54 Z" fill="#111c22" stroke="#88988f" strokeWidth="3" />
        <path d="M388 69 H696 V244 H388 Z" fill="#111c22" stroke="#88988f" strokeWidth="3" />
        <path d="M67 91 H357 M401 91 H683" stroke="#31454a" strokeWidth="2" />
        <text x="72" y="86" fill="#b4c2ae" fontSize="11" fontFamily="monospace">SECURE NETWORK / LIVE FLOWS</text>
        <text x="405" y="86" fill="#b4c2ae" fontSize="11" fontFamily="monospace">THREAT SURFACE / 04</text>
        <path d="M92 161 H166 L202 128 H280 L324 178" fill="none" stroke="#73b7a0" strokeWidth="3" />
        <circle cx="92" cy="161" r="6" fill="#d3af5c" />
        <circle cx="166" cy="161" r="6" fill="#72b49a" />
        <circle cx="202" cy="128" r="6" fill="#72b49a" />
        <circle cx="280" cy="128" r="6" fill="#cc765d" />
        <circle cx="324" cy="178" r="6" fill="#72b49a" />
        <path d="M418 112 H662 M418 132 H620 M418 152 H651 M418 172 H580 M418 192 H640 M418 212 H605" stroke="#688279" strokeWidth="4" strokeDasharray="22 8" />
        <rect x="57" y="258" width="636" height="53" fill="#182328" stroke="#52645f" strokeWidth="2" />
        <text x="79" y="281" fill="#d8c68f" fontSize="13" fontFamily="monospace">CLASSIFIED // RESTRICTED BRIEFING SUITE</text>
        <text x="79" y="300" fill="#9eb0a7" fontSize="10" fontFamily="monospace">AUTHORIZED PERSONNEL ONLY  /  CLEARANCE LEVEL 3</text>

        <path d="M756 72 H954 V480 H756 Z" fill="#1a262b" stroke="#879891" strokeWidth="12" />
        <path d="M772 91 H938 V465 H772 Z" fill="#263a3c" />
        <g className="intro-door-leaf">
          <path d="M772 91 H926 V465 H772 Z" fill="#35464b" stroke="#a7b6ac" strokeWidth="5" />
          <path d="M790 110 H908 V446 H790 Z" fill="#2c3b41" stroke="#1d2c31" strokeWidth="4" />
          <path d="M805 126 H894 V430 H805 Z" fill="none" stroke="#627771" strokeWidth="2" />
          <path d="M790 166 H908 M790 391 H908" stroke="#697d78" strokeWidth="2" />
          <circle cx="887" cy="284" r="7" fill="#cbb66f" />
        </g>
        <path className="intro-door-glow" d="M758 96 L772 91 V465 L758 457 Z" fill="url(#door-light)" />
        <rect x="716" y="258" width="27" height="63" rx="3" fill="#111b20" stroke="#81958d" strokeWidth="2" />
        <circle cx="729" cy="272" r="4" fill="#df5f52" />
        <rect x="722" y="284" width="14" height="19" fill="#34474a" stroke="#92a69b" strokeWidth="1" />
        <path d="M722 310 H736" stroke="#8da196" strokeWidth="2" />
        <text x="779" y="62" fill="#d7c98f" fontSize="10" fontFamily="monospace">SECURE ENTRY / LEVEL 3</text>

        <ellipse cx="365" cy="485" rx="91" ry="42" fill="#17221d" opacity="0.35" />
        <path d="M286 446 Q285 410 322 405 H405 Q441 410 440 446 V485 H286 Z" fill="#343b34" stroke="#b2986e" strokeWidth="5" />
        <path d="M304 450 V530 M422 450 V530" stroke="#463d31" strokeWidth="13" />

        <g className="intro-player">
          <path d="M347 445 Q345 420 361 412 H409 Q426 422 423 465 L434 520 H333 Z" fill="#5e7967" />
          <path d="M352 447 Q385 462 418 447 L426 488 H342 Z" fill="#688472" />
          <circle cx="385" cy="399" r="27" fill="#c98f6d" />
          <path d="M358 398 Q356 366 387 367 Q414 369 413 397 L405 389 Q386 377 364 396 Z" fill="#392c25" />
          <path d="M364 424 Q386 438 406 424" fill="none" stroke="#915f4d" strokeWidth="3" />
        </g>

        <g className="intro-suited-person">
          <path d="M681 397 Q682 366 704 360 H742 Q765 368 765 407 L777 477 H669 Z" fill="#24384a" />
          <path d="M702 367 L719 397 L738 367 L751 451 H689 Z" fill="#324b5e" />
          <path d="M713 377 L722 390 L730 377 L726 439 H716 Z" fill="#c2aa77" />
          <circle cx="723" cy="342" r="24" fill="#d09a77" />
          <path d="M699 341 Q698 312 725 314 Q747 315 748 342 L740 334 Q723 325 702 340 Z" fill="#292825" />
          <path d="M696 408 Q674 430 654 450" fill="none" stroke="#d09a77" strokeWidth="12" strokeLinecap="round" />
          <path className="intro-offer-hand" d="M654 450 L629 452" fill="none" stroke="#d09a77" strokeWidth="10" strokeLinecap="round" />
        </g>

        <path d="M101 503 Q487 427 899 503 L946 621 Q505 699 53 619 Z" fill="url(#room-table)" stroke="#91a59a" strokeWidth="11" />
        <path d="M101 503 Q487 427 899 503 L946 621 Q505 699 53 619 Z" fill="url(#room-panels)" />
        <path d="M77 619 Q499 702 925 620 L899 675 Q502 742 101 675 Z" fill="#1c2b31" stroke="#72867f" strokeWidth="8" />
        <path d="M245 674 L225 700 M781 674 L803 700" stroke="#1b292e" strokeWidth="20" />

        <g className="intro-dfd-paper">
          <path d="M330 465 L571 448 L595 610 L349 627 Z" fill="#f0ead8" stroke="#d7ceb7" strokeWidth="5" />
          <path d="M349 486 L554 473 M353 502 L558 488" stroke="#8d9b8b" strokeWidth="3" />
          <path d="M380 553 H420 M450 548 H493 M420 553 L450 548 M493 548 L525 544" fill="none" stroke="#61796b" strokeWidth="4" />
          <rect x="366" y="535" width="27" height="34" fill="none" stroke="#61796b" strokeWidth="3" />
          <rect x="438" y="531" width="28" height="33" rx="5" fill="none" stroke="#61796b" strokeWidth="3" />
          <path d="M516 528 H551 V561 H516 Z M516 534 H551 M516 555 H551" fill="none" stroke="#61796b" strokeWidth="3" />
          <circle cx="380" cy="552" r="5" fill="#c36846" />
          <circle cx="451" cy="547" r="5" fill="#c36846" />
          <circle cx="532" cy="545" r="5" fill="#c36846" />
          <text x="356" y="593" fill="#555d50" fontSize="12" fontFamily="monospace">CLASSIFIED / DATA FLOW</text>
        </g>

        <g className="intro-notebook">
          <path d="M580 478 L715 466 L730 604 L594 615 Z" fill="#d7c17f" stroke="#f1dda0" strokeWidth="5" />
          <path d="M599 499 L704 490 M601 516 L706 507 M603 533 L708 524 M605 550 L710 541 M607 567 L712 558 M609 584 L714 575" stroke="#81724f" strokeWidth="2" opacity="0.72" />
          <path d="M592 481 L607 612" stroke="#725b39" strokeWidth="7" />
          <text x="621" y="485" fill="#514832" fontSize="11" fontFamily="monospace">EYES ONLY / FIELD NOTES</text>
        </g>
      </svg>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,19,0.08)_35%,rgba(15,23,19,0.64)_100%)]" />
      <header className="absolute left-5 right-5 top-4 flex items-start justify-between sm:left-8 sm:right-8 sm:top-6">
        <div>
          <p className="font-mono text-[9px] tracking-[0.18em] text-[#e0c988] sm:text-[10px]">CLASSIFIED // THREAT ASSESSMENT</p>
          <h1 className="mt-1 text-xl font-bold text-[#f3e8c5] sm:text-2xl">ThreMoLIA</h1>
        </div>
        <span className="border border-[#d4b96f]/60 bg-[#291f1b]/70 px-2 py-1 font-mono text-[9px] tracking-widest text-[#e8d69f]">LEVEL 3 / SECURE ROOM</span>
      </header>

      {!introStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md border border-[#e7d9b4]/40 bg-[#17221d]/85 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.35)] sm:p-10">
            <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-[#d9c383]">RESTRICTED ACCESS / CLEARANCE VERIFIED</p>
            <h2 className="text-2xl font-bold text-[#f2e8ca] sm:text-3xl">The classified briefing</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#d1d5c9]">Take your seat. The system map is being cleared for review.</p>
            <button
              type="button"
              onClick={() => {
                resetGame()
                setIntroStarted(true)
              }}
              className="mt-7 border-2 border-[#f5e7bd] bg-[#d6c18d] px-9 py-3 font-bold text-[#1e2b23] shadow-[4px_4px_0_#78836a] transition hover:-translate-y-0.5 hover:bg-[#f0dfad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Play
            </button>
          </div>
          <Link to="/rules" className="absolute bottom-5 text-xs text-[#eee3c7] underline decoration-[#b9a879] underline-offset-4 hover:text-white">Rules</Link>
        </div>
      ) : (
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
          <div className="border-l-2 border-[#dfc783] bg-[#17221d]/80 px-4 py-2">
            <p className="font-mono text-[9px] tracking-[0.15em] text-[#dfc783]">BRIEFING IN PROGRESS</p>
            <p className="mt-1 text-sm text-[#f3eee0]">The DFD and field notebook arrive at the table.</p>
          </div>
          <Link to="/blue" className="shrink-0 border border-[#f5e7bd] bg-[#d6c18d] px-3 py-2 text-xs font-bold text-[#1e2b23] hover:bg-[#f0dfad] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Skip</Link>
        </div>
      )}
    </div>
  )
}