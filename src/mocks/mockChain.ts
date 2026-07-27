export type ConnectivityStatus = 'online' | 'mesh' | 'frozen';

export interface MeshPeer {
  id: string;
  name: string;
  hops: number;
  lastSeen: Date;
  signalStrength: number;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'relayed';
  route: 'online' | 'mesh';
  hopPath?: string[];
}

export interface SpendingLimits {
  dailyLimit: number;
  dailyUsed: number;
  perTxMax: number;
  hourlyVelocity: number;
  hourlyCount: number;
  autoSaveBps: number;
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
}

const MOCK_ADDRESS = 'GA7QHN3XH...K8M2P4';
const MOCK_HASH = 'a3f8c9d2...e7b1';

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600000);
}

function minutesAgo(m: number): Date {
  return new Date(Date.now() - m * 60000);
}

export const mockWallet: WalletState = {
  address: MOCK_ADDRESS,
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
  },
  connectivity: 'mesh',
  meshPeers: [
    { id: 'p1', name: 'NODE-A7', hops: 1, lastSeen: minutesAgo(2), signalStrength: 0.85 },
    { id: 'p2', name: 'NODE-B3', hops: 1, lastSeen: minutesAgo(5), signalStrength: 0.72 },
    { id: 'p3', name: 'NODE-C1', hops: 2, lastSeen: minutesAgo(12), signalStrength: 0.45 },
    { id: 'p4', name: 'NODE-D9', hops: 3, lastSeen: minutesAgo(28), signalStrength: 0.3 },
    { id: 'p5', name: 'NODE-E2', hops: 2, lastSeen: minutesAgo(8), signalStrength: 0.58 },
  ],
  recentTransactions: [
    {
      id: 'tx1',
      hash: MOCK_HASH + '1',
      from: 'GDRR4...K9X2',
      to: MOCK_ADDRESS,
      amount: 250.00,
      timestamp: minutesAgo(15),
      status: 'confirmed',
      route: 'online',
    },
    {
      id: 'tx2',
      hash: MOCK_HASH + '2',
      from: MOCK_ADDRESS,
      to: 'GBKT7...M3P1',
      amount: 120.50,
      timestamp: hoursAgo(1),
      status: 'relayed',
      route: 'mesh',
      hopPath: ['NODE-A7', 'NODE-B3', 'NODE-C1'],
    },
    {
      id: 'tx3',
      hash: MOCK_HASH + '3',
      from: 'GCNA2...L8K4',
      to: MOCK_ADDRESS,
      amount: 890.00,
      timestamp: hoursAgo(2),
      status: 'confirmed',
      route: 'online',
    },
    {
      id: 'tx4',
      hash: MOCK_HASH + '4',
      from: MOCK_ADDRESS,
      to: 'GFRS9...J5N7',
      amount: 45.00,
      timestamp: hoursAgo(3),
      status: 'pending',
      route: 'mesh',
      hopPath: ['NODE-B3', 'NODE-E2'],
    },
    {
      id: 'tx5',
      hash: MOCK_HASH + '5',
      from: 'GQHT3...R6W1',
      to: MOCK_ADDRESS,
      amount: 1500.00,
      timestamp: hoursAgo(5),
      status: 'confirmed',
      route: 'online',
    },
    {
      id: 'tx6',
      hash: MOCK_HASH + '6',
      from: MOCK_ADDRESS,
      to: 'GYPL8...T2V4',
      amount: 67.25,
      timestamp: hoursAgo(7),
      status: 'confirmed',
      route: 'online',
    },
  ],
};

export const mockOnboardingSlides = [
  {
    title: 'Your money still moves\nwhen the network doesn\'t.',
    subtitle: 'Beacon relays signed transactions device-to-device over mesh — no internet required.',
    icon: 'signal' as const,
  },
  {
    title: 'Built-in limits\nyou can trust.',
    subtitle: 'Daily spending caps, per-transaction maximums, and velocity controls protect your funds even offline.',
    icon: 'shield' as const,
  },
  {
    title: 'Emergency freeze.\nOne tap.',
    subtitle: 'Lock your wallet instantly. No delays, no confirmations needed beyond the press-and-hold.',
    icon: 'lock' as const,
  },
];
