import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

/**
 * HOME SCREEN
 *
 * The main screen showing all circles.
 * Users tap a circle to navigate to that circle's feed.
 */

/**
 * BREATHING CIRCLE COMPONENT
 *
 * Each circle breathes independently with its own timing.
 * The animation scales from 1.0 (normal) to 1.08 (slightly bigger) and back.
 * Think of it like a gentle inhale and exhale - calming, not jarring.
 */
function BreathingCircle({ circle, delay, onPress }) {
  const breathAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <Animated.View
      style={{
        transform: [{ scale: breathAnim }],
      }}
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
  );
}

export default function Home({ navigation, theme }) {
  const circles = theme.circles;

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
            />
          ))}
        </View>
      </View>

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
