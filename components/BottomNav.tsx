import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  isShelter?: boolean;
}

export default function BottomNav({ activeTab, onTabPress, isShelter = false }: BottomNavProps) {
  const tabs = isShelter
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'chat', label: 'Messages', icon: '💬' },
        { id: 'profile', label: 'Profile', icon: '👤' },
      ]
    : [
        { id: 'feed', label: 'Home', icon: '🏠' },
        { id: 'chat', label: 'Chat', icon: '💬' },
        { id: 'profile', label: 'Profile', icon: '👤' },
      ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
        >
          <Text
            style={[
              styles.icon,
              activeTab === tab.id && styles.iconActive,
            ]}
          >
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.labelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  labelActive: {
    color: '#7C3AED',
  },
});