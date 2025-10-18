import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GoalPlanScreen() {
  const router = useRouter();

  // State for goal data
  const [targetWeight, setTargetWeight] = useState('200');
  const [targetDate, setTargetDate] = useState('Feb 5, 2026');
  const [bloodPressureTarget, setBloodPressureTarget] = useState('130/80');
  const [activityLevel, setActivityLevel] = useState(1); // 0 = low, 1 = moderate, 2 = high
  const [fastingTime, setFastingTime] = useState('');
  const [fastingDate, setFastingDate] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleBMIPress = () => {
    Alert.alert('BMI Objectives', 'BMI objectives feature coming soon!');
  };

  const getActivityLevelText = (level: number) => {
    switch (level) {
      case 0: return 'low';
      case 1: return 'moderate';
      case 2: return 'high';
      default: return 'moderate';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goal Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Weight Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="scale" size={24} color="#4ECDC4" />
              <Text style={styles.cardTitle}>Weight</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Target Weight</Text>
                <Text style={styles.rowValue}>{targetWeight}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Target Date</Text>
                <Text style={styles.rowValue}>{targetDate}</Text>
              </View>
            </View>
          </View>

          {/* Blood Pressure Card */}
          <View style={styles.card}>
            <Text style={styles.bpText}>Blood Pressure Target {bloodPressureTarget}</Text>
          </View>

          {/* BMI Objectives Card */}
          <TouchableOpacity style={styles.card} onPress={handleBMIPress}>
            <Text style={styles.bmiButtonText}>BMI Objectives</Text>
          </TouchableOpacity>

          {/* Activity Level Section */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Activity Level</Text>
            <View style={styles.activityCard}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={2}
                step={1}
                value={activityLevel}
                onValueChange={setActivityLevel}
                minimumTrackTintColor="#4ECDC4"
                maximumTrackTintColor="#E5E5E5"
                thumbStyle={styles.sliderThumb}
              />
              <View style={styles.activityLabels}>
                <Text style={styles.activityLabelText}>low</Text>
                <Text style={styles.activityLabelText}>moderate</Text>
                <Text style={styles.activityLabelText}>high</Text>
              </View>
            </View>
          </View>

          {/* Intermittent Fasting Section */}
          <View style={styles.fastingSection}>
            <Text style={styles.sectionTitle}>Intermittent Fasting</Text>
            <View style={styles.fastingCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Set Time</Text>
                <TextInput
                  style={styles.input}
                  value={fastingTime}
                  onChangeText={setFastingTime}
                  placeholder="Enter fasting time"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Set Date</Text>
                <TextInput
                  style={styles.input}
                  value={fastingDate}
                  onChangeText={setFastingDate}
                  placeholder="Enter fasting date"
                />
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  cardContent: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  bpText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    textAlign: 'center',
  },
  bmiButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  sliderThumb: {
    backgroundColor: '#4ECDC4',
    width: 20,
    height: 20,
  },
  activityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityLabelText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  fastingSection: {
    marginBottom: 20,
  },
  fastingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
});