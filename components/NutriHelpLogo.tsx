import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface NutriHelpLogoProps {
  size?: number;
  showText?: boolean;
}

export default function NutriHelpLogo({ size = 120, showText = true }: NutriHelpLogoProps) {
  return (
    <View style={styles.container}>
      {/* Logo SVG */}
      <View style={[styles.logoContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="50%" stopColor="#FF6B35" />
              <Stop offset="100%" stopColor="#4CAF50" />
            </LinearGradient>
          </Defs>
          
          {/* Stylized N */}
          <Path
            d="M20 20 L20 100 L30 100 L30 40 L90 100 L100 100 L100 20 L90 20 L90 80 L30 20 Z"
            fill="url(#gradient)"
            stroke="none"
          />
          
          {/* Leaf */}
          <Path
            d="M85 25 C90 20, 95 25, 90 35 C88 32, 85 30, 82 35 C85 30, 88 28, 85 25 Z"
            fill="#66BB6A"
            stroke="#4CAF50"
            strokeWidth="1"
          />
          
          {/* Leaf veins */}
          <Path
            d="M87 28 L87 32"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <Path
            d="M85 30 L85 34"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </Svg>
      </View>
      
      {/* App Name */}
      {showText && (
        <Text style={styles.appName}>NutriHelp</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
