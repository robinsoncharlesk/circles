import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * OPEN HANGOUT TOGGLE
 *
 * A low-pressure way to signal availability without directly asking.
 * Solves: "I want to connect but don't want to feel like a burden."
 *
 * This is what makes Circles different - reducing social friction.
 */

export default function OpenHangoutToggle({ isOpen, onToggle, theme }) {
  return (
    <View style={styles.container}>
      {/* The toggle button */}
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: isOpen ? theme.title : 'transparent',
            borderColor: isOpen ? theme.title : theme.footer,
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.toggleText,
            {
              color: isOpen ? '#FFF' : theme.subtitle,
            },
          ]}
        >
          {isOpen ? '✨ Open to Hangout' : '💭 Available to Connect?'}
        </Text>
      </TouchableOpacity>

      {/* Subtext when open */}
      {isOpen && (
        <Text style={[styles.subtext, { color: theme.subtitle }]}>
          Your friends can see you're free to connect!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
