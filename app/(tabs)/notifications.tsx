import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    waterReminders: true,
    goalUpdates: false,
    weeklyReports: true,
    appUpdates: false,
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="restaurant" size={24} color="#FF6B6B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Meal Reminders</Text>
                <Text style={styles.settingDescription}>Get reminded to log your meals</Text>
              </View>
            </View>
            <Switch
              value={notifications.mealReminders}
              onValueChange={() => toggleNotification('mealReminders')}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={notifications.mealReminders ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="water" size={24} color="#45B7D1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Water Reminders</Text>
                <Text style={styles.settingDescription}>Stay hydrated throughout the day</Text>
              </View>
            </View>
            <Switch
              value={notifications.waterReminders}
              onValueChange={() => toggleNotification('waterReminders')}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={notifications.waterReminders ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trophy" size={24} color="#FFD93D" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Goal Updates</Text>
                <Text style={styles.settingDescription}>Celebrate your achievements</Text>
              </View>
            </View>
            <Switch
              value={notifications.goalUpdates}
              onValueChange={() => toggleNotification('goalUpdates')}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={notifications.goalUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="bar-chart" size={24} color="#96CEB4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Weekly Reports</Text>
                <Text style={styles.settingDescription}>Get your weekly progress summary</Text>
              </View>
            </View>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={() => toggleNotification('weeklyReports')}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={notifications.weeklyReports ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#A8E6CF" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>App Updates</Text>
                <Text style={styles.settingDescription}>News about new features and updates</Text>
              </View>
            </View>
            <Switch
              value={notifications.appUpdates}
              onValueChange={() => toggleNotification('appUpdates')}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={notifications.appUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Frequency</Text>
          <View style={styles.frequencyCard}>
            <Text style={styles.frequencyText}>Meal Reminders: Every 3 hours</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={Colors.light.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.frequencyCard}>
            <Text style={styles.frequencyText}>Water Reminders: Every 2 hours</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={Colors.light.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  frequencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  frequencyText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  editButton: {
    padding: 5,
  },
});
