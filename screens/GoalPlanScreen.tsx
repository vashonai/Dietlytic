import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Slider,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function GoalPlanScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState({
    targetWeight: '70',
    targetDate: '2024-06-01',
    bloodPressureTarget: '115/75',
    activityLevel: 2, // 1 = Low, 2 = Moderate, 3 = High
  });

  const handleInputChange = (field: string, value: string) => {
    setGoals(prev => ({ ...prev, [field]: value }));
  };

  const handleActivityLevelChange = (value: number) => {
    setGoals(prev => ({ ...prev, activityLevel: value }));
  };

  const handleBMICalculator = () => {
    // TODO: Navigate to BMI calculator
    console.log('BMI Calculator pressed');
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Save goals', goals);
  };

  const getActivityLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Low';
      case 2: return 'Moderate';
      case 3: return 'High';
      default: return 'Moderate';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Goal Plans</Text>

          {/* Weight Goal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight Goal</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Target Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={goals.targetWeight}
                  onChangeText={(value) => handleInputChange('targetWeight', value)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Target Date</Text>
                <TextInput
                  style={styles.input}
                  value={goals.targetDate}
                  onChangeText={(value) => handleInputChange('targetDate', value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
          </View>

          {/* Blood Pressure Goal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blood Pressure Target</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Blood Pressure</Text>
              <TextInput
                style={styles.input}
                value={goals.bloodPressureTarget}
                onChangeText={(value) => handleInputChange('bloodPressureTarget', value)}
                placeholder="115/75"
              />
            </View>
          </View>

          {/* BMI Objectives Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BMI Objectives</Text>
            
            <TouchableOpacity
              style={styles.bmiButton}
              onPress={handleBMICalculator}
            >
              <Text style={styles.bmiButtonText}>Calculate BMI</Text>
              <Text style={styles.bmiButtonArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Level</Text>
            
            <View style={styles.activityLevelContainer}>
              <Text style={styles.activityLevelText}>
                {getActivityLevelText(goals.activityLevel)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={3}
                step={1}
                value={goals.activityLevel}
                onValueChange={handleActivityLevelChange}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#E0E0E0"
                thumbStyle={styles.sliderThumb}
              />
              <View style={styles.activityLabels}>
                <Text style={styles.activityLabel}>Low</Text>
                <Text style={styles.activityLabel}>Moderate</Text>
                <Text style={styles.activityLabel}>High</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Goals</Text>
          </TouchableOpacity>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  bmiButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  bmiButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  bmiButtonArrow: {
    fontSize: 20,
    color: '#cccccc',
  },
  activityLevelContainer: {
    marginTop: 8,
  },
  activityLevelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  activityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  activityLabel: {
    fontSize: 12,
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
