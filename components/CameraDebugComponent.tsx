import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraDebugComponentProps {
    onClose: () => void;
}

export default function CameraDebugComponent({ onClose }: CameraDebugComponentProps) {
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebugInfo = (info: string) => {
        console.log('DEBUG:', info);
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
    };

    const testFileSystem = async () => {
        try {
            addDebugInfo('Testing file system...');
            addDebugInfo(`Platform: ${Platform.OS}`);

            // Test document directory
            const docDir = FileSystem.documentDirectory;
            addDebugInfo(`Document directory: ${docDir}`);

            // Test cache directory
            const cacheDir = FileSystem.cacheDirectory;
            addDebugInfo(`Cache directory: ${cacheDir}`);

            // List files in document directory
            const docFiles = await FileSystem.readDirectoryAsync(docDir || '');
            addDebugInfo(`Document files: ${docFiles.length} files`);

            // List files in cache directory
            const cacheFiles = await FileSystem.readDirectoryAsync(cacheDir || '');
            addDebugInfo(`Cache files: ${cacheFiles.length} files`);

            // Test creating a test file in appropriate directory
            const testDir = Platform.OS === 'android' ? cacheDir : docDir;
            const testFile = `${testDir}test_${Date.now()}.txt`;
            await FileSystem.writeAsStringAsync(testFile, 'Test content');
            addDebugInfo(`Created test file: ${testFile}`);

            // Check if test file exists
            const testFileInfo = await FileSystem.getInfoAsync(testFile);
            addDebugInfo(`Test file exists: ${testFileInfo.exists}`);

            // Clean up test file
            await FileSystem.deleteAsync(testFile);
            addDebugInfo('Cleaned up test file');

        } catch (error) {
            addDebugInfo(`Error: ${error.message}`);
        }
    };

    const testImageProcessing = async () => {
        try {
            addDebugInfo('Testing image processing...');

            // Create a test image data URL
            const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';

            addDebugInfo(`Test image data length: ${testImageData.length}`);

            // Test if we can extract base64
            const base64Data = testImageData.split(',')[1];
            addDebugInfo(`Extracted base64 length: ${base64Data.length}`);

        } catch (error) {
            addDebugInfo(`Error: ${error.message}`);
        }
    };

    const testVisionAPI = async () => {
        try {
            addDebugInfo('Testing Vision API...');

            // Import the VisionService
            const { VisionService } = require('../services/visionService');
            const { API_KEYS } = require('../config/apiKeys');

            const visionService = new VisionService(API_KEYS.GOOGLE_VISION_API_KEY);

            // Test with a simple data URL
            const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';

            addDebugInfo('Calling Vision API...');
            const results = await visionService.detectFood(testImageData);
            addDebugInfo(`Vision API returned ${results.length} detections`);

            results.forEach((detection, index) => {
                addDebugInfo(`Detection ${index + 1}: ${detection.food} (${(detection.confidence * 100).toFixed(1)}%)`);
            });

        } catch (error) {
            addDebugInfo(`Vision API Error: ${error.message}`);
        }
    };

    const clearDebugInfo = () => {
        setDebugInfo([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Camera Debug</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={testFileSystem}>
                    <Text style={styles.buttonText}>Test File System</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={testImageProcessing}>
                    <Text style={styles.buttonText}>Test Image Processing</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={testVisionAPI}>
                    <Text style={styles.buttonText}>Test Vision API</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={clearDebugInfo}>
                    <Text style={styles.buttonText}>Clear Debug Info</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                {debugInfo.map((info, index) => (
                    <Text key={index} style={styles.debugText}>{info}</Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    closeButton: {
        padding: 8,
    },
    controls: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    debugContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
    },
    debugTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    debugText: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
});
