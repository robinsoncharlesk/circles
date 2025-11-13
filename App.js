import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

/**
 * CIRCLES - A Mindful Social Media App
 *
 * This is your starting point. Every app needs a main component - this is it.
 * Think of this like the front door to your app.
 */

export default function App() {
  // This tracks which circle you're viewing
  const [selectedCircle, setSelectedCircle] = useState(null);

  // Your main circles - these are the core of your app's philosophy
  const circles = [
    { id: 1, name: 'Inner Circle', color: '#7C9885', emoji: '🌿' },
    { id: 2, name: 'Family', color: '#B4A5A5', emoji: '❤️' },
    { id: 3, name: 'Friends', color: '#A8B8D8', emoji: '🌟' },
    { id: 4, name: 'Work', color: '#C9B8A8', emoji: '💼' },
  ];

  return (
    <View style={styles.container}>
      {/* StatusBar controls the top bar of your phone */}
      <StatusBar barStyle="dark-content" />

      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Circles</Text>
        <Text style={styles.subtitle}>Connect mindfully</Text>
      </View>

      {/* The main circles display */}
      <View style={styles.circlesContainer}>
        <Text style={styles.prompt}>Choose a circle to connect</Text>

        <View style={styles.circleGrid}>
          {circles.map((circle) => (
            <TouchableOpacity
              key={circle.id}
              style={[styles.circle, { backgroundColor: circle.color }]}
              onPress={() => setSelectedCircle(circle)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{circle.emoji}</Text>
              <Text style={styles.circleName}>{circle.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Show selected circle feedback */}
        {selectedCircle && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>
              You selected: {selectedCircle.emoji} {selectedCircle.name}
            </Text>
            <Text style={styles.comingSoon}>
              (Circle feed coming soon!)
            </Text>
          </View>
        )}
      </View>

      {/* Footer with your philosophy */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>No likes. No ads. Just real connections.</Text>
      </View>
    </View>
  );
}

/**
 * STYLES
 * This is where we make things look good.
 * Calming colors, gentle spacing, nothing aggressive.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Soft, neutral background
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '300', // Light weight = calm, not aggressive
    color: '#333',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '300',
  },
  circlesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prompt: {
    fontSize: 18,
    color: '#555',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  selectedText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});
