export const assets = [
  { id: 'checkout', name: 'Checkout & payment', address: '10.24.1.20', host: 'pos-gateway', service: 'Point-of-sale register and payment orchestration', location: 'L3' },
  { id: 'cold-chain', name: 'Cold-chain control', address: '10.24.3.15', host: 'cold-chain-svc', service: 'Refrigerator sensors and temperature alarms', location: 'L1' },
  { id: 'inventory', name: 'Stock & replenishment', address: '10.24.2.30', host: 'stock-svc', service: 'Stock counts, deliveries, and supplier orders', location: 'L4' },
  { id: 'loyalty', name: 'Loyalty & customer records', address: '10.24.2.50', host: 'loyalty-db', service: 'Customer profiles and purchase history', location: 'L2' },
] as const

export type AssetId = (typeof assets)[number]['id']

export const trustBoundaries = [
  { id: 'customer-checkout', name: 'Customer ↔ checkout', detail: 'Customer-facing self-checkout terminals connect to the store POS network.', marker: 'TB1', location: 'X2' },
  { id: 'payment-provider', name: 'Checkout ↔ payment provider', detail: 'Card authorization leaves the supermarket network for an external payment processor.', marker: 'TB2', location: 'X4' },
  { id: 'sensor-network', name: 'Sensor network ↔ cold-chain control', detail: 'Wireless refrigerator sensors report into the control service.', marker: 'TB3', location: 'X1' },
  { id: 'store-cloud', name: 'Store ↔ head office', detail: 'Stock and loyalty data move between store systems and the head-office network.', marker: 'TB4', location: 'X3' },
] as const

export type BoundaryId = (typeof trustBoundaries)[number]['id']
export type StrideTargetId = AssetId | BoundaryId

export const strideCategories = [
  { id: 'Spoofing', prompt: 'Can an identity or device be impersonated?' },
  { id: 'Tampering', prompt: 'Can data or commands be changed without approval?' },
  { id: 'Repudiation', prompt: 'Could an action happen without reliable evidence?' },
  { id: 'Information disclosure', prompt: 'Could sensitive information be exposed?' },
  { id: 'Denial of service', prompt: 'Could the service or process be made unavailable?' },
  { id: 'Elevation of privilege', prompt: 'Could someone gain more access than intended?' },
] as const

export type StrideCategory = (typeof strideCategories)[number]['id']

export const vulnerabilities = [
  {
    id: 'POS-01',
    file: '01_checkout.pdf',
    assetId: 'checkout',
    boundaryId: 'customer-checkout',
    name: 'Unverified checkout commands',
    category: 'Tampering',
    severity: 'High',
    summary: 'The register accepts some price and refund commands without checking that they came from an authorized staff session.',
    attackName: 'Checkout command tampering',
    attackDescription: 'Simulate an unauthorized change to a checkout transaction.',
  },
  {
    id: 'POS-02',
    file: '02_checkout_audit.pdf',
    assetId: 'checkout',
    boundaryId: 'customer-checkout',
    name: 'Incomplete transaction audit trail',
    category: 'Repudiation',
    severity: 'Medium',
    summary: 'The register does not consistently record who approved a refund or price override, making disputed transactions difficult to investigate.',
    attackName: 'Refund repudiation',
    attackDescription: 'Simulate a disputed refund that cannot be attributed to an authorized staff account.',
  },
  {
    id: 'COLD-01',
    file: '03_cold_chain.pdf',
    assetId: 'cold-chain',
    boundaryId: 'sensor-network',
    name: 'Unauthenticated temperature sensors',
    category: 'Spoofing',
    severity: 'High',
    summary: 'The control service trusts sensor readings from the store network without verifying the sensor identity.',
    attackName: 'Sensor impersonation',
    attackDescription: 'Simulate a false refrigerator reading from an unverified sensor.',
  },
  {
    id: 'COLD-02',
    file: '04_cold_chain_availability.pdf',
    assetId: 'cold-chain',
    boundaryId: 'sensor-network',
    name: 'Single-path temperature alerts',
    category: 'Denial of service',
    severity: 'High',
    summary: 'Temperature alarms depend on one network path to the control service, so an outage can delay staff warnings.',
    attackName: 'Cold-chain alert disruption',
    attackDescription: 'Simulate a network interruption that prevents a refrigerator alert from reaching staff.',
  },
  {
    id: 'STOCK-01',
    file: '05_stock_orders.pdf',
    assetId: 'inventory',
    boundaryId: 'store-cloud',
    name: 'Unvalidated supplier updates',
    category: 'Tampering',
    severity: 'Medium',
    summary: 'Delivery and stock updates from supplier integrations are not consistently checked against expected quantities.',
    attackName: 'Stock record tampering',
    attackDescription: 'Simulate an altered delivery update reaching stock records.',
  },
  {
    id: 'STOCK-02',
    file: '06_supplier_identity.pdf',
    assetId: 'inventory',
    boundaryId: 'store-cloud',
    name: 'Unverified supplier identity',
    category: 'Spoofing',
    severity: 'High',
    summary: 'The supplier integration does not strongly verify the partner endpoint before accepting delivery messages.',
    attackName: 'Supplier endpoint impersonation',
    attackDescription: 'Simulate a counterfeit supplier endpoint sending an order update.',
  },
  {
    id: 'LOYAL-01',
    file: '07_loyalty_records.pdf',
    assetId: 'loyalty',
    boundaryId: 'store-cloud',
    name: 'Overexposed loyalty records',
    category: 'Information disclosure',
    severity: 'High',
    summary: 'Customer contact details and purchase history are readable by more store services than necessary.',
    attackName: 'Loyalty record exposure',
    attackDescription: 'Simulate unauthorized access to customer purchase history.',
  },
  {
    id: 'LOYAL-02',
    file: '08_loyalty_privileges.pdf',
    assetId: 'loyalty',
    boundaryId: 'store-cloud',
    name: 'Over-privileged loyalty integration',
    category: 'Elevation of privilege',
    severity: 'High',
    summary: 'A shared integration account can administer loyalty services as well as perform routine customer-record synchronization.',
    attackName: 'Loyalty service privilege escalation',
    attackDescription: 'Simulate a routine integration account being used to gain administrative control.',
  },
] as const

