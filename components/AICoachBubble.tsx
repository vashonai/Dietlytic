// Floating AI Coach Bubble Component
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AICoachAdvice, aiCoachService } from '../services/aiCoachService';

interface AICoachBubbleProps {
  onAdviceGenerated?: (advice: AICoachAdvice) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AICoachBubble({ onAdviceGenerated }: AICoachBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<AICoachAdvice | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values
  const translateX = new Animated.Value(screenWidth - 80);
  const translateY = new Animated.Value(screenHeight - 200);
  const scale = new Animated.Value(1);
  const pulseAnim = new Animated.Value(1);

  // Pulse animation for attention
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isVisible) pulse();
      });
    };
    
    pulse();
  }, [isVisible]);

  // Show motivational tip on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const tip = aiCoachService.getMotivationalTip();
      const advice: AICoachAdvice = {
        message: tip,
        type: 'motivation',
        actionItems: [],
        relatedTips: []
      };
      setCurrentAdvice(advice);
      onAdviceGenerated?.(advice);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handlePress = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowModal(true);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimating(false));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Simple toggle visibility instead of dragging
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getQuickTip = () => {
    const tip = aiCoachService.getQuickTip();
    const advice: AICoachAdvice = {
      message: tip,
      type: 'suggestion',
      actionItems: [],
      relatedTips: []
    };
    setCurrentAdvice(advice);
    onAdviceGenerated?.(advice);
  };

  const getMealTimingAdvice = () => {
    const advice = aiCoachService.analyzeMealTiming();
    const coachAdvice: AICoachAdvice = {
      message: advice,
      type: 'suggestion',
      actionItems: [],
      relatedTips: []
    };
    setCurrentAdvice(coachAdvice);
    onAdviceGenerated?.(coachAdvice);
  };

  if (!isVisible) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.bubbleContainer,
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.bubble}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.bubbleInner,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.coachAvatar}>
                <Ionicons name="bulb" size={24} color="#007AFF" />
              </View>
              <Text style={styles.coachTitle}>AI Coach</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {currentAdvice && (
                <View style={styles.adviceContainer}>
                  <Text style={styles.adviceMessage}>{currentAdvice.message}</Text>
                  
                  {currentAdvice.actionItems.length > 0 && (
                    <View style={styles.actionItemsContainer}>
                      <Text style={styles.actionItemsTitle}>Action Items:</Text>
                      {currentAdvice.actionItems.map((item, index) => (
                        <Text key={index} style={styles.actionItem}>• {item}</Text>
                      ))}
                    </View>
                  )}

                  {currentAdvice.relatedTips.length > 0 && (
                    <View style={styles.tipsContainer}>
                      <Text style={styles.tipsTitle}>Related Tips:</Text>
                      {currentAdvice.relatedTips.map((tip, index) => (
                        <Text key={index} style={styles.tip}>💡 {tip}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}

               <View style={styles.quickActions}>
                 <TouchableOpacity style={styles.quickActionButton} onPress={getQuickTip}>
                   <Ionicons name="flash" size={20} color="#007AFF" />
                   <Text style={styles.quickActionText}>Quick Tip</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity style={styles.quickActionButton} onPress={getMealTimingAdvice}>
                   <Ionicons name="time" size={20} color="#007AFF" />
                   <Text style={styles.quickActionText}>Meal Timing</Text>
                 </TouchableOpacity>
               </View>

               <TouchableOpacity style={styles.hideButton} onPress={toggleVisibility}>
                 <Ionicons name="eye-off" size={16} color="#666" />
                 <Text style={styles.hideButtonText}>Hide AI Coach</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  adviceContainer: {
    marginBottom: 20,
  },
  adviceMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  actionItemsContainer: {
    marginBottom: 16,
  },
  actionItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
  },
  tipsContainer: {
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  quickActionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  hideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 12,
  },
  hideButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});
