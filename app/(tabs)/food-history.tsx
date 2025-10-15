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

export default function FoodHistoryScreen() {
  const router = useRouter();

  const foodEntries = [
    { id: 1, name: 'Grilled Chicken Salad', time: '12:30 PM', calories: 320 },
    { id: 2, name: 'Greek Yogurt', time: '10:15 AM', calories: 150 },
    { id: 3, name: 'Oatmeal with Berries', time: '8:00 AM', calories: 280 },
    { id: 4, name: 'Apple', time: '3:45 PM', calories: 80 },
    { id: 5, name: 'Grilled Salmon', time: '7:00 PM', calories: 450 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Food History</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Calories:</Text>
            <Text style={styles.summaryValue}>1,280</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Meals Logged:</Text>
            <Text style={styles.summaryValue}>5</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {foodEntries.map((entry) => (
            <View key={entry.id} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{entry.name}</Text>
                <Text style={styles.foodTime}>{entry.time}</Text>
              </View>
              <View style={styles.calorieInfo}>
                <Text style={styles.calorieValue}>{entry.calories}</Text>
                <Text style={styles.calorieLabel}>cal</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={Colors.light.secondary} />
          <Text style={styles.addButtonText}>Add Food Entry</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
  },
  foodCard: {
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
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  foodTime: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  calorieInfo: {
    alignItems: 'flex-end',
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  calorieLabel: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.light.secondary,
    fontWeight: '500',
    marginLeft: 8,
  },
});
