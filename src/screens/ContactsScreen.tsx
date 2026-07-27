import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../state/walletStore';
import { colors, radius } from '../theme';

export default function ContactsScreen() {
  const nav = useNavigation<any>();
  const contacts = useWalletStore(s => s.contacts);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Contacts</Text>

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={search} onChangeText={setSearch}
            placeholder="Search contacts..." placeholderTextColor={colors.textFaint}
          />
        </View>

        <View style={styles.list}>
          {filtered.map(contact => (
            <Pressable key={contact.id} style={styles.contactCard}>
              <View style={[styles.avatar, { backgroundColor: contact.isExchange ? colors.blueDim : colors.accentDim }]}>
                <Text style={styles.avatarText}>{contact.name[0]}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{contact.name}</Text>
                  {contact.isExchange && <Text style={styles.exchangeBadge}>Exchange</Text>}
                </View>
                <Text style={styles.address}>{contact.address.slice(0, 16)}...</Text>
                {contact.federation && (
                  <Text style={styles.federation}>{contact.federation}</Text>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.addBtn}>
          <Text style={styles.addText}>+ Add Contact</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, gap: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.textPrimary },
  searchWrap: { backgroundColor: colors.bgCard, borderRadius: 12 },
  searchInput: {
    padding: 12, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textPrimary,
  },
  list: { gap: 8 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderRadius: 14, padding: 14,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.textPrimary },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary },
  exchangeBadge: {
    fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.blue,
    backgroundColor: colors.blueDim, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  address: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors.textMuted },
  federation: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.accent },
  chevron: { fontFamily: 'Inter_400Regular', fontSize: 18, color: colors.textMuted },
  addBtn: {
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: 14, padding: 14, alignItems: 'center',
  },
  addText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.accent },
});
