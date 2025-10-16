import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { aiCoachService, UserGoals } from '../services/aiCoachService';
import { imageUploadService } from '../services/imageUploadService';

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals>({
    weightGoal: 'maintain',
    activityLevel: 'moderate',
    dietaryRestrictions: [],
    healthConditions: [],
  });

  const handleMenuPress = (screen: string) => {
    switch (screen) {
      case 'health':
        router.push('/screens/MyHealthScreen');
        break;
      case 'history':
        router.push('/(tabs)/food-history');
        break;
      case 'logout':
        // TODO: Implement logout
        break;
    }
  };

  const handleProfileImageUpload = async () => {
    try {
      const imageResult = await imageUploadService.pickProfilePicture();
      if (imageResult) {
        setProfileImage(imageResult.uri);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };

  const updateUserGoals = (newGoals: Partial<UserGoals>) => {
    const updatedGoals = { ...userGoals, ...newGoals };
    setUserGoals(updatedGoals);
    aiCoachService.setUserGoals(updatedGoals);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleProfileImageUpload}>
              <Image
                source={{ 
                  uri: profileImage || 'https://via.placeholder.com/80' 
                }}
                style={styles.avatar}
              />
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleProfileImageUpload}>
              <Ionicons name="camera" size={16} color="#007AFF" />
              <Text style={styles.editProfileText}>Change Profile Picture</Text>
            </TouchableOpacity>
          </View>

          {/* Goals Section */}
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>My Goals</Text>
            <View style={styles.goalsContainer}>
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Weight Goal:</Text>
                <View style={styles.goalButtons}>
                  {['lose', 'maintain', 'gain'].map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.goalButton,
                        userGoals.weightGoal === goal && styles.goalButtonActive
                      ]}
                      onPress={() => updateUserGoals({ weightGoal: goal as 'lose' | 'maintain' | 'gain' })}
                    >
                      <Text style={[
                        styles.goalButtonText,
                        userGoals.weightGoal === goal && styles.goalButtonTextActive
                      ]}>
                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Activity Level:</Text>
                <View style={styles.goalButtons}>
                  {['sedentary', 'light', 'moderate', 'active', 'very_active'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.goalButton,
                        userGoals.activityLevel === level && styles.goalButtonActive
                      ]}
                      onPress={() => updateUserGoals({ activityLevel: level as any })}
                    >
                      <Text style={[
                        styles.goalButtonText,
                        userGoals.activityLevel === level && styles.goalButtonTextActive
                      ]}>
                        {level.replace('_', ' ').charAt(0).toUpperCase() + level.replace('_', ' ').slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('health')}
            >
              <Text style={styles.menuItemText}>My Health</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('history')}
            >
              <Text style={styles.menuItemText}>My Food History</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleMenuPress('logout')}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={styles.tabLabel}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/food-history')}
        >
          <Text style={styles.tabIcon}>📝</Text>
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    alignSelf: 'center',
  },
  editProfileText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  goalsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  goalsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  goalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  goalButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  goalButtonTextActive: {
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#cccccc',
  },
  submenuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  submenuItemText: {
    fontSize: 14,
    color: '#666666',
  },
  submenuItemArrow: {
    fontSize: 16,
    color: '#cccccc',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#f0f8ff',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666666',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
