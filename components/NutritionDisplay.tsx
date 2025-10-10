import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { NutritionData } from '../services/nutritionService';

interface NutritionDisplayProps {
  nutritionData: NutritionData;
  onClose: () => void;
  onSave?: () => void;
}

export default function NutritionDisplay({ nutritionData, onClose, onSave }: NutritionDisplayProps) {
  const formatValue = (value: number, unit: string = 'g') => {
    return `${value.toFixed(1)}${unit}`;
  };

  const NutritionRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.nutritionRow}>
      <View style={styles.nutritionLabel}>
        <Ionicons name={icon as any} size={20} color="#007AFF" />
        <ThemedText style={styles.nutritionLabelText}>{label}</ThemedText>
      </View>
      <ThemedText style={styles.nutritionValue}>{value}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.foodName}>
          {nutritionData.food_name}
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.servingInfo}>
          <ThemedText style={styles.servingText}>
            Per {nutritionData.serving_weight_grams}g serving
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.nutritionSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Nutritional Information
          </ThemedText>
          
          <View style={styles.nutritionGrid}>
            <NutritionRow
              label="Calories"
              value={formatValue(nutritionData.nf_calories, ' kcal')}
              icon="flame"
            />
            <NutritionRow
              label="Protein"
              value={formatValue(nutritionData.nf_protein)}
              icon="fitness"
            />
            <NutritionRow
              label="Total Fat"
              value={formatValue(nutritionData.nf_total_fat)}
              icon="water"
            />
            <NutritionRow
              label="Saturated Fat"
              value={formatValue(nutritionData.nf_saturated_fat)}
              icon="water"
            />
            <NutritionRow
              label="Carbs"
              value={formatValue(nutritionData.nf_total_carbohydrate)}
              icon="leaf"
            />
            <NutritionRow
              label="Fiber"
              value={formatValue(nutritionData.nf_dietary_fiber)}
              icon="leaf"
            />
            <NutritionRow
              label="Sugars"
              value={formatValue(nutritionData.nf_sugars)}
              icon="candy"
            />
            <NutritionRow
              label="Sodium"
              value={formatValue(nutritionData.nf_sodium, ' mg')}
              icon="salt"
            />
            <NutritionRow
              label="Cholesterol"
              value={formatValue(nutritionData.nf_cholesterol, ' mg')}
              icon="heart"
            />
            <NutritionRow
              label="Potassium"
              value={formatValue(nutritionData.nf_potassium, ' mg')}
              icon="leaf"
            />
          </View>
        </ThemedView>

        {nutritionData.nf_vitamin_c > 0 && (
          <ThemedView style={styles.vitaminsSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Vitamins & Minerals
            </ThemedText>
            
            <View style={styles.nutritionGrid}>
              <NutritionRow
                label="Vitamin C"
                value={formatValue(nutritionData.nf_vitamin_c, ' mg')}
                icon="sunny"
              />
              <NutritionRow
                label="Calcium"
                value={formatValue(nutritionData.nf_calcium, ' mg')}
                icon="medical"
              />
              <NutritionRow
                label="Iron"
                value={formatValue(nutritionData.nf_iron, ' mg')}
                icon="medical"
              />
            </View>
          </ThemedView>
        )}
      </ScrollView>

      {onSave && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Ionicons name="save" size={20} color="white" />
            <ThemedText style={styles.saveButtonText}>Save to History</ThemedText>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  foodName: {
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
  servingInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  servingText: {
    fontSize: 16,
    color: '#666',
  },
  nutritionSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  vitaminsSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  nutritionGrid: {
    gap: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nutritionLabelText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
