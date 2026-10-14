export const assets = [
  { id: 'portal', name: 'Web portal', address: '203.0.113.24', host: 'web-portal', service: 'HTTPS login service', marker: 'P1' },
  { id: 'identity', name: 'Identity service', address: '10.0.4.12', host: 'identity-svc', service: 'Credential and token service', marker: 'P2' },
  { id: 'orders', name: 'Order service', address: '10.0.4.21', host: 'order-svc', service: 'Order processing service', marker: 'P3' },
  { id: 'database', name: 'Customer database', address: '10.0.4.50', host: 'customer-db', service: 'Customer records data store', marker: 'D1' },
] as const

export type AssetId = (typeof assets)[number]['id']

export const vulnerabilities = [
  {
    id: 'AUTH-01',
    file: '01_recovery.pdf',
    assetId: 'portal',
    name: 'Weak account recovery',
    category: 'Spoofing',
    severity: 'High',
    summary: 'Account recovery relies on a single identity signal, making account takeover more likely.',
    attackName: 'Credential abuse',
    attackDescription: 'Simulate abuse of the weak account recovery flow.',
  },
  {
    id: 'AUTH-02',
    file: '02_tokens.pdf',
    assetId: 'identity',
    name: 'Long-lived identity tokens',
    category: 'Information disclosure',
    severity: 'High',
    summary: 'Identity tokens remain usable for too long if exposed or copied.',
    attackName: 'Token replay',
    attackDescription: 'Simulate reuse of an exposed identity token.',
  },
  {
    id: 'APP-01',
    file: '03_orders.pdf',
    assetId: 'orders',
    name: 'Unvalidated order input',
    category: 'Tampering',
    severity: 'Medium',
    summary: 'Order values are not consistently validated before business rules process them.',
    attackName: 'Order tampering',
    attackDescription: 'Simulate altered order input reaching the processing service.',
  },
  {
    id: 'DATA-01',
    file: '04_records.pdf',
    assetId: 'database',
    name: 'Unprotected customer records',
    category: 'Information disclosure',
    severity: 'High',
    summary: 'Stored customer records are not consistently protected at rest.',
    attackName: 'Record exposure',
    attackDescription: 'Simulate unauthorized access to stored customer information.',
  },
] as const

export type VulnerabilityId = (typeof vulnerabilities)[number]['id']

export const defenses = [
  { id: 'recovery-mfa', name: 'Step-up recovery verification', cost: 4, vulnerabilityId: 'AUTH-01', description: 'Require a second verified factor before account recovery.' },
  { id: 'token-hardening', name: 'Short-lived signed tokens', cost: 3, vulnerabilityId: 'AUTH-02', description: 'Shorten token lifetime and validate signatures at each service.' },
  { id: 'input-validation', name: 'Order input validation', cost: 4, vulnerabilityId: 'APP-01', description: 'Validate and constrain order values at the service boundary.' },
  { id: 'database-encryption', name: 'Encrypt customer records', cost: 5, vulnerabilityId: 'DATA-01', description: 'Encrypt stored records and restrict access to the key.' },
] as const

export type DefenseId = (typeof defenses)[number]['id']
export const defenseBudget = 12

export const meetingNotes: { assetId: AssetId; subject: string; note: string }[] = [
  { assetId: 'portal', subject: 'INBOUND TRAFFIC', note: 'A public address, 203.0.113.24, receives login requests from outside the application boundary. Identify its process.' },
  { assetId: 'identity', subject: 'TOKEN TRACE', note: 'Credentials are checked and a short-lived identity token is issued at 10.0.4.12. Find the issuing process.' },
  { assetId: 'orders', subject: 'REQUEST TRACE', note: 'The internal host at 10.0.4.21 receives the request before order records are written. Locate it in the flow.' },
  { assetId: 'database', subject: 'RETENTION NOTICE', note: 'One persistent store contains customer names, email addresses, and purchase history. Identify that store.' },
]