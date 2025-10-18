import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MacroProgressBarProps {
    label: string;
    current: number;
    target: number;
    unit: string;
    color: string;
    icon: string;
}

export default function MacroProgressBar({
    label,
    current,
    target,
    unit,
    color,
    icon,
}: MacroProgressBarProps) {
    const remaining = Math.max(0, target - current);
    const progress = Math.min(1, current / target);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.remaining}>{remaining}g left</Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: '#E5E5E5' }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress * 100}%`,
                                backgroundColor: color,
                            },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {current}g / {target}g
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    remaining: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
        minWidth: 60,
        textAlign: 'right',
    },
});
