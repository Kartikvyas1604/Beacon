import { create } from 'zustand';
import {
  ConnectivityStatus,
  MeshPeer,
  Transaction,
  SpendingLimits,
  mockWallet,
} from '../mocks/mockChain';

interface WalletStore {
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

  setConnectivity: (status: ConnectivityStatus) => void;
  setFrozen: (frozen: boolean) => void;
  updateLimits: (limits: Partial<SpendingLimits>) => void;
  addTransaction: (tx: Transaction) => void;
  markTransactionConfirmed: (id: string) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  address: mockWallet.address,
  balance: mockWallet.balance,
  savingsBalance: mockWallet.savingsBalance,
  spendableBalance: mockWallet.spendableBalance,
  limits: mockWallet.limits,
  connectivity: mockWallet.connectivity,
  meshPeers: mockWallet.meshPeers,
  recentTransactions: mockWallet.recentTransactions,
  frozen: mockWallet.frozen,
  hopCount: Math.min(...mockWallet.meshPeers.map((p) => p.hops)),

  setConnectivity: (status) =>
    set({
      connectivity: status,
      hopCount:
        status === 'online'
          ? 0
          : Math.min(...get().meshPeers.map((p) => p.hops)),
    }),

  setFrozen: (frozen) => set({ frozen }),

  updateLimits: (partial) =>
    set((state) => ({
      limits: { ...state.limits, ...partial },
    })),

  addTransaction: (tx) =>
    set((state) => ({
      recentTransactions: [tx, ...state.recentTransactions].slice(0, 20),
    })),

  markTransactionConfirmed: (id) =>
    set((state) => ({
      recentTransactions: state.recentTransactions.map((tx) =>
        tx.id === id ? { ...tx, status: 'confirmed' as const } : tx
      ),
    })),
}));
