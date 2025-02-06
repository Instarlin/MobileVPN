import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function VPNSettings() {
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [splitTunneling, setSplitTunneling] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [protocol, setProtocol] = useState('automatic');

  const SettingItem = ({ icon, title, description, value, onPress, type = 'switch' }) => (    
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        type !== 'last' && {
          borderBottomWidth: 1,
          borderBottomColor: '#3a3d46',
        }
      ]}
      onPress={onPress}
      
      android_ripple={{ color: '#3a3d46' }}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#3a3d46', true: '#6c7ee1' }}
          thumbColor={Platform.OS === 'ios' ? '#fff' : value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#6c7ee1" />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1a1b1f', '#2d2f36']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<MaterialIcons name="wifi" size={24} color="#6c7ee1" />}
            title="Auto-Connect"
            description="Connect VPN automatically on unsafe networks"
            value={autoConnect}
            onPress={() => setAutoConnect(!autoConnect)}
          />
          <SettingItem
            icon={<MaterialCommunityIcons name="shield-lock" size={24} color="#6c7ee1" />}
            title="Kill Switch"
            description="Block internet if VPN connection drops"
            value={killSwitch}
            onPress={() => setKillSwitch(!killSwitch)}
          />
          <SettingItem
            icon={<MaterialIcons name="route" size={24} color="#6c7ee1" />}
            title="Split Tunneling"
            description="Choose apps to bypass VPN"
            value={splitTunneling}
            onPress={() => setSplitTunneling(!splitTunneling)}
            type="last"
          />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<Ionicons name="notifications" size={24} color="#6c7ee1" />}
            title="Notifications"
            description="Get alerts about connection status"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <SettingItem
            icon={<MaterialIcons name="security" size={24} color="#6c7ee1" />}
            title="Protocol"
            description="Current: Automatic"
            value={protocol}
            onPress={() => {}}
            type="last"
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<MaterialIcons name="account-circle" size={24} color="#6c7ee1" />}
            title="Subscription"
            description="Premium Plan (1 year)"
            onPress={() => {}}
            type="arrow"
          />
          <SettingItem
            icon={<MaterialIcons name="help-outline" size={24} color="#6c7ee1" />}
            title="Help & Support"
            description="FAQ, contact support"
            onPress={() => {}}
            type="last"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c7ee1',
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  settingsGroup: {
    backgroundColor: '#2a2d36',
    borderRadius: 12,
    overflow: 'hidden',
  },  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2d36',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a3d46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#9ca3af',
  },
});