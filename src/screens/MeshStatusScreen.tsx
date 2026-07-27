import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';
import { RadarPeerView } from '../components';

export default function MeshStatusScreen() {
  const nav = useNavigation();
  const connectivity = useWalletStore(s => s.connectivity);
  const peers = useWalletStore(s => s.meshPeers);
  const hops = useWalletStore(s => s.hopCount);

  const statusColor = connectivity === 'mesh' ? colors.amber
    : connectivity === 'online' ? colors.green : colors.red;
  const statusLabel = connectivity === 'online' ? 'On-chain'
    : connectivity === 'mesh' ? 'Mesh relay' : 'Offline';

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => nav.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Mesh Network</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
          </View>
          {connectivity === 'mesh' && (
            <Text style={styles.hopInfo}>
              {hops} hop{hops !== 1 ? 's' : ''} to nearest relay device
            </Text>
          )}
        </View>

        <View style={styles.radarWrap}>
          <View style={styles.radarRing} />
          <View style={[styles.radarRing, styles.r2]} />
          <View style={[styles.radarRing, styles.r3]} />
          <View style={[styles.radarRing, styles.r4]} />
          <View style={styles.radarCenter} />
        </View>

        <View style={styles.peerSection}>
          <Text style={styles.sectionTitle}>Nearby Devices ({peers.length})</Text>
          <View style={styles.peerCard}>
            {peers.length === 0 ? (
              <Text style={styles.emptyText}>Scanning for nearby devices...</Text>
            ) : (
              peers.map((peer, i) => (
                <React.Fragment key={peer.id}>
                  <RadarPeerView peer={peer} />
                  {i < peers.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoBody}>
            Your transactions are signed locally and relayed through nearby
            devices with internet access. Each hop is encrypted end-to-end.
            Intermediate devices cannot read your data.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 20, paddingTop: 56, gap: 24 },
  header: { gap: 8 },
  back: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.accent,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  statusCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  hopInfo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
  },
  radarWrap: {
    width: 160, height: 160,
    alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 1, borderColor: colors.accent + '20',
  },
  r2: { width: 120, height: 120, borderRadius: 60 },
  r3: { width: 80, height: 80, borderRadius: 40 },
  r4: { width: 40, height: 40, borderRadius: 20 },
  radarCenter: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.accent,
  },
  peerSection: { gap: 10 },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  peerCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 12,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  infoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  infoBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
