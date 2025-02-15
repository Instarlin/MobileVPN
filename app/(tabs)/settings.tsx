import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Modal,
  SafeAreaView
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ModalHeaderProps {
  title: string,
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <View style={styles.modalHeader}>
    <TouchableOpacity onPress={onClose} style={styles.modalBackButton}>
      <MaterialIcons name="arrow-back" size={24} color="#6c7ee1" />
    </TouchableOpacity>
    <Text style={styles.modalTitle}>{title}</Text>
    <View style={{ width: 40 }} />
  </View>
);

export default function VPNSettings() {
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [protocol, setProtocol] = useState('Automatic');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const toggleAppSelection = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

  const protocols = [
    'Automatic',
    'OpenVPN (UDP)',
    'OpenVPN (TCP)',
    'IKEv2',
    'WireGuard'
  ];

  const apps = [
    { id: '1', name: 'WhatsApp', icon: 'logo-whatsapp' },
    { id: '2', name: 'Chrome', icon: 'logo-chrome' },
    { id: '3', name: 'Spotify', icon: 'musical-notes' },
    { id: '4', name: 'Netflix', icon: 'play' },
    { id: '5', name: 'Gmail', icon: 'mail' },
  ];

  const faqItems = [
    {
      question: 'How do I connect to VPN?',
      answer: 'Simply tap the connect button on the main screen. The app will automatically choose the best server for you.'
    },
    {
      question: 'What is Kill Switch?',
      answer: 'Kill Switch is a security feature that blocks all internet traffic if your VPN connection drops unexpectedly.'
    },
    {
      question: 'How to change server location?',
      answer: 'Go to the main screen and tap on the location selector to choose from our available server locations.'
    },
  ];

  interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: boolean;
    onPress?: () => void;
    type?: 'switch' | 'dropdown';
    last?: boolean;
    renderDropdown?: () => React.ReactNode;
  }

  const SettingItem: React.FC<SettingItemProps> = ({ 
    icon,
    title, 
    description,
    value,
    onPress,
    type = 'switch',
    last = false,
    renderDropdown 
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    const rotation = useSharedValue(0);
    const height = useSharedValue(0);
  
    const toggleDropdown = () => {
      setIsExpanded(!isExpanded);

      rotation.value = withTiming(isExpanded ? 0 : 90, { duration: 200 });
      height.value = withTiming(isExpanded ? 0 : contentHeight, { duration: 300 });
    };

    const animatedChevronStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));
  
    const animatedDropdownStyle = useAnimatedStyle(() => ({
      height: height.value,
      overflow: 'hidden',
    }));

    return (
      <View>
        <TouchableOpacity 
          style={[
            styles.settingItem, 
            !last && { borderBottomWidth: 1, borderBottomColor: '#3a3d46' }
          ]}
          onPress={() => {
            if (type === 'dropdown') {
              toggleDropdown();
            }
            if (onPress) onPress();
            }
          }
        >
          <View style={styles.settingIconContainer}>{icon}</View>
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
            <Animated.View style={animatedChevronStyle}>
              <MaterialIcons name="chevron-right" size={24} color="#6c7ee1" />
            </Animated.View>
          )}
        </TouchableOpacity>

        {type === 'dropdown' && renderDropdown && (
          <Animated.View style={[styles.dropdownContainer, animatedDropdownStyle]}>
            <View
              style={{position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden'}}
              onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
            >
              {renderDropdown()}
            </View>
          </Animated.View>
        )}
      </View>
    )
  };
  
  return (
    <LinearGradient
      colors={['#1a1b1f', '#222529']}
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
            description={`${selectedApps.length} apps selected`}
            type={'dropdown'}
            last={true}
            renderDropdown={() => (
              apps.map((app, index) => (
                <TouchableOpacity
                  key={app.id}
                  style={[
                    styles.dropdownItem,
                    index === apps.length - 1 && styles.lastDropdownItem
                  ]}
                  onPress={() => toggleAppSelection(app.id)}
                >
                  <Ionicons name={app.icon} size={24} color="#6c7ee1" />
                  <Text style={styles.appName}>{app.name}</Text>
                  {selectedApps.includes(app.id) && (
                    <MaterialIcons name="check" size={24} color="#6c7ee1" />
                  )}
                </TouchableOpacity>
              ))
            )}
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
            description={`Current: ${protocol}`}
            type={'dropdown'}
            last={true}
            renderDropdown={() => (
              protocols.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    index === protocols.length - 1 && styles.lastDropdownItem
                  ]}
                  onPress={() => {
                    setProtocol(item);
                  }}
                >
                  <Text style={styles.protocolName}>{item}</Text>
                  {protocol === item && (
                    <MaterialIcons name="check" size={24} color="#6c7ee1" />
                  )}
                </TouchableOpacity>
              ))
            )}
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<MaterialIcons name="account-circle" size={24} color="#6c7ee1" />}
            title="Subscription"
            description="Premium Plan (1 year)"
            onPress={() => setShowSubscriptionModal(true)}
            type='dropdown'
          />
          <SettingItem
            icon={<MaterialIcons name="help-outline" size={24} color="#6c7ee1" />}
            title="Help & Support"
            description="FAQ, contact support"
            onPress={() => setShowHelpModal(true)}
            type='dropdown'
            last={true}
          />
        </View>
      </ScrollView>

      {/* Subscription Modal */}      
      <Modal
        visible={showSubscriptionModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ModalHeader 
            title="Subscription" 
            onClose={() => setShowSubscriptionModal(false)} 
          />
          <ScrollView style={styles.subscriptionContainer}>
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Premium Plan</Text>
                <Text style={styles.planPrice}>$9.99/month</Text>
              </View>
              <View style={styles.planFeatures}>
                <View style={styles.planFeatureItem}>
                  <MaterialIcons name="check-circle" size={24} color="#6c7ee1" />
                  <Text style={styles.planFeatureText}>Unlimited bandwidth</Text>
                </View>
                <View style={styles.planFeatureItem}>
                  <MaterialIcons name="check-circle" size={24} color="#6c7ee1" />
                  <Text style={styles.planFeatureText}>500+ servers worldwide</Text>
                </View>
                <View style={styles.planFeatureItem}>
                  <MaterialIcons name="check-circle" size={24} color="#6c7ee1" />
                  <Text style={styles.planFeatureText}>5 devices simultaneously</Text>
                </View>
                <View style={styles.planFeatureItem}>
                  <MaterialIcons name="check-circle" size={24} color="#6c7ee1" />
                  <Text style={styles.planFeatureText}>24/7 customer support</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Help & Support Modal */}      
      <Modal
        visible={showHelpModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ModalHeader 
            title="Help & Support" 
            onClose={() => setShowHelpModal(false)} 
          />
          <ScrollView style={styles.helpContainer}>
            <Text style={styles.helpSectionTitle}>Frequently Asked Questions</Text>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
            <View style={styles.contactSection}>
              <Text style={styles.helpSectionTitle}>Contact Support</Text>
              <TouchableOpacity style={styles.contactButton}>
                <MaterialIcons name="email" size={24} color="#fff" />
                <Text style={styles.contactButtonText}>Email Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <MaterialIcons name="chat" size={24} color="#fff" />
                <Text style={styles.contactButtonText}>Live Chat</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  },  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2d36',
  },
  dropdownContainer: {
    backgroundColor: '#232529',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1b1f',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3d46',
  },
  modalBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3d46',
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a3d46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,  },  
    dropdown: {
    backgroundColor: '#2a2d36',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3d46',
  },
  appName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3d46',
  },
  protocolName: {
    fontSize: 16,
    color: '#fff',
  },
  subscriptionContainer: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    backgroundColor: '#2a2d36',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  planHeader: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    color: '#6c7ee1',
    fontWeight: 'bold',
  },
  planFeatures: {
    marginBottom: 24,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planFeatureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  upgradeButton: {
    backgroundColor: '#6c7ee1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    flex: 1,
    padding: 16,
  },
  helpSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#2a2d36',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c7ee1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
})