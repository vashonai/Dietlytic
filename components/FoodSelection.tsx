import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { FoodDetection } from '../services/visionService';

interface FoodSelectionProps {
  detectedFoods: FoodDetection[];
  onFoodSelect: (food: FoodDetection) => void;
  onClose: () => void;
}

export default function FoodSelection({ detectedFoods, onFoodSelect, onClose }: FoodSelectionProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Select Food Item
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.subtitle}>
          We detected multiple food items. Please select the one you'd like to analyze:
        </ThemedText>

        <View style={styles.foodList}>
          {detectedFoods.map((food, index) => (
            <TouchableOpacity
              key={index}
              style={styles.foodItem}
              onPress={() => onFoodSelect(food)}
            >
              <View style={styles.foodInfo}>
                <ThemedText style={styles.foodName}>
                  {food.food}
                </ThemedText>
                <ThemedText style={styles.confidence}>
                  {Math.round(food.confidence * 100)}% confidence
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>

        <ThemedView style={styles.note}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <ThemedText style={styles.noteText}>
            If you don't see your food item, try taking another photo with better lighting or a clearer view.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  foodList: {
    gap: 12,
    marginBottom: 20,
  },
  foodItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});
