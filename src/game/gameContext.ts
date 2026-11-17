import { createContext } from 'react'
import type { AssetId, BoundaryId, DefenseId, StrideCategory, StrideTargetId, VulnerabilityId } from './gameData'

export type GamePhase = 'preparation' | 'attack' | 'complete'
export type GameStage = 'blue' | 'red'

export type AttackResult = {
  vulnerabilityId: VulnerabilityId
  status: 'blocked' | 'succeeded'
}

export type GameState = {
  phase: GamePhase
  stage: GameStage
  identifiedAssets: AssetId[]
  identifiedBoundaries: BoundaryId[]
  strideAssessments: Record<string, 'threat' | 'clear'>
  strideLocked: boolean
  strideRedoUsed: boolean
  identifiedVulnerabilities: VulnerabilityId[]
  selectedDefenses: DefenseId[]
  discoveredAssets: AssetId[]
  discoveredVulnerabilities: VulnerabilityId[]
  selectedAttacks: VulnerabilityId[]
  attackResults: AttackResult[]
}

export type GameContextValue = {
  game: GameState
  remainingBudget: number
  canConfirmStride: boolean
  canLockDefenses: boolean
  identifyAsset: (assetId: AssetId) => void
  identifyBoundary: (boundaryId: BoundaryId) => void
  assessStride: (targetId: StrideTargetId, category: StrideCategory, assessment: 'threat' | 'clear') => void
  confirmStride: () => boolean
  redoStride: () => boolean
  confirmVulnerability: (vulnerabilityId: VulnerabilityId) => void
  toggleDefense: (defenseId: DefenseId) => void
  lockDefenses: () => boolean
  discoverAssets: () => void
  discoverVulnerabilities: (assetId: AssetId) => VulnerabilityId[]
  selectAttack: (vulnerabilityId: VulnerabilityId) => boolean
  beginAttackPhase: () => boolean
  resolveAttack: (vulnerabilityId: VulnerabilityId) => AttackResult | null
  resetGame: () => void
}

export const GameContext = createContext<GameContextValue | null>(null)