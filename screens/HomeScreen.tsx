import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    const quickActions = [
        {
            icon: 'camera' as const,
            title: 'Scan Food',
            subtitle: 'Take a photo to analyze nutrition',
            color: '#4ECDC4',
            onPress: () => {
                // Navigate to camera or food scanning
                console.log('Navigate to camera');
            },
        },
        {
            icon: 'restaurant' as const,
            title: 'Add Meal',
            subtitle: 'Manually add food items',
            color: '#FF6B6B',
            onPress: () => {
                console.log('Navigate to add meal');
            },
        },
        {
            icon: 'trending-up' as const,
            title: 'View Progress',
            subtitle: 'Check your health metrics',
            color: '#96CEB4',
            onPress: () => {
                router.push('/(tabs)/dashboard');
            },
        },
    ];

    const recentActivity = [
        { id: 1, text: 'Scanned apple for lunch', time: '2 hours ago', icon: '🍎' },
        { id: 2, text: 'Logged 30min workout', time: '5 hours ago', icon: '🏃' },
        { id: 3, text: 'Completed daily water goal', time: '1 day ago', icon: '💧' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Good morning!</Text>
                            <Text style={styles.title}>Welcome to Dietlytic</Text>
                        </View>
                        <TouchableOpacity style={styles.profileButton}>
                            <Ionicons name="person-circle" size={32} color="#4ECDC4" />
                        </TouchableOpacity>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>1,247</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                            <Text style={styles.statSubtext}>Today</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Glasses</Text>
                            <Text style={styles.statSubtext}>Water</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>4,532</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                            <Text style={styles.statSubtext}>Today</Text>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionsGrid}>
                            {quickActions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.actionCard, { borderLeftColor: action.color }]}
                                    onPress={action.onPress}
                                >
                                    <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                                        <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.actionContent}>
                                        <Text style={styles.actionTitle}>{action.title}</Text>
                                        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <View style={styles.activityContainer}>
                            {recentActivity.map((activity) => (
                                <View key={activity.id} style={styles.activityItem}>
                                    <Text style={styles.activityIcon}>{activity.icon}</Text>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>{activity.text}</Text>
                                        <Text style={styles.activityTime}>{activity.time}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Motivational Quote */}
                    <View style={styles.quoteContainer}>
                        <Text style={styles.quoteText}>
                            "Every small step towards better health is a victory worth celebrating."
                        </Text>
                        <Text style={styles.quoteAuthor}>- Dietlytic Team</Text>
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
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    profileButton: {
        padding: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '600',
        marginBottom: 2,
    },
    statSubtext: {
        fontSize: 12,
        color: '#999999',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    actionsGrid: {
        gap: 12,
    },
    actionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666666',
    },
    activityContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    activityIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#1a1a1a',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        color: '#999999',
    },
    quoteContainer: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 8,
        lineHeight: 24,
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '600',
    },
});
