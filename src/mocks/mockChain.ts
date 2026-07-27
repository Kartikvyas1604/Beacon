export type ConnectivityStatus = 'online' | 'mesh' | 'offline';

export interface MeshPeer {
  id: string;
  name: string;
  hops: number;
  lastSeen: Date;
  signalStrength: number;
  online: boolean;
  isBridge: boolean;
  trusted: boolean;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  fromName?: string;
  to: string;
  toName?: string;
  amount: number;
  asset?: string;
  memo?: string;
  memoType?: 'text' | 'id' | 'hash';
  type: 'payment' | 'swap' | 'trustline' | 'contract' | 'settings' | 'freeze';
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'relayed' | 'rejected' | 'failed';
  route: 'online' | 'mesh';
  hopPath?: string[];
  fee?: number;
}

export interface SpendingLimits {
  dailyLimit: number;
  dailyUsed: number;
  perTxMax: number;
  hourlyVelocity: number;
  hourlyCount: number;
  autoSaveBps: number;
  lastReset: Date;
}

export interface Asset {
  id: string;
  code: string;
  issuer: string;
  issuerName: string;
  balance: number;
  limit: number;
  verified: boolean;
  change24h: number;
  image?: string;
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  federation?: string;
  notes?: string;
  isExchange?: boolean;
}

export interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  balanceA: number;
  balanceB: number;
  shareBalance: number;
  apr: number;
}

export interface OpenOrder {
  id: string;
  selling: string;
  buying: string;
  amount: number;
  price: number;
  created: Date;
}

export interface ConnectedDApp {
  id: string;
  name: string;
  url: string;
  icon: string;
  permissions: string[];
  lastUsed: Date;
  connected: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
  onChainTxHash: string;
}

export interface Anchor {
  id: string;
  name: string;
  domain: string;
  currency: string;
  fee: number;
  verified: boolean;
  depositEnabled: boolean;
  withdrawEnabled: boolean;
}

export interface RelayQueueItem {
  id: string;
  txHash: string;
  recipient: string;
  amount: number;
  status: 'pending' | 'relaying' | 'confirmed' | 'rejected' | 'stuck';
  hopPath: string[];
  createdAt: Date;
  lastHop: string;
}

export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  index: number;
  isDefault: boolean;
}

export interface MeshSettings {
  enabled: boolean;
  relayForOthers: boolean;
  maxHops: number;
  bluetoothEnabled: boolean;
}

export interface NetworkSettings {
  network: 'mainnet' | 'testnet' | 'futurenet';
  customRpc?: string;
  customHorizon?: string;
}

export interface NotificationSettings {
  payments: boolean;
  limitWarnings: boolean;
  meshConfirmations: boolean;
  securityAlerts: boolean;
}

export interface WalletState {
  address: string;
  balance: number;
  savingsBalance: number;
  spendableBalance: number;
  limits: SpendingLimits;
  connectivity: ConnectivityStatus;
  meshPeers: MeshPeer[];
  recentTransactions: Transaction[];
  frozen: boolean;
  hopCount: number;
  onboarded: boolean;
  accounts: WalletAccount[];
  assets: Asset[];
  contacts: Contact[];
  liquidityPools: LiquidityPool[];
  openOrders: OpenOrder[];
  connectedDApps: ConnectedDApp[];
  auditLog: AuditLogEntry[];
  relayQueue: RelayQueueItem[];
  meshSettings: MeshSettings;
  networkSettings: NetworkSettings;
  notificationSettings: NotificationSettings;
  pin: string;
  biometricEnabled: boolean;
  seedVerified: boolean;
  federationAddress?: string;
}

const ADDR = 'GA7QHN3XHKP4M2P4VXZK8N9L3R6T1W5Y7B2D4F6J8M1Q3S';
const HASH = 'a3f8c9d2b1e4f7';

function hoursAgo(h: number): Date { return new Date(Date.now() - h * 3600000); }
function minutesAgo(m: number): Date { return new Date(Date.now() - m * 60000); }
function daysAgo(d: number): Date { return new Date(Date.now() - d * 86400000); }

