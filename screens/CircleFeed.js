import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

/**
 * CIRCLE FEED SCREEN
 *
 * This is where users see posts from a specific circle.
 * For now, it shows an empty state, but this is where content will live.
 */

/**
 * BREATHING EMOJI COMPONENT
 *
 * A gentle breathing animation for the emoji in the empty state.
 * Makes the screen feel alive even when empty.
 */
function BreathingEmoji({ emoji }) {
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1.0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    breathe.start();

    return () => breathe.stop();
  }, [breathAnim]);

  return (
    <Animated.Text
      style={[
        styles.emptyEmoji,
        {
          transform: [{ scale: breathAnim }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function CircleFeed({ route, navigation, theme }) {
  // Get the circle data passed from home screen
  const { circle } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: theme.title }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.headerEmoji]}>{circle.emoji}</Text>
          <Text style={[styles.headerTitle, { color: theme.title }]}>
            {circle.name}
          </Text>
        </View>

        {/* Spacer to center the title (invisible back button for balance) */}
        <View style={styles.backButton} />
      </View>

      {/* Empty state - this is where posts will appear */}
      <View style={styles.emptyState}>
        <BreathingEmoji emoji={circle.emoji} />

        <Text style={[styles.emptyTitle, { color: theme.title }]}>
          Start sharing with {circle.name}
        </Text>

        <Text style={[styles.emptySubtitle, { color: theme.subtitle }]}>
          This is your space for meaningful connections.
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.subtitle }]}>
          Posts will appear here.
        </Text>
      </View>

      {/* Future: Add post button will go here */}
      <View style={styles.footer}>
        <Text style={[styles.footerHint, { color: theme.footer }]}>
          Post creation coming soon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    fontWeight: '300',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerHint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
