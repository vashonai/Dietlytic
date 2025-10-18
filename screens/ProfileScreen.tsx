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

import { useAuth } from '../contexts/AuthContext';
import { imageUploadService } from '../services/imageUploadService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleMenuPress = (screen: string) => {
    switch (screen) {
      case 'health':
        router.push('/screens/MyHealthScreen');
        break;
      case 'goals':
        router.push('/screens/GoalPlanScreen');
        break;
      case 'history':
        router.push('/(tabs)/food-history');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings coming soon!');
        break;
      case 'settings':
        Alert.alert('Settings', 'App settings coming soon!');
        break;
      case 'logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                await logout();
                router.replace('/(auth)/LoginScreen');
              }
            }
          ]
        );
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

  const menuItems = [
    { id: 'health', title: 'My Health', icon: 'heart-outline' },
    { id: 'goals', title: 'Goal Plans', icon: 'flag-outline' },
    { id: 'history', title: 'My Food History', icon: 'restaurant-outline' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications-outline' },
    { id: 'settings', title: 'App Settings', icon: 'settings-outline' },
    { id: 'logout', title: 'Log Out', icon: 'log-out-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleProfileImageUpload}>
              <Image
                source={{
                  uri: profileImage || 'https://via.placeholder.com/120'
                }}
                style={styles.avatar}
              />
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem
                ]}
                onPress={() => handleMenuPress(item.id)}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.id === 'logout' ? '#FF3B30' : '#4ECDC4'}
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.id === 'logout' && styles.logoutText
                  ]}>
                    {item.title}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#CCCCCC"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
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
    borderRadius: 16,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginLeft: 16,
  },
  logoutText: {
    color: '#FF3B30',
  },
});
