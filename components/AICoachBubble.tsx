// Floating AI Coach Bubble Component with Dynamic Agent
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { aiCoachAgentService, MealInput } from '../services/aiCoachAgentService';
import { voiceInputService } from '../services/voiceInputService';

interface AICoachBubbleProps {
  onMealLogged?: () => void;
  onGoalUpdated?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AICoachBubble({ onMealLogged, onGoalUpdated }: AICoachBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Chat functionality
  const [messages, setMessages] = useState<Array<{ id: string; type: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Animation values
  const translateX = new Animated.Value(screenWidth - 80);
  const translateY = new Animated.Value(screenHeight - 200);
  const scale = new Animated.Value(1);

  // Initialize chat and voice capabilities
  useEffect(() => {
    // Check if voice input is available
    setIsVoiceAvailable(voiceInputService.isAvailable());
    
    // Add welcome message
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: "Hi! I'm your NutriHelp AI Coach. I can help you log meals, track your nutrition, and provide personalized health advice. You can speak to me or type your message. What would you like to tell me about your food today?",
      timestamp: new Date()
    }]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message to UI
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const mealInput: MealInput = {
        type: 'text',
        content: userMessage,
        timestamp: new Date()
      };

      const response = await aiCoachAgentService.processUserInput(mealInput);
      
      // Add assistant response to UI
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        type: 'assistant',
        content: response.message,
        timestamp: new Date()
      }]);

      // Handle actions taken
      if (response.actionTaken === 'logged_meal' && onMealLogged) {
        onMealLogged();
      }
      if (response.actionTaken === 'updated_goal' && onGoalUpdated) {
        onGoalUpdated();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: errorMsgId,
        type: 'assistant',
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      voiceInputService.stopRecording();
      setIsRecording(false);
      return;
    }

    // Start recording
    setIsRecording(true);

    try {
      const result = await voiceInputService.startRecording();
      
      if (result.isFinal) {
        setInputText(result.text);
        setIsRecording(false);
        
        // Automatically send the voice input
        setTimeout(() => {
          if (result.text.trim()) {
            handleSendMessage();
          }
        }, 500);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      setIsRecording(false);
      
      Alert.alert(
        'Voice Input Error',
        error.message || 'Failed to process voice input. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Simple toggle visibility instead of dragging
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([{
              id: 'welcome',
              type: 'assistant',
              content: "Hi! I'm your NutriHelp AI Coach. I can help you log meals, track your nutrition, and provide personalized health advice. You can speak to me or type your message. What would you like to tell me about your food today?",
              timestamp: new Date()
            }]);
            aiCoachAgentService.clearConversationHistory();
          }
        }
      ]
    );
  };

  const renderMessage = (message: any) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.type === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.type === 'user' ? styles.userMessageText : styles.assistantMessageText
      ]}>
        {message.content}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

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
                <Ionicons name="chatbubbles" size={24} color="#007AFF" />
              </View>
              <Text style={styles.coachTitle}>AI Coach Agent</Text>
              <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map(renderMessage)}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.loadingText}>AI Coach is thinking...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Tell me what you ate or ask about nutrition..."
                  multiline
                  maxLength={500}
                  editable={!isRecording}
                />
                
                {isVoiceAvailable && (
                  <TouchableOpacity
                    style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                    onPress={handleVoiceInput}
                    disabled={isLoading}
                  >
                    <Ionicons 
                      name={isRecording ? "stop" : "mic"} 
                      size={20} 
                      color={isRecording ? "#fff" : "#007AFF"} 
                    />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                >
                  <Ionicons name="send" size={16} color={inputText.trim() && !isLoading ? "#fff" : "#999"} />
                </TouchableOpacity>
              </View>
              
              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Listening... Speak now</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.hideButton} onPress={toggleVisibility}>
              <Ionicons name="eye-off" size={16} color="#666" />
              <Text style={styles.hideButtonText}>Hide AI Coach</Text>
            </TouchableOpacity>
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
  clearButton: {
    padding: 5,
    marginRight: 8,
  },
  modalBody: {
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    maxHeight: 400,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
    marginRight: 8,
  },
  voiceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#ff3b30',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3b30',
    marginRight: 6,
  },
  recordingText: {
    fontSize: 12,
    color: '#666',
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
