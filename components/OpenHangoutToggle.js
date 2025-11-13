import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * OPEN HANGOUT TOGGLE
 *
 * A low-pressure way to signal availability without directly asking.
 * Solves: "I want to connect but don't want to feel like a burden."
 *
 * This is what makes Circles different - reducing social friction.
 * Now with enhanced context: choose circles, add optional message.
 */

export default function OpenHangoutToggle({ hangoutSettings, onPress, theme }) {
  const isOpen = hangoutSettings?.circles?.length > 0;
  const circleCount = hangoutSettings?.circles?.length || 0;
  const message = hangoutSettings?.message;

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
        onPress={onPress}
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
          {isOpen
            ? `✨ Open to Hangout (${circleCount})`
            : '💭 Available to Connect?'}
        </Text>
      </TouchableOpacity>

      {/* Subtext when open */}
      {isOpen && (
        <View style={styles.subtextContainer}>
          <Text style={[styles.subtext, { color: theme.subtitle }]}>
            {circleCount === 1
              ? `${hangoutSettings.circles[0]} can see you're available`
              : `${circleCount} circles can see you're available`}
          </Text>
          {message && (
            <Text
              style={[styles.messagePreview, { color: theme.subtitle }]}
              numberOfLines={1}
            >
              "{message}"
            </Text>
          )}
          <Text style={[styles.editHint, { color: theme.footer }]}>
            Tap to edit or turn off
          </Text>
        </View>
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
  subtextContainer: {
    marginTop: 10,
    alignItems: 'center',
    gap: 4,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '300',
    textAlign: 'center',
  },
  messagePreview: {
    fontSize: 13,
    fontWeight: '300',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
  editHint: {
    fontSize: 11,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 4,
  },
});