export const mockWallet: WalletState = {
  address: ADDR,
  balance: 8432.50,
  savingsBalance: 2105.75,
  spendableBalance: 6326.75,
  limits: {
    dailyLimit: 5000,
    dailyUsed: 3673.25,
    perTxMax: 1000,
    hourlyVelocity: 10,
    hourlyCount: 3,
    autoSaveBps: 2500,
    lastReset: new Date(new Date().setHours(0, 0, 0, 0)),
  },
  connectivity: 'online',
  meshPeers: [
    { id: 'p1', name: 'NODE-A7', hops: 1, lastSeen: minutesAgo(2), signalStrength: 0.85, online: true, isBridge: true, trusted: true },
    { id: 'p2', name: 'NODE-B3', hops: 1, lastSeen: minutesAgo(5), signalStrength: 0.72, online: true, isBridge: false, trusted: true },
    { id: 'p3', name: 'NODE-C1', hops: 2, lastSeen: minutesAgo(12), signalStrength: 0.45, online: true, isBridge: false, trusted: false },
    { id: 'p4', name: 'NODE-D9', hops: 3, lastSeen: minutesAgo(28), signalStrength: 0.3, online: false, isBridge: false, trusted: false },
    { id: 'p5', name: 'NODE-E2', hops: 2, lastSeen: minutesAgo(8), signalStrength: 0.58, online: true, isBridge: true, trusted: true },
  ],
  recentTransactions: [
    { id: 'tx1', hash: HASH + '1', from: 'GDRR4K9X2M', to: ADDR, amount: 250.00, asset: 'XLM', type: 'payment', timestamp: minutesAgo(15), status: 'confirmed', route: 'online', fee: 0.00001, fromName: 'Ria Chen' },
    { id: 'tx2', hash: HASH + '2', from: ADDR, to: 'GBKT7M3P1N', amount: 120.50, asset: 'XLM', memo: 'Invoice #4821', memoType: 'text', type: 'payment', timestamp: hoursAgo(1), status: 'confirmed', route: 'mesh', hopPath: ['NODE-A7', 'NODE-B3', 'NODE-C1'], fee: 0.00001, toName: 'Marcus Webb' },
    { id: 'tx3', hash: HASH + '3', from: 'GCNA2L8K4R', to: ADDR, amount: 890.00, asset: 'USDC', type: 'payment', timestamp: hoursAgo(2), status: 'confirmed', route: 'online', fee: 0.00001, fromName: 'Anchor USD' },
    { id: 'tx4', hash: HASH + '4', from: ADDR, to: 'GFRS9J5N7T', amount: 45.00, asset: 'XLM', type: 'payment', timestamp: hoursAgo(3), status: 'pending', route: 'mesh', hopPath: ['NODE-B3', 'NODE-E2'], fee: 0.00001 },
    { id: 'tx5', hash: HASH + '5', from: 'GQHT3R6W1P', to: ADDR, amount: 1500.00, asset: 'XLM', type: 'payment', timestamp: hoursAgo(5), status: 'confirmed', route: 'online', fee: 0.00001, fromName: 'Saved Contact' },
    { id: 'tx6', hash: HASH + '6', from: ADDR, to: 'GYPL8T2V4N', amount: 67.25, asset: 'XLM', memoType: 'text', type: 'payment', timestamp: hoursAgo(7), status: 'confirmed', route: 'online', fee: 0.00001 },
    { id: 'tx7', hash: HASH + '7', from: ADDR, to: 'GABC1D2E3F', amount: 200.00, asset: 'XLM', type: 'swap', timestamp: hoursAgo(12), status: 'confirmed', route: 'online', fee: 0.00001 },
    { id: 'tx8', hash: HASH + '8', from: ADDR, to: 'GXYZ7W8K9L', amount: 0, asset: 'USDC', type: 'trustline', timestamp: daysAgo(1), status: 'confirmed', route: 'online', fee: 0.00001 },
    { id: 'tx9', hash: HASH + '9', from: 'GDEF4H5J6K', to: ADDR, amount: 320.00, asset: 'XLM', type: 'payment', timestamp: daysAgo(1), status: 'confirmed', route: 'online', fee: 0.00001 },
    { id: 'tx10', hash: HASH + '10', from: ADDR, to: 'GAAA1B2C3D', amount: 150.00, asset: 'XLM', type: 'payment', timestamp: daysAgo(2), status: 'confirmed', route: 'mesh', hopPath: ['NODE-A7', 'NODE-E2'], fee: 0.00001 },
    { id: 'tx11', hash: HASH + '11', from: ADDR, to: '', amount: 0, asset: 'XLM', type: 'freeze', timestamp: daysAgo(3), status: 'confirmed', route: 'online', fee: 0.00001 },
    { id: 'tx12', hash: HASH + '12', from: 'GNEW5M6N7P', to: ADDR, amount: 500.00, asset: 'USDC', type: 'payment', timestamp: daysAgo(4), status: 'confirmed', route: 'online', fee: 0.00001, fromName: 'Fiat Deposit' },
  ],
  frozen: false,
  hopCount: 1,
  onboarded: false,
  accounts: [
    { id: 'a1', name: 'Primary', address: ADDR, index: 0, isDefault: true },
    { id: 'a2', name: 'Savings', address: 'GB7QHN3XHKP4M2P4VXZK8N9L3R6T1W5Y7B2D4F6J8M1Q3S', index: 1, isDefault: false },
    { id: 'a3', name: 'Business', address: 'GC9QHN3XHKP4M2P4VXZK8N9L3R6T1W5Y7B2D4F6J8M1Q3S', index: 2, isDefault: false },
  ],
  assets: [
    { id: 'ast1', code: 'XLM', issuer: 'Stellar', issuerName: 'Stellar', balance: 6326.75, limit: 0, verified: true, change24h: 2.4 },
    { id: 'ast2', code: 'USDC', issuer: 'GA5ZSEJYB37JTH5GBVIT3MYZ54KDF57D76GHZQTLVBARQFOJK2KEMX4V2', issuerName: 'Circle', balance: 2105.75, limit: 100000, verified: true, change24h: 0.1 },
    { id: 'ast3', code: 'EURC', issuer: 'GA5ZSEJYB37JTH5GBVIT3MYZ54KDF57D76GHZQTLVBARQFOJK2KEMX4V2', issuerName: 'Circle', balance: 0, limit: 50000, verified: true, change24h: -0.3 },
    { id: 'ast4', code: 'BTC', issuer: 'GBRDY5FCL7LXXXJH55BO62GVNL3KBFMT4VQ4YDQ3MW5JDE2C3OZQYJCL', issuerName: 'Stellar BTC', balance: 0, limit: 10, verified: true, change24h: 1.2 },
  ],
  contacts: [
    { id: 'c1', name: 'Ria Chen', address: 'GDRR4K9X2M', federation: 'ria*stellar.org', notes: 'Friend', isExchange: false },
    { id: 'c2', name: 'Marcus Webb', address: 'GBKT7M3P1N', notes: 'Contractor', isExchange: false },
    { id: 'c3', name: 'Coinbase', address: 'GCO2IPVTMJ6VZ6XL2IBBJ3UEJRZ2UZQ5IKZJHXTVPIW3GOAJBTHVNLH4', notes: 'Exchange', isExchange: true },
    { id: 'c4', name: 'Binance', address: 'GCOIPVHLP3D2FZXQOYK7B3M4S3D5F6G7H8J9K0L1M2N3O4P5Q6R7S8T9', notes: 'Exchange', isExchange: true },
    { id: 'c5', name: 'Mom', address: 'GFRS9J5N7T', federation: 'mom*home.org', isExchange: false },
  ],
  liquidityPools: [
    { id: 'lp1', tokenA: 'XLM', tokenB: 'USDC', balanceA: 1000, balanceB: 125, shareBalance: 45.5, apr: 12.5 },
    { id: 'lp2', tokenA: 'USDC', tokenB: 'EURC', balanceA: 500, balanceB: 460, shareBalance: 22.1, apr: 8.3 },
  ],
  openOrders: [
    { id: 'o1', selling: 'XLM', buying: 'USDC', amount: 500, price: 0.125, created: hoursAgo(2) },
    { id: 'o2', selling: 'USDC', buying: 'EURC', amount: 200, price: 0.92, created: hoursAgo(5) },
  ],
  connectedDApps: [
    { id: 'd1', name: 'StellarTerm', url: 'https://stellarterm.com', icon: '◆', permissions: ['read_address', 'propose_transactions'], lastUsed: hoursAgo(1), connected: true },
    { id: 'd2', name: 'Soroban DEX', url: 'https://soroban-dex.com', icon: '⬡', permissions: ['read_address', 'propose_transactions'], lastUsed: hoursAgo(3), connected: true },
    { id: 'd3', name: 'Lobstr', url: 'https://lobstr.co', icon: '◉', permissions: ['read_address'], lastUsed: daysAgo(2), connected: false },
  ],
  auditLog: [
    { id: 'al1', action: 'updated', field: 'dailyLimit', oldValue: '3000', newValue: '5000', timestamp: daysAgo(1), onChainTxHash: HASH + 'a1' },
    { id: 'al2', action: 'updated', field: 'perTxMax', oldValue: '500', newValue: '1000', timestamp: daysAgo(1), onChainTxHash: HASH + 'a2' },
    { id: 'al3', action: 'updated', field: 'autoSaveBps', oldValue: '2000', newValue: '2500', timestamp: daysAgo(3), onChainTxHash: HASH + 'a3' },
    { id: 'al4', action: 'froze', field: 'frozen', oldValue: 'false', newValue: 'true', timestamp: daysAgo(5), onChainTxHash: HASH + 'a4' },
    { id: 'al5', action: 'unfroze', field: 'frozen', oldValue: 'true', newValue: 'false', timestamp: daysAgo(5), onChainTxHash: HASH + 'a5' },
  ],
  relayQueue: [
    { id: 'rq1', txHash: HASH + 'r1', recipient: 'GFRS9J5N7T', amount: 45.00, status: 'relaying', hopPath: ['NODE-B3', 'NODE-E2'], createdAt: hoursAgo(3), lastHop: 'NODE-E2' },
    { id: 'rq2', txHash: HASH + 'r2', recipient: 'GBKT7M3P1N', amount: 120.50, status: 'confirmed', hopPath: ['NODE-A7', 'NODE-B3', 'NODE-C1'], createdAt: hoursAgo(1), lastHop: 'NODE-C1' },
  ],
  meshSettings: {
    enabled: true,
    relayForOthers: true,
    maxHops: 5,
    bluetoothEnabled: true,
  },
  networkSettings: {
    network: 'testnet',
  },
  notificationSettings: {
    payments: true,
    limitWarnings: true,
    meshConfirmations: true,
    securityAlerts: true,
  },
  pin: '1234',
  biometricEnabled: false,
  seedVerified: true,
  federationAddress: 'beacon*stellar.org',
};
