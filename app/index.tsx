import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

export default function Index() {
    const { isLoggedIn, user, isLoading } = useAuth();

    useEffect(() => {
        console.log('Index screen - Platform:', Platform.OS);
        console.log('Index screen - Auth state:', { isLoggedIn, user: user?.email, isLoading });
    }, [isLoggedIn, user, isLoading]);

    // Show loading while checking auth state
    if (isLoading) {
        console.log('Index screen - Showing loading state');
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4ECDC4" />
            </View>
        );
    }

    // Redirect based on authentication state
    if (isLoggedIn && user) {
        console.log('Index screen - Redirecting to tabs (user logged in)');
        return <Redirect href="/(tabs)" />;
    } else {
        console.log('Index screen - Redirecting to WelcomeScreen (user not logged in)');
        return <Redirect href="/(auth)/WelcomeScreen" />;
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
    },
});
