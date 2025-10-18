import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CameraComponentProps {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export default function CameraComponent({ onPhotoTaken, onClose }: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
          <ThemedText style={styles.buttonText}>Close</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true, // Get base64 directly for Android compatibility
        });

        if (photo?.uri) {
          console.log('Photo taken, URI:', photo.uri);

          if (photo.base64) {
            // Use base64 data URL for Android compatibility
            const dataUrl = `data:image/jpeg;base64,${photo.base64}`;
            console.log('Using base64 data URL for Android compatibility');
            onPhotoTaken(dataUrl);
          } else {
            // Fallback to URI
            console.log('No base64 data, using URI fallback');
            onPhotoTaken(photo.uri);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        console.error('Error taking picture:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  }

  // Helper function to copy image to permanent location
  async function copyImageToPermanentLocation(tempUri: string): Promise<string> {
    try {
      const FileSystem = require('expo-file-system');
      const fileName = `food_${Date.now()}.jpg`;
      const permanentPath = `${FileSystem.documentDirectory}${fileName}`;

      console.log('Copying image from:', tempUri);
      console.log('Copying image to:', permanentPath);

      // First check if source file exists
      const sourceInfo = await FileSystem.getInfoAsync(tempUri);
      if (!sourceInfo.exists) {
        console.error('Source file does not exist:', tempUri);
        throw new Error('Source file does not exist');
      }

      console.log('Source file exists, proceeding with copy...');

      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentPath,
      });

      // Verify the copy was successful
      const destInfo = await FileSystem.getInfoAsync(permanentPath);
      if (!destInfo.exists) {
        throw new Error('Copy operation failed - destination file does not exist');
      }

      console.log('Image successfully copied to permanent location:', permanentPath);
      return permanentPath;
    } catch (error) {
      console.error('Error copying image:', error);
      console.log('Falling back to original URI:', tempUri);
      // Return original URI if copy fails
      return tempUri;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.capturingButton]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  capturingButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
