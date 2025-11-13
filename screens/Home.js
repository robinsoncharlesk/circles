import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import OpenHangoutToggle from '../components/OpenHangoutToggle';

/**
 * HOME SCREEN
 *
 * The main screen showing all circles.
 * Users tap a circle to navigate to that circle's feed.
 *
 * Features the signature 'Open Hangout' toggle - our solution to
 * the "asking to hang out feels like a burden" problem.
 */

/**
 * BREATHING CIRCLE COMPONENT
 *
 * Each circle breathes independently with its own timing.
 * The animation scales from 1.0 (normal) to 1.08 (slightly bigger) and back.
 *
 * When Open Hangout is active, the Friends circle gets a special sparkle/glow.
 * This signals availability without the pressure of directly asking.
 */
function BreathingCircle({ circle, delay, onPress, isOpenHangout, theme }) {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Standard breathing animation
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1.0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const timer = setTimeout(() => {
      breathe.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      breathe.stop();
    };
  }, [breathAnim, delay]);

  // Sparkle glow animation for Friends circle when Open Hangout is active
  useEffect(() => {
    const isFriendsCircle = circle.name === 'Friends';

    if (isFriendsCircle && isOpenHangout) {
      // Start the sparkle glow animation
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false, // Can't use native driver for shadow props
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      glow.start();

      return () => glow.stop();
    } else {
      // Reset glow when toggled off
      glowAnim.setValue(0);
    }
  }, [isOpenHangout, circle.name, glowAnim]);

  const isFriendsCircle = circle.name === 'Friends';
  const showGlow = isFriendsCircle && isOpenHangout;

  // Interpolate glow values for shadow
  const shadowOpacity = showGlow
    ? glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.5],
      })
    : 0.1;

  const shadowRadius = showGlow
    ? glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 16],
      })
    : 4;

  return (
    <Animated.View
      style={{
        transform: [{ scale: breathAnim }],
      }}
    >
      <Animated.View
        style={[
          styles.circleWrapper,
          showGlow && {
            shadowColor: theme.prompt, // Use theme color for glow
            shadowOpacity: shadowOpacity,
            shadowRadius: shadowRadius,
            shadowOffset: { width: 0, height: 0 },
            elevation: showGlow ? 12 : 0,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: circle.color }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{circle.emoji}</Text>
          <Text style={styles.circleName}>{circle.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function Home({ navigation, theme }) {
  const circles = theme.circles;

  // State for Open Hangout toggle
  const [isOpenHangout, setIsOpenHangout] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Circles</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Connect mindfully
        </Text>
      </View>

      {/* The main circles display */}
      <View style={styles.circlesContainer}>
        <Text style={[styles.prompt, { color: theme.prompt }]}>
          Choose a circle to connect
        </Text>

        <View style={styles.circleGrid}>
          {circles.map((circle, index) => (
            <BreathingCircle
              key={circle.id}
              circle={circle}
              delay={index * 600}
              onPress={() => navigation.navigate('CircleFeed', { circle })}
              isOpenHangout={isOpenHangout}
              theme={theme}
            />
          ))}
        </View>
      </View>

      {/* Open Hangout Toggle - our signature feature */}
      <OpenHangoutToggle
        isOpen={isOpenHangout}
        onToggle={() => setIsOpenHangout(!isOpenHangout)}
        theme={theme}
      />

      {/* Footer with your philosophy */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.footer }]}>
          No likes. No ads. Just real connections.
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
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '300',
  },
  circlesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prompt: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  circleWrapper: {
    borderRadius: 70,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  circleName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
