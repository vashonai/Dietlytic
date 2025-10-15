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

export default function HealthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Health</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
              <Text style={styles.metricValue}>72 BPM</Text>
              <Text style={styles.metricLabel}>Heart Rate</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="thermometer" size={24} color="#4ECDC4" />
              <Text style={styles.metricValue}>98.6°F</Text>
              <Text style={styles.metricLabel}>Temperature</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="water" size={24} color="#45B7D1" />
              <Text style={styles.metricValue}>8 glasses</Text>
              <Text style={styles.metricLabel}>Water Today</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="walk" size={24} color="#96CEB4" />
              <Text style={styles.metricValue}>8,500</Text>
              <Text style={styles.metricLabel}>Steps Today</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Conditions</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>No known conditions</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="add" size={20} color={Colors.light.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>No current medications</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="add" size={20} color={Colors.light.secondary} />
            </TouchableOpacity>
          </View>
        </View>
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cardText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  editButton: {
    padding: 5,
  },
});
