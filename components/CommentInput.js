import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

/**
 * COMMENT INPUT
 *
 * A small bubble that grows as you type - feels alive and responsive.
 * Encourages brief, supportive responses rather than long debates.
 */

const MAX_CHARACTERS = 200; // Shorter than posts - comments are responses, not essays

export default function CommentInput({ onSubmit, theme }) {
  const [text, setText] = useState('');
  const bubbleScale = useRef(new Animated.Value(1)).current;

  // Calculate character usage
  const charPercentage = text.length / MAX_CHARACTERS;

  // Grow the bubble as the user types
  useEffect(() => {
    // Scale from 1.0 to 1.05 as they type
    const targetScale = 1 + charPercentage * 0.05;

    Animated.spring(bubbleScale, {
      toValue: targetScale,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [charPercentage, bubbleScale]);

  // Handle submit
  const handleSubmit = () => {
    if (text.trim().length === 0) return;

    onSubmit(text.trim());
    setText(''); // Clear input
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: bubbleScale }] },
      ]}
    >
      <View style={[styles.inputContainer, { backgroundColor: theme.selectedBg }]}>
        <TextInput
          style={[styles.input, { color: theme.title }]}
          placeholder="Add a supportive comment..."
          placeholderTextColor={theme.footer}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_CHARACTERS}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: text.trim().length === 0 ? theme.footer : theme.title,
              opacity: text.trim().length === 0 ? 0.4 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={text.trim().length === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Character counter - only show when getting close */}
      {charPercentage > 0.7 && (
        <Text
          style={[
            styles.charCounter,
            {
              color: charPercentage > 0.9 ? '#D64545' : theme.footer,
            },
          ]}
        >
          {MAX_CHARACTERS - text.length} left
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginLeft: 20, // Match comment indent
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '300',
    maxHeight: 80,
    paddingVertical: 6,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFF',
  },
  charCounter: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 14,
    fontWeight: '300',
  },
});
