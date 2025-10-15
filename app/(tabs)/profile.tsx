import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    router.push(`/(tabs)/${screen}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Icon */}
        <View style={styles.userIconContainer}>
          <Ionicons name="person-circle-outline" size={120} color={Colors.light.primary} />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('goals')}
          >
            <Text style={styles.buttonText}>My Weight and Goals Plan</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('health')}
          >
            <Text style={styles.buttonText}>My Health</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('food-history')}
          >
            <Text style={styles.buttonText}>My Food History</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('notifications')}
          >
            <Text style={styles.buttonText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('settings')}
          >
            <Text style={styles.buttonText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.coachButton]}
            onPress={() => handleNavigation('chat')}
          >
            <View style={styles.coachButtonContent}>
              <Ionicons name="chatbubble" size={20} color={Colors.light.secondary} />
              <Text style={[styles.buttonText, styles.coachButtonText]}>Fitness Coach Chat</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="bar-chart-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.light.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  userIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.icon,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderTopWidth: 2,
    borderTopColor: Colors.light.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  bottomNavItem: {
    alignItems: 'center',
    padding: 10,
  },
  coachButton: {
    borderColor: Colors.light.secondary,
    backgroundColor: Colors.light.cardBackground,
  },
  coachButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coachButtonText: {
    color: Colors.light.secondary,
  },
});
