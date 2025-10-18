import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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

import CircularProgress from '../components/CircularProgress';
import { useAuth } from '../contexts/AuthContext';

export default function MyHealthScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // State for health data
  const [weight, setWeight] = useState('70');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [bpm, setBpm] = useState('72');
  const [height, setHeight] = useState('175');
  const [bodyMeasurement, setBodyMeasurement] = useState('');
  const [healthConditions, setHealthConditions] = useState('None');
  const [medications, setMedications] = useState('None');

  const handleBack = () => {
    router.back();
  };

  const handleStatPress = (statType: string) => {
    Alert.alert(`${statType}`, `View detailed ${statType.toLowerCase()} history`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Health</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Name:</Text>
                <Text style={styles.profileValue}>{user?.name || 'User'}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Age:</Text>
                <Text style={styles.profileValue}>{user?.age || '25'} years</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Gender:</Text>
                <Text style={styles.profileValue}>Male</Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Health Stats</Text>
            <View style={styles.statsContainer}>
              {/* Weight */}
              <TouchableOpacity
                style={styles.statButton}
                onPress={() => handleStatPress('Weight')}
              >
                <CircularProgress
                  size={80}
                  strokeWidth={6}
                  progress={0.7}
                  color="#4ECDC4"
                  backgroundColor="#E5E5E5"
                >
                  <Text style={styles.statValue}>{weight}</Text>
                  <Text style={styles.statUnit}>kg</Text>
                </CircularProgress>
                <Text style={styles.statLabel}>Weight</Text>
              </TouchableOpacity>

              {/* Blood Pressure */}
              <TouchableOpacity
                style={styles.statButton}
                onPress={() => handleStatPress('Blood Pressure')}
              >
                <CircularProgress
                  size={80}
                  strokeWidth={6}
                  progress={0.6}
                  color="#FF6B6B"
                  backgroundColor="#E5E5E5"
                >
                  <Text style={styles.statValue}>{bloodPressure}</Text>
                  <Text style={styles.statUnit}>mmHg</Text>
                </CircularProgress>
                <Text style={styles.statLabel}>Blood Pressure</Text>
              </TouchableOpacity>

              {/* BPM */}
              <TouchableOpacity
                style={styles.statButton}
                onPress={() => handleStatPress('BPM')}
              >
                <CircularProgress
                  size={80}
                  strokeWidth={6}
                  progress={0.8}
                  color="#45B7D1"
                  backgroundColor="#E5E5E5"
                >
                  <Text style={styles.statValue}>{bpm}</Text>
                  <Text style={styles.statUnit}>BPM</Text>
                </CircularProgress>
                <Text style={styles.statLabel}>BPM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Measurements Section */}
          <View style={styles.measurementsSection}>
            <Text style={styles.sectionTitle}>Body Measurements</Text>
            <View style={styles.measurementsCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Enter height"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Body Measurement</Text>
                <TextInput
                  style={styles.input}
                  value={bodyMeasurement}
                  onChangeText={setBodyMeasurement}
                  placeholder="Enter measurements"
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Health Info Section */}
          <View style={styles.healthInfoSection}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            <View style={styles.healthInfoCard}>
              <View style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>Health Conditions</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={healthConditions}
                    onValueChange={setHealthConditions}
                    style={styles.picker}
                  >
                    <Picker.Item label="None" value="None" />
                    <Picker.Item label="Diabetes" value="Diabetes" />
                    <Picker.Item label="Hypertension" value="Hypertension" />
                    <Picker.Item label="Heart Disease" value="Heart Disease" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>Medications</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={medications}
                    onValueChange={setMedications}
                    style={styles.picker}
                  >
                    <Picker.Item label="None" value="None" />
                    <Picker.Item label="Blood Pressure Meds" value="Blood Pressure Meds" />
                    <Picker.Item label="Diabetes Meds" value="Diabetes Meds" />
                    <Picker.Item label="Supplements" value="Supplements" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
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
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statButton: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  measurementsSection: {
    marginBottom: 24,
  },
  measurementsCard: {
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
  healthInfoSection: {
    marginBottom: 20,
  },
  healthInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerGroup: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
  },
});