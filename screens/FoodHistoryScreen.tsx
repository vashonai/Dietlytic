import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Meal, supabaseService } from '../services/supabaseService';

export default function FoodHistoryScreen() {
  const router = useRouter();
  const [foodEntries, setFoodEntries] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFoodHistory = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get meals from Supabase
      const { data: meals, error } = await supabaseService.supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading food history:', error);
        setFoodEntries([]);
        return;
      }

      setFoodEntries(meals || []);
    } catch (error) {
      console.error('Error loading food history:', error);
      setFoodEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFoodHistory();
    setRefreshing(false);
  }, [loadFoodHistory]);

  useEffect(() => {
    loadFoodHistory();
  }, [loadFoodHistory]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFoodEntry = (entry: Meal) => (
    <View key={entry.id} style={styles.foodCard}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>
          {entry.detected_items && entry.detected_items.length > 0 
            ? entry.detected_items.join(', ') 
            : 'Scanned Food'}
        </Text>
        <Text style={styles.foodTime}>
          {formatTime(entry.created_at)} • {formatDateTime(entry.created_at)}
        </Text>
        {entry.image_type === 'camera' && (
          <Text style={styles.scanIndicator}>📷 Camera Scan</Text>
        )}
      </View>
      <View style={styles.nutritionInfo}>
        <Text style={styles.calorieText}>{Math.round(entry.total_calories)} cal</Text>
        <Text style={styles.macroText}>
          P: {Math.round(entry.total_protein)}g • C: {Math.round(entry.total_carbs)}g • F: {Math.round(entry.total_fat)}g
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>My Food History</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading your food history...</Text>
            </View>
          ) : foodEntries.length === 0 ? (
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
  nutritionInfo: {
    alignItems: 'flex-end',
  },
  macroText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  scanIndicator: {
    fontSize: 12,
    color: '#4ECDC4',
    marginTop: 2,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
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
});
