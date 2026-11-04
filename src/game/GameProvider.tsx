import { useState, type ReactNode } from 'react'
import { assets, defenseBudget, defenses, maxAttackSelections, strideCategories, strideRedoPenalty, strideTargets, trustBoundaries, vulnerabilities, type AssetId, type BoundaryId, type DefenseId, type StrideCategory, type StrideTargetId, type VulnerabilityId } from './gameData'
import { GameContext, type AttackResult, type GameState } from './gameContext'

function createInitialGame(): GameState {
  return {
    phase: 'preparation',
    stage: 'blue',
    identifiedAssets: [],
    identifiedBoundaries: [],
    strideAssessments: {},
    strideLocked: false,
    strideRedoUsed: false,
    identifiedVulnerabilities: [],
    mitigationNotes: {},
    selectedDefenses: [],
    discoveredAssets: [],
    discoveredVulnerabilities: [],
    selectedAttacks: [],
    attackResults: [],
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState(createInitialGame)
  const spentBudget = game.selectedDefenses.reduce((sum, defenseId) => {
    return sum + (defenses.find(({ id }) => id === defenseId)?.cost ?? 0)
  }, 0)
  const effectiveBudget = defenseBudget - (game.strideRedoUsed ? strideRedoPenalty : 0)
  const remainingBudget = effectiveBudget - spentBudget
  const hasCompleteDiagram = game.identifiedAssets.length === assets.length
    && game.identifiedBoundaries.length === trustBoundaries.length
  const hasCompleteStrideAssessment = strideTargets.every(({ id }) => strideCategories.every(({ id: category }) => game.strideAssessments[`${id}:${category}`]))
  const canConfirmStride = hasCompleteDiagram
    && hasCompleteStrideAssessment
    && !game.strideLocked
    && game.stage === 'blue'
    && game.phase === 'preparation'
  const canLockDefenses = game.strideLocked
    && game.identifiedAssets.length === assets.length
    && game.identifiedBoundaries.length === trustBoundaries.length
    && (game.selectedDefenses.length > 0 || game.identifiedVulnerabilities.length === 0)
    && game.stage === 'blue'
    && game.phase === 'preparation'

  function identifyAsset(assetId: AssetId) {
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || current.identifiedAssets.includes(assetId)
      ? current
      : { ...current, identifiedAssets: [...current.identifiedAssets, assetId] })
  }

  function identifyBoundary(boundaryId: BoundaryId) {
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || current.identifiedBoundaries.includes(boundaryId)
      ? current
      : { ...current, identifiedBoundaries: [...current.identifiedBoundaries, boundaryId] })
  }

  function assessStride(targetId: StrideTargetId, category: StrideCategory, assessment: 'threat' | 'clear') {
    const key = `${targetId}:${category}`
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue' || current.strideLocked
      ? current
      : { ...current, strideAssessments: { ...current.strideAssessments, [key]: assessment } })
  }

  function confirmStride() {
    if (!canConfirmStride) return false
    setGame((current) => ({ ...current, strideLocked: true }))
    return true
  }

  function redoStride() {
    const undiscoveredRiskExists = vulnerabilities.some(({ assetId, boundaryId, category }) => {
      return game.strideAssessments[`${assetId}:${category}`] !== 'threat'
        || game.strideAssessments[`${boundaryId}:${category}`] !== 'threat'
    })
    if (!game.strideLocked || game.strideRedoUsed || !undiscoveredRiskExists
      || game.phase !== 'preparation' || game.stage !== 'blue') return false
    setGame((current) => ({
      ...current,
      strideAssessments: {},
      strideLocked: false,
      strideRedoUsed: true,
      identifiedVulnerabilities: [],
      mitigationNotes: {},
      selectedDefenses: [],
    }))
    return true
  }

  function confirmVulnerability(vulnerabilityId: VulnerabilityId) {
    const vulnerability = vulnerabilities.find(({ id }) => id === vulnerabilityId)
    if (!vulnerability) return
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || !current.strideLocked
      || !current.identifiedAssets.includes(vulnerability.assetId)
      || !current.identifiedBoundaries.includes(vulnerability.boundaryId)
      || current.strideAssessments[`${vulnerability.assetId}:${vulnerability.category}`] !== 'threat'
      || current.strideAssessments[`${vulnerability.boundaryId}:${vulnerability.category}`] !== 'threat'
      || current.identifiedVulnerabilities.includes(vulnerabilityId)
      ? current
      : { ...current, identifiedVulnerabilities: [...current.identifiedVulnerabilities, vulnerabilityId] })
  }

  function saveMitigation(targetId: StrideTargetId, category: StrideCategory, note: string) {
    const key = `${targetId}:${category}`
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || current.strideAssessments[key] !== 'threat'
      ? current
      : { ...current, mitigationNotes: { ...current.mitigationNotes, [key]: note } })
  }

  function toggleDefense(defenseId: DefenseId) {
    const defense = defenses.find(({ id }) => id === defenseId)
    if (!defense) return
    setGame((current) => {
      if (current.phase !== 'preparation' || current.stage !== 'blue'
        || !current.identifiedVulnerabilities.includes(defense.vulnerabilityId)) return current
      if (current.selectedDefenses.includes(defenseId)) {
        return { ...current, selectedDefenses: current.selectedDefenses.filter((id) => id !== defenseId) }
      }
      const spent = current.selectedDefenses.reduce((sum, id) => {
        return sum + (defenses.find((item) => item.id === id)?.cost ?? 0)
      }, 0)
      const currentBudget = defenseBudget - (current.strideRedoUsed ? strideRedoPenalty : 0)
      if (spent + defense.cost > currentBudget) return current
      return { ...current, selectedDefenses: [...current.selectedDefenses, defenseId] }
    })
  }

  function lockDefenses() {
    if (!canLockDefenses) return false
    setGame((current) => ({ ...current, stage: 'red' }))
    return true
  }

  function discoverAssets() {
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'red'
      ? current
      : { ...current, discoveredAssets: assets.map(({ id }) => id) })
  }

  function discoverVulnerabilities(assetId: AssetId) {
    const found = vulnerabilities.filter(({ assetId: id }) => id === assetId).map(({ id }) => id)
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'red'
      || !current.discoveredAssets.includes(assetId)
      ? current
      : { ...current, discoveredVulnerabilities: [...new Set([...current.discoveredVulnerabilities, ...found])] })
    return found
  }

  function selectAttack(vulnerabilityId: VulnerabilityId) {
    if (game.phase !== 'preparation' || game.stage !== 'red'
      || !game.discoveredVulnerabilities.includes(vulnerabilityId)
      || game.selectedAttacks.includes(vulnerabilityId)
      || game.selectedAttacks.length >= maxAttackSelections) return false
    setGame({ ...game, selectedAttacks: [...game.selectedAttacks, vulnerabilityId] })
    return true
  }

  function beginAttackPhase() {
    if (game.stage !== 'red' || game.phase !== 'preparation' || game.selectedAttacks.length === 0) return false
    setGame((current) => ({ ...current, phase: 'attack' }))
    return true
  }

  function resolveAttack(vulnerabilityId: VulnerabilityId) {
    const vulnerability = vulnerabilities.find(({ id }) => id === vulnerabilityId)
    if (!vulnerability || game.phase !== 'attack' || !game.selectedAttacks.includes(vulnerabilityId)
      || game.attackResults.some(({ vulnerabilityId: id }) => id === vulnerabilityId)) return null

    const isBlocked = game.selectedDefenses.some((defenseId) => {
      return defenses.find(({ id }) => id === defenseId)?.vulnerabilityId === vulnerabilityId
    })
    const result: AttackResult = { vulnerabilityId, status: isBlocked ? 'blocked' : 'succeeded' }
    setGame((current) => {
      const attackResults = [...current.attackResults, result]
      return {
        ...current,
        attackResults,
        phase: attackResults.length === current.selectedAttacks.length ? 'complete' : current.phase,
      }
    })
    return result
  }

  function resetGame() {
    setGame(createInitialGame())
  }

  return (
    <GameContext.Provider value={{
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
      discoverAssets,
      discoverVulnerabilities,
      selectAttack,
      beginAttackPhase,
      resolveAttack,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  )
}