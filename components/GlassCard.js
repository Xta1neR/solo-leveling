import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../theme/colors';
import * as Haptics from 'expo-haptics';

export default function GlassCard({ children, style, onPress, active }) {
  
  const handlePress = () => {
    if (onPress) {
      // This adds the "Premium Feel" - a tiny vibration on click
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={handlePress}
      disabled={!onPress}
      style={[styles.container, style, active && SHADOWS.glow]}
    >
      <LinearGradient
        colors={active 
          ? ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.05)'] 
          : ['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, active && styles.activeBorder]}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  activeBorder: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  }
});