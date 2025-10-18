import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuggestionCardProps {
    icon: string;
    title: string;
    onPress?: () => void;
}

export default function SuggestionCard({ icon, title, onPress }: SuggestionCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.content}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
        flex: 1,
    },
});
