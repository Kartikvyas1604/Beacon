import { create } from 'zustand';
import {
  ConnectivityStatus,
  MeshPeer,
  Transaction,
  SpendingLimits,
  Asset,
  Contact,
  LiquidityPool,
  OpenOrder,
  ConnectedDApp,
  AuditLogEntry,
  RelayQueueItem,
  WalletAccount,
  MeshSettings,
  NetworkSettings,
  NotificationSettings,
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
  activeAccount: WalletAccount;

  setActiveAccount: (id: string) => void;
  setConnectivity: (status: ConnectivityStatus) => void;
  setFrozen: (frozen: boolean) => void;
  updateLimits: (limits: Partial<SpendingLimits>) => void;
  addTransaction: (tx: Transaction) => void;
  markTransactionConfirmed: (id: string) => void;
  completeOnboarding: () => void;
  setLimits: (limits: Partial<SpendingLimits>) => void;
  freezeWallet: () => void;
  unfreezeWallet: () => void;
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  addOrder: (order: OpenOrder) => void;
  cancelOrder: (id: string) => void;
  revokeDApp: (id: string) => void;
  updateMeshSettings: (settings: Partial<MeshSettings>) => void;
  updateNetworkSettings: (settings: Partial<NetworkSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  updateRelayStatus: (id: string, status: RelayQueueItem['status']) => void;
  setBiometric: (enabled: boolean) => void;
  setPin: (pin: string) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  ...mockWallet,
  activeAccount: mockWallet.accounts[0],

  setActiveAccount: (id) =>
    set((state) => {
      const account = state.accounts.find(a => a.id === id);
      if (!account) return state;
      return {
        activeAccount: account,
        address: account.address,
      };
    }),

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
      recentTransactions: [tx, ...state.recentTransactions].slice(0, 50),
    })),

  markTransactionConfirmed: (id) =>
    set((state) => ({
      recentTransactions: state.recentTransactions.map((tx) =>
        tx.id === id ? { ...tx, status: 'confirmed' as const } : tx
      ),
    })),

  completeOnboarding: () => set({ onboarded: true }),

  setLimits: (partial) =>
    set((state) => ({
      limits: { ...state.limits, ...partial },
    })),

  freezeWallet: () => set({ frozen: true }),

  unfreezeWallet: () => set({ frozen: false }),

  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, contact],
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter(c => c.id !== id),
    })),

  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),

  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter(a => a.id !== id),
    })),

  addOrder: (order) =>
    set((state) => ({
      openOrders: [...state.openOrders, order],
    })),

  cancelOrder: (id) =>
    set((state) => ({
      openOrders: state.openOrders.filter(o => o.id !== id),
    })),

  revokeDApp: (id) =>
    set((state) => ({
      connectedDApps: state.connectedDApps.map(d =>
        d.id === id ? { ...d, connected: false } : d
      ),
    })),

  updateMeshSettings: (partial) =>
    set((state) => ({
      meshSettings: { ...state.meshSettings, ...partial },
    })),

  updateNetworkSettings: (partial) =>
    set((state) => ({
      networkSettings: { ...state.networkSettings, ...partial },
    })),

  updateNotificationSettings: (partial) =>
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...partial },
    })),

  addAuditLog: (entry) =>
    set((state) => ({
      auditLog: [
        { ...entry, id: 'al' + Date.now(), timestamp: new Date() },
        ...state.auditLog,
      ],
    })),

  updateRelayStatus: (id, status) =>
    set((state) => ({
      relayQueue: state.relayQueue.map(r =>
        r.id === id ? { ...r, status } : r
      ),
    })),

  setBiometric: (enabled) => set({ biometricEnabled: enabled }),

  setPin: (pin) => set({ pin }),
}));
