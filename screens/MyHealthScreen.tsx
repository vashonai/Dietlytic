// My Health Screen
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';

export default function MyHealthScreen() {
  const router = useRouter();
  
  // State for user info
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    age: '28',
    gender: 'Male',
  });

  // State for health stats
  const [healthStats, setHealthStats] = useState({
    weight: '--',
    bloodPressure: '--',
    bpm: '--',
  });

  // State for sliders
  const [height, setHeight] = useState(170);
  const [bodyMeasurement, setBodyMeasurement] = useState(75);

  // State for dropdowns
  const [healthConditions, setHealthConditions] = useState('');
  const [medications, setMedications] = useState('');

  // Health conditions options
  const healthConditionsOptions = [
    { label: 'Select condition...', value: '' },
    { label: 'Diabetes', value: 'diabetes' },
    { label: 'Hypertension', value: 'hypertension' },
    { label: 'Heart Disease', value: 'heart_disease' },
    { label: 'High Cholesterol', value: 'high_cholesterol' },
    { label: 'Asthma', value: 'asthma' },
    { label: 'Arthritis', value: 'arthritis' },
    { label: 'None', value: 'none' },
  ];

  // Medications options
  const medicationsOptions = [
    { label: 'Select medication...', value: '' },
    { label: 'Metformin', value: 'metformin' },
    { label: 'Lisinopril', value: 'lisinopril' },
    { label: 'Atorvastatin', value: 'atorvastatin' },
    { label: 'Aspirin', value: 'aspirin' },
    { label: 'Insulin', value: 'insulin' },
    { label: 'None', value: 'none' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Health</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* User Info Card */}
          <View style={styles.userInfoCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <View style={styles.userStats}>
                <Text style={styles.userStatText}>Age: {userInfo.age}</Text>
                <Text style={styles.userStatText}>Gender: {userInfo.gender}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{healthStats.weight}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Blood Pressure</Text>
              <Text style={styles.statValue}>{healthStats.bloodPressure}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>BPM</Text>
              <Text style={styles.statValue}>{healthStats.bpm}</Text>
            </View>
          </View>

          {/* Sliders Section */}
          <View style={styles.slidersSection}>
            <Text style={styles.sectionTitle}>Body Measurements</Text>
            
            {/* Height Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Height: {height} cm</Text>
              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={220}
                value={height}
                onValueChange={setHeight}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#E5E5EA"
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
              />
            </View>

            {/* Body Measurement Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Body Measurement: {bodyMeasurement} cm</Text>
              <Slider
                style={styles.slider}
                minimumValue={50}
                maximumValue={150}
                value={bodyMeasurement}
                onValueChange={setBodyMeasurement}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#E5E5EA"
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
              />
            </View>
          </View>

          {/* Dropdown Section */}
          <View style={styles.dropdownSection}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            {/* Health Conditions Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Health Conditions</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={healthConditions}
                  onValueChange={setHealthConditions}
                  style={styles.picker}
                >
                  {healthConditionsOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Medications Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Medications</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={medications}
                  onValueChange={setMedications}
                  style={styles.picker}
                >
                  {medicationsOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  
  // User Info Card
  userInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userDetails: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    gap: 16,
  },
  userStatText: {
    fontSize: 16,
    color: '#666666',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  // Sliders Section
  slidersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },

  // Dropdown Section
  dropdownSection: {
    marginBottom: 24,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});