import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useWalletStore } from '../state/walletStore';
import { colors, spacing, radius } from '../theme';
import { RadarPeerView, Panel } from '../components';

export default function MeshStatusScreen() {
  const connectivity = useWalletStore(s => s.connectivity);
  const peers = useWalletStore(s => s.meshPeers);
  const hops = useWalletStore(s => s.hopCount);

  const statusColor = connectivity === 'mesh' ? colors.amber
    : connectivity === 'online' ? colors.green : colors.red;
  const statusLabel = connectivity === 'online' ? 'On-chain'
    : connectivity === 'mesh' ? 'Mesh relay' : 'Offline';
  const isMesh = connectivity === 'mesh';

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Mesh Status</Text>

        <View style={styles.radarWrap}>
          <View style={styles.radarRing} />
          <View style={[styles.radarRing, styles.radarRing2]} />
          <View style={[styles.radarRing, styles.radarRing3]} />
          <View style={styles.radarDot} />
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          {isMesh && (
            <Text style={styles.hopText}>{hops} hop{hops !== 1 ? 's' : ''} to relay</Text>
          )}
        </View>

        <Panel title={`Nearby Peers (${peers.length})`}>
          {peers.length === 0 ? (
            <Text style={styles.emptyText}>No peers detected. Mesh scanning.</Text>
          ) : (
            peers.map((peer, i) => (
              <React.Fragment key={peer.id}>
                <RadarPeerView peer={peer} />
                {i < peers.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </Panel>

        {isMesh && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How Mesh Relay Works</Text>
            <Text style={styles.infoBody}>
              When you go offline, your transactions are signed locally and
              relayed through nearby devices with internet access. Each hop is
              encrypted end-to-end — intermediate devices cannot read your data.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1, padding: spacing.xl, paddingTop: 56, gap: spacing.xxl,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold', fontSize: 22,
    color: colors.textPrimary, letterSpacing: -0.5,
  },
  radarWrap: {
    width: 140, height: 140, alignSelf: 'center',
    justifyContent: 'center', alignItems: 'center', marginVertical: spacing.md,
  },
  radarRing: {
    position: 'absolute', width: 140, height: 140,
    borderRadius: 70, borderWidth: 1, borderColor: colors.amber + '30',
  },
  radarRing2: { width: 100, height: 100, borderRadius: 50 },
  radarRing3: { width: 60, height: 60, borderRadius: 30 },
  radarDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 13,
    letterSpacing: 0.5,
  },
  hopText: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, marginLeft: 'auto',
  },
  divider: {
    height: 1, backgroundColor: colors.hairline,
  },
  emptyText: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 13,
    color: colors.textMuted, paddingVertical: spacing.xl,
  },
  infoBox: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: spacing.lg, gap: spacing.sm,
  },
  infoTitle: {
    fontFamily: 'IBMPlexMono_500Medium', fontSize: 12,
    color: colors.textSecondary,
  },
  infoBody: {
    fontFamily: 'IBMPlexMono_400Regular', fontSize: 12,
    color: colors.textMuted, lineHeight: 18,
  },
});
