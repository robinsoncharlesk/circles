import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated } from 'react-native';

/**
 * CIRCLES - A Mindful Social Media App
 *
 * This is your starting point. Every app needs a main component - this is it.
 * Think of this like the front door to your app.
 */

/**
 * TIME-BASED COLOR PALETTES
 *
 * The app changes its entire color scheme based on the time of day.
 * This respects your natural circadian rhythms - bright in the day, calm at night.
 */
const COLOR_THEMES = {
  morning: {
    name: 'Morning',
    timeRange: '5am - 12pm',
    background: '#FAF7F2', // Soft cream, like early light
    title: '#5D4E3F', // Warm brown
    subtitle: '#8B7B6B', // Muted taupe
    prompt: '#6B5D52', // Gentle brown
    footer: '#A89888', // Soft gray-brown
    circles: [
      { id: 1, name: 'Inner Circle', color: '#B8D4C8', emoji: '🌿' }, // Soft sage - morning dew
      { id: 2, name: 'Family', color: '#E6C4B8', emoji: '❤️' }, // Peachy pink - sunrise warmth
      { id: 3, name: 'Friends', color: '#D4E0E8', emoji: '🌟' }, // Soft blue - morning sky
      { id: 4, name: 'Work', color: '#E8D8C8', emoji: '💼' }, // Warm beige - fresh start
    ],
    selectedBg: '#FFFFFF',
    statusBar: 'dark-content',
  },
  afternoon: {
    name: 'Afternoon',
    timeRange: '12pm - 6pm',
    background: '#F0F4F8', // Clear, bright blue-gray
    title: '#2C3E50', // Deep slate blue
    subtitle: '#5A6C7D', // Medium slate
    prompt: '#4A5C6D', // Calm blue-gray
    footer: '#7A8C9D', // Soft blue-gray
    circles: [
      { id: 1, name: 'Inner Circle', color: '#6B9B8A', emoji: '🌿' }, // Vibrant sage - full daylight
      { id: 2, name: 'Family', color: '#C8968F', emoji: '❤️' }, // Warm terracotta
      { id: 3, name: 'Friends', color: '#8BAED8', emoji: '🌟' }, // Clear sky blue
      { id: 4, name: 'Work', color: '#B8A88F', emoji: '💼' }, // Golden tan
    ],
    selectedBg: '#FFFFFF',
    statusBar: 'dark-content',
  },
  evening: {
    name: 'Evening',
    timeRange: '6pm - 5am',
    background: '#2B2D3E', // Deep twilight blue
    title: '#E8DDD0', // Warm cream
    subtitle: '#B8ADA0', // Soft tan
    prompt: '#C8BDB0', // Gentle beige
    footer: '#8B8078', // Muted brown
    circles: [
      { id: 1, name: 'Inner Circle', color: '#5A7B6B', emoji: '🌿' }, // Deep forest - night garden
      { id: 2, name: 'Family', color: '#9B6B6B', emoji: '❤️' }, // Deep rose - warm hearth
      { id: 3, name: 'Friends', color: '#6B7B9B', emoji: '🌟' }, // Twilight blue - evening stars
      { id: 4, name: 'Work', color: '#9B8B6B', emoji: '💼' }, // Amber - winding down
    ],
    selectedBg: '#3B3D4E',
    statusBar: 'light-content',
  },
};

/**
 * DETECT TIME OF DAY
 *
 * Checks the current hour and returns the appropriate theme.
 * Morning: 5am - 12pm
 * Afternoon: 12pm - 6pm
 * Evening: 6pm - 5am
 */
function getTimeOfDay() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * BREATHING CIRCLE COMPONENT
 *
 * Each circle breathes independently with its own timing.
 * The animation scales from 1.0 (normal) to 1.08 (slightly bigger) and back.
 * Think of it like a gentle inhale and exhale - calming, not jarring.
 */
function BreathingCircle({ circle, delay, onPress, isSelected }) {
  // useRef holds values that persist between renders
  // This is the animated value that will control the scale
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create the breathing animation sequence
    const breathe = Animated.loop(
      Animated.sequence([
        // Breathe in - scale up to 1.08 over 1.8 seconds
        Animated.timing(breathAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true, // Better performance
        }),
        // Breathe out - scale back to 1.0 over 1.8 seconds
        Animated.timing(breathAnim, {
          toValue: 1.0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    // Add the stagger delay before starting
    // Each circle starts at a different time for organic feel
    const timer = setTimeout(() => {
      breathe.start();
    }, delay);

    // Cleanup: stop animation if component unmounts
    return () => {
      clearTimeout(timer);
      breathe.stop();
    };
  }, [breathAnim, delay]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: breathAnim }], // Apply the breathing scale
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

export default function App() {
  // This tracks which circle you're viewing
  const [selectedCircle, setSelectedCircle] = useState(null);

  // Detect the time of day and get the appropriate theme
  const timeOfDay = getTimeOfDay();
  const theme = COLOR_THEMES[timeOfDay];

  // Your circles now use colors from the current theme
  const circles = theme.circles;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* StatusBar controls the top bar of your phone - changes based on time */}
      <StatusBar barStyle={theme.statusBar} />

      {/* App Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Circles</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>Connect mindfully</Text>
      </View>

      {/* The main circles display */}
      <View style={styles.circlesContainer}>
        <Text style={[styles.prompt, { color: theme.prompt }]}>Choose a circle to connect</Text>

        <View style={styles.circleGrid}>
          {circles.map((circle, index) => (
            <BreathingCircle
              key={circle.id}
              circle={circle}
              delay={index * 600} // Stagger each circle by 600ms for organic feel
              onPress={() => setSelectedCircle(circle)}
              isSelected={selectedCircle?.id === circle.id}
            />
          ))}
        </View>

        {/* Show selected circle feedback */}
        {selectedCircle && (
          <View style={[styles.selectedInfo, { backgroundColor: theme.selectedBg }]}>
            <Text style={[styles.selectedText, { color: theme.title }]}>
              You selected: {selectedCircle.emoji} {selectedCircle.name}
            </Text>
            <Text style={[styles.comingSoon, { color: theme.footer }]}>
              (Circle feed coming soon!)
            </Text>
          </View>
        )}
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

/**
 * STYLES
 *
 * Now simplified - colors come from the time-based theme!
 * These styles just define sizes, spacing, and structure.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is now dynamic (from theme)
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '300', // Light weight = calm, not aggressive
    // color is now dynamic (from theme)
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    // color is now dynamic (from theme)
    marginTop: 8,
    fontWeight: '300',
  },
  circlesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prompt: {
    fontSize: 18,
    // color is now dynamic (from theme)
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
    borderRadius: 70, // Makes it circular
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow for depth
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
  selectedInfo: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
    // backgroundColor is now dynamic (from theme)
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  selectedText: {
    fontSize: 18,
    // color is now dynamic (from theme)
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 14,
    // color is now dynamic (from theme)
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    // color is now dynamic (from theme)
    fontStyle: 'italic',
  },
});
