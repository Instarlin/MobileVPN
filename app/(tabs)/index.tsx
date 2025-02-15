import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated, StatusBar, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function VPNApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState('United States');
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  
  // Animations
  const borderSpinValue = useRef(new Animated.Value(0)).current;
  const metricsOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;

  const servers = [
    { country: 'United States', ping: '56ms', load: '65%' },
    { country: 'Netherlands', ping: '89ms', load: '45%' },
    { country: 'Japan', ping: '112ms', load: '30%' },
    { country: 'Germany', ping: '78ms', load: '55%' },
  ];

  // Rotating border animation
  useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.timing(borderSpinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      borderSpinValue.setValue(0);
    }
  }, [isConnecting, borderSpinValue]);

  // Metrics fade-in animation
  useEffect(() => {
    if (isConnected) {
      Animated.timing(metricsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      metricsOpacity.setValue(0);
    }
  }, [isConnected, metricsOpacity]);

  const spin = borderSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animateButtonPress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Ripple animation
    rippleScale.setValue(0);
    rippleOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleConnection = () => {
    animateButtonPress();
    if (!isConnected && !isConnecting) {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    } else if (isConnected) {
      setIsConnected(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1b1f', '#222529']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Status Section */}
          <View style={styles.statusContainer}>
            <View style={styles.buttonWrapper}>
              {isConnecting && (
                <Animated.View
                  style={[
                    styles.rotatingBorder,
                    {
                      transform: [{ rotate: spin }],
                    },
                  ]}
                />
              )}
              <Animated.View
                style={[
                  styles.rippleEffect,
                  {
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.connectionButton,
                  isConnected ? styles.connected : styles.disconnected,
                ]}
                onPress={toggleConnection}
                disabled={isConnecting}
              >
                <Animated.View
                  style={[
                    styles.buttonContent,
                    { transform: [{ scale: buttonScale }] },
                  ]}
                >
                  <Ionicons
                    name={isConnected ? 'shield-checkmark' : 'shield-outline'}
                    size={40}
                    color="#fff"
                  />
                  <Text style={styles.connectionStatus}>
                    {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Tap to Connect'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Connection Info */}
            {isConnected && (
              <Animated.View style={[styles.statsContainer, { opacity: metricsOpacity }]}>
                <View style={styles.statItem}>
                  <MaterialIcons name="speed" size={24} color="#6c7ee1" />
                  <Text style={styles.statValue}>128.5 Mbps</Text>
                  <Text style={styles.statLabel}>Download</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="upload" size={24} color="#6c7ee1" />
                  <Text style={styles.statValue}>45.2 Mbps</Text>
                  <Text style={styles.statLabel}>Upload</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="timer" size={24} color="#6c7ee1" />
                  <Text style={styles.statValue}>35ms</Text>
                  <Text style={styles.statLabel}>Ping</Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Settings Section */}
          <View style={styles.settingsContainer}>
            <Pressable 
              style={styles.settingItem}
              onPress={() => setAutoConnect(!autoConnect)}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="wifi-tethering" size={24} color="#6c7ee1" />
                <Text style={styles.settingText}>Auto-Connect</Text>
              </View>
              <Switch
                value={autoConnect}
                onValueChange={setAutoConnect}
                trackColor={{ false: '#3a3d46', true: '#6c7ee1' }}
                thumbColor={autoConnect ? '#fff' : '#f4f3f4'}
              />
            </Pressable>
            <Pressable 
              style={styles.settingItem}
              onPress={() => setKillSwitch(!killSwitch)}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="security" size={24} color="#6c7ee1" />
                <Text style={styles.settingText}>Kill Switch</Text>
              </View>
              <Switch
                value={killSwitch}
                onValueChange={setKillSwitch}
                trackColor={{ false: '#3a3d46', true: '#6c7ee1' }}
                thumbColor={killSwitch ? '#fff' : '#f4f3f4'}
              />
            </Pressable>
          </View>

          {/* Server Selection */}
          <View style={styles.serversContainer}>
            <Text style={styles.sectionTitle}>Server Location</Text>
            {servers.map((server) => (
              <TouchableOpacity
                key={server.country}
                style={[
                  styles.serverItem,
                  selectedServer === server.country && styles.selectedServer,
                ]}
                onPress={() => setSelectedServer(server.country)}
              >
                <View style={styles.serverLeft}>
                  <FontAwesome5 name="server" size={20} color="#6c7ee1" />
                  <Text style={styles.serverCountry}>{server.country}</Text>
                </View>
                <View style={styles.serverRight}>
                  <Text style={styles.serverPing}>{server.ping}</Text>
                  <Text style={styles.serverLoad}>Load: {server.load}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statusContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25,
    position: 'relative',
  },
  connectionButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingBorder: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: '#6c7ee1',
    borderStyle: 'dashed',
  },
  rippleEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#6c7ee1',
  },
  buttonContent: {
    alignItems: 'center',
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#6c7ee1',
  },
  connectionStatus: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    backgroundColor: '#2a2d36',
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  statLabel: {
    color: '#8c8e96',
    fontSize: 12,
    marginTop: 2,
  },
  settingsContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2d36',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  serversContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  serverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2d36',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedServer: {
    backgroundColor: '#3a3d46',
    borderColor: '#6c7ee1',
    borderWidth: 1,
  },
  serverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverCountry: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  serverRight: {
    alignItems: 'flex-end',
  },
  serverPing: {
    color: '#6c7ee1',
    fontSize: 14,
  },
  serverLoad: {
    color: '#8c8e96',
    fontSize: 12,
    marginTop: 2,
  },
});