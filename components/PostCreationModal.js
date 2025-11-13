import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

/**
 * POST CREATION MODAL
 *
 * A calm, journal-like interface for sharing thoughts with a specific circle.
 * Not broadcasting to millions - writing to close friends.
 */

const MAX_CHARACTERS = 280;

export default function PostCreationModal({ visible, onClose, onPost, theme, circleName }) {
  const [text, setText] = useState('');
  const bubbleScale = useRef(new Animated.Value(1)).current;

  // Calculate character count and percentage
  const charCount = text.length;
  const charPercentage = charCount / MAX_CHARACTERS;
  const charsRemaining = MAX_CHARACTERS - charCount;

  // Grow the bubble as the user types (visual feedback)
  useEffect(() => {
    // Scale from 1.0 to 1.15 as they approach max characters
    const targetScale = 1 + charPercentage * 0.15;

    Animated.spring(bubbleScale, {
      toValue: targetScale,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [charPercentage, bubbleScale]);

  // Handle posting
  const handlePost = () => {
    if (text.trim().length === 0) return;

    onPost(text.trim());
    setText(''); // Clear input
    onClose(); // Close modal
  };

  // Handle cancel
  const handleCancel = () => {
    setText(''); // Clear input
    onClose(); // Close modal
  };

  // Determine character counter color
  const getCounterColor = () => {
    if (charPercentage > 0.9) return '#D64545'; // Red when almost full
    if (charPercentage > 0.7) return '#E8A04D'; // Orange when getting close
    return theme.subtitle; // Normal color
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        {/* Dim background - tap to close */}
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleCancel}
        />

        {/* The post creation bubble */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.selectedBg,
              transform: [{ scale: bubbleScale }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.title }]}>
              Share with {circleName}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.subtitle }]}>
              Write something meaningful
            </Text>
          </View>

          {/* Text input area */}
          <TextInput
            style={[styles.input, { color: theme.title }]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.footer}
            multiline
            maxLength={MAX_CHARACTERS}
            value={text}
            onChangeText={setText}
            autoFocus
            textAlignVertical="top"
          />

          {/* Character counter */}
          <View style={styles.footer}>
            <Text style={[styles.charCounter, { color: getCounterColor() }]}>
              {charsRemaining} characters remaining
            </Text>

            {/* Action buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: theme.subtitle }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.shareButton,
                  {
                    backgroundColor: text.trim().length === 0 ? theme.footer : theme.title,
                    opacity: text.trim().length === 0 ? 0.4 : 1,
                  },
                ]}
                onPress={handlePost}
                activeOpacity={0.7}
                disabled={text.trim().length === 0}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  input: {
    minHeight: 120,
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    gap: 16,
  },
  charCounter: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  shareButton: {
    // backgroundColor comes from dynamic theme
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '400',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
});
