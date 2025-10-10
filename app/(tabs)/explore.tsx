import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { firebaseService, NutritionEntry } from '@/services/firebaseService';

export default function HistoryScreen() {
  const [nutritionHistory, setNutritionHistory] = useState<NutritionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNutritionHistory();
  }, []);

  const loadNutritionHistory = async () => {
    try {
      const history = await firebaseService.getNutritionHistory();
      setNutritionHistory(history);
    } catch (error) {
      console.error('Error loading nutrition history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNutritionHistory();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCalories = (calories: number) => {
    return `${Math.round(calories)} kcal`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Nutrition History</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading your nutrition history...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Nutrition History</ThemedText>
        <ThemedText style={styles.subtitle}>Your saved nutrition entries</ThemedText>
      </View>

      {nutritionHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant" size={80} color="#ccc" />
          <ThemedText style={styles.emptyTitle}>No History Yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Start by taking photos of your meals to build your nutrition history
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {nutritionHistory.map((entry, index) => (
            <TouchableOpacity key={entry.id || index} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <ThemedText style={styles.foodName}>{entry.foodName}</ThemedText>
                <ThemedText style={styles.entryDate}>
                  {formatDate(entry.timestamp)}
                </ThemedText>
              </View>
              
              <View style={styles.nutritionSummary}>
                <View style={styles.nutritionItem}>
                  <Ionicons name="flame" size={16} color="#FF6B6B" />
                  <ThemedText style={styles.nutritionValue}>
                    {formatCalories(entry.nutritionData.nf_calories)}
                  </ThemedText>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Ionicons name="fitness" size={16} color="#4ECDC4" />
                  <ThemedText style={styles.nutritionValue}>
                    {entry.nutritionData.nf_protein.toFixed(1)}g protein
                  </ThemedText>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Ionicons name="leaf" size={16} color="#45B7D1" />
                  <ThemedText style={styles.nutritionValue}>
                    {entry.nutritionData.nf_total_carbohydrate.toFixed(1)}g carbs
                  </ThemedText>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Ionicons name="water" size={16} color="#96CEB4" />
                  <ThemedText style={styles.nutritionValue}>
                    {entry.nutritionData.nf_total_fat.toFixed(1)}g fat
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
  },
  nutritionSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nutritionValue: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    color: '#333',
  },
});