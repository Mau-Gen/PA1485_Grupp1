import { useState, type ReactNode } from 'react'
import { assets, defenseBudget, defenses, vulnerabilities, type AssetId, type DefenseId, type VulnerabilityId } from './gameData'
import { GameContext, type AttackResult, type GameState } from './gameContext'

function createInitialGame(): GameState {
  return {
    phase: 'preparation',
    stage: 'blue',
    identifiedAssets: [],
    identifiedVulnerabilities: [],
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
  const remainingBudget = defenseBudget - spentBudget
  const canLockDefenses = game.identifiedVulnerabilities.length === vulnerabilities.length
    && game.selectedDefenses.length > 0
    && game.stage === 'blue'
    && game.phase === 'preparation'

  function identifyAsset(assetId: AssetId) {
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || current.identifiedAssets.includes(assetId)
      ? current
      : { ...current, identifiedAssets: [...current.identifiedAssets, assetId] })
  }

  function confirmVulnerability(vulnerabilityId: VulnerabilityId) {
    const vulnerability = vulnerabilities.find(({ id }) => id === vulnerabilityId)
    if (!vulnerability) return
    setGame((current) => current.phase !== 'preparation' || current.stage !== 'blue'
      || !current.identifiedAssets.includes(vulnerability.assetId)
      || current.identifiedVulnerabilities.includes(vulnerabilityId)
      ? current
      : { ...current, identifiedVulnerabilities: [...current.identifiedVulnerabilities, vulnerabilityId] })
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
      if (spent + defense.cost > defenseBudget) return current
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
      || game.selectedAttacks.length >= 3) return false
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
      canLockDefenses,
      identifyAsset,
      confirmVulnerability,
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