import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FoodHistoryScreen() {
  const router = useRouter();

  // Mock data for demonstration
  const foodEntries = [
    {
      id: 1,
      name: 'Grilled Chicken Breast',
      calories: 165,
      time: '12:30 PM',
      date: 'Today',
    },
    {
      id: 2,
      name: 'Mixed Green Salad',
      calories: 45,
      time: '1:15 PM',
      date: 'Today',
    },
    {
      id: 3,
      name: 'Greek Yogurt',
      calories: 100,
      time: '3:00 PM',
      date: 'Today',
    },
  ];

  const renderFoodEntry = (entry: any) => (
    <View key={entry.id} style={styles.foodCard}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{entry.name}</Text>
        <Text style={styles.foodTime}>{entry.time} • {entry.date}</Text>
      </View>
      <View style={styles.calorieInfo}>
        <Text style={styles.calorieText}>{entry.calories} cal</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>My Food History</Text>

          {foodEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🍽️</Text>
              <Text style={styles.emptyStateTitle}>No food has been logged yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Start tracking your meals to see your food history here
              </Text>
              <TouchableOpacity
                style={styles.addFoodButton}
                onPress={() => {
                  // Navigate to dashboard to use camera
                  router.push('/(tabs)');
                }}
              >
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.addFoodButtonText}>Scan Your First Meal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.foodList}>
              {foodEntries.map(renderFoodEntry)}
              
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => {
                  // Navigate to dashboard to use camera
                  router.push('/(tabs)');
                }}
              >
                <Ionicons name="camera" size={20} color="#007AFF" />
                <Text style={styles.addMoreButtonText}>Scan More Food</Text>
              </TouchableOpacity>
            </View>
          )}
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
          style={[styles.tabItem, styles.activeTab]}
          onPress={() => router.push('/(tabs)/food-history')}
        >
          <Text style={styles.tabIcon}>📝</Text>
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Profile</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addFoodButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  addFoodButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  foodList: {
    marginBottom: 20,
  },
  foodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  foodTime: {
    fontSize: 14,
    color: '#666666',
  },
  calorieInfo: {
    alignItems: 'flex-end',
  },
  calorieText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  addMoreButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addMoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