export type VulnerabilityId = (typeof vulnerabilities)[number]['id']

export const defenses = [
  { id: 'checkout-authorization', name: 'Authorize register actions', cost: 4, vulnerabilityId: 'POS-01', description: 'Require staff authorization and transaction checks for price changes and refunds.' },
  { id: 'checkout-message-signing', name: 'Sign checkout commands', cost: 3, vulnerabilityId: 'POS-01', description: 'Cryptographically verify register commands before processing price changes.' },
  { id: 'checkout-audit-log', name: 'Keep tamper-evident till logs', cost: 3, vulnerabilityId: 'POS-02', description: 'Record staff identity and approval details in an append-only transaction log.' },
  { id: 'checkout-refund-review', name: 'Review exceptional refunds', cost: 2, vulnerabilityId: 'POS-02', description: 'Require a second staff approval for high-value refunds and overrides.' },
  { id: 'sensor-authentication', name: 'Authenticate sensor devices', cost: 3, vulnerabilityId: 'COLD-01', description: 'Enroll sensors with unique credentials and reject untrusted readings.' },
  { id: 'sensor-signed-readings', name: 'Sign temperature readings', cost: 4, vulnerabilityId: 'COLD-01', description: 'Verify signed readings and alert staff when a sensor identity is unknown.' },
  { id: 'cold-chain-failover', name: 'Add local alarm failover', cost: 3, vulnerabilityId: 'COLD-02', description: 'Trigger an on-site audible alert if the central monitoring path is unavailable.' },
  { id: 'cold-chain-segmentation', name: 'Segment sensor networks', cost: 4, vulnerabilityId: 'COLD-02', description: 'Isolate control traffic and prioritize temperature alerts during network congestion.' },
  { id: 'supplier-validation', name: 'Validate supplier updates', cost: 4, vulnerabilityId: 'STOCK-01', description: 'Verify supplier messages and constrain stock changes to expected delivery data.' },
  { id: 'stock-anomaly-checks', name: 'Flag unusual stock changes', cost: 2, vulnerabilityId: 'STOCK-01', description: 'Compare delivery quantities with purchase orders and require review of anomalies.' },
  { id: 'supplier-mutual-auth', name: 'Authenticate supplier connections', cost: 4, vulnerabilityId: 'STOCK-02', description: 'Use mutual authentication to verify supplier systems before exchanging updates.' },
  { id: 'supplier-credential-rotation', name: 'Rotate supplier credentials', cost: 3, vulnerabilityId: 'STOCK-02', description: 'Issue separate partner credentials and revoke or rotate them on a schedule.' },
  { id: 'loyalty-access', name: 'Restrict loyalty data access', cost: 5, vulnerabilityId: 'LOYAL-01', description: 'Apply least-privilege access and encrypt customer records.' },
  { id: 'loyalty-tokenization', name: 'Tokenize analytics records', cost: 3, vulnerabilityId: 'LOYAL-01', description: 'Use tokenized customer references in services that do not need direct identifiers.' },
  { id: 'loyalty-service-identity', name: 'Scope integration identities', cost: 4, vulnerabilityId: 'LOYAL-02', description: 'Give synchronization services non-admin identities with only the permissions they need.' },
  { id: 'loyalty-admin-review', name: 'Review privileged access', cost: 3, vulnerabilityId: 'LOYAL-02', description: 'Separate administrative credentials and regularly review privileged access grants.' },
] as const

export type DefenseId = (typeof defenses)[number]['id']
export const defenseBudget = 12
export const strideRedoPenalty = 2
export const maxAttackSelections = 3

export const componentNotes: { assetId: AssetId; subject: string; note: string; marker: string }[] = [
  { assetId: 'checkout', subject: 'STORE OPERATIONS', note: 'At staffed and self-service lanes, the register scans items, applies discounts, takes payment, and issues refunds. Card authorization is handled by an outside payment provider.', marker: 'C1' },
  { assetId: 'cold-chain', subject: 'FOOD SAFETY', note: 'Refrigerator and freezer sensors report temperatures to a control service. Staff receive an alert when a case leaves its safe range.', marker: 'C2' },
  { assetId: 'inventory', subject: 'SUPPLY & STOCK', note: 'Staff record deliveries and stock counts. Supplier systems send delivery updates, and the store service prepares replenishment orders for head office.', marker: 'C3' },
  { assetId: 'loyalty', subject: 'CUSTOMER PROGRAM', note: 'The loyalty program stores member contact details and purchase history, applies member discounts at checkout, and syncs records with head office.', marker: 'C4' },
]

export const strideTargets: { id: StrideTargetId; name: string; kind: 'COMPONENT' | 'BOUNDARY' }[] = [
  ...assets.map(({ id, name }) => ({ id, name, kind: 'COMPONENT' as const })),
  ...trustBoundaries.map(({ id, name }) => ({ id, name, kind: 'BOUNDARY' as const })),
]
