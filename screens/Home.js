import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import OpenHangoutToggle from '../components/OpenHangoutToggle';
import OpenHangoutModal from '../components/OpenHangoutModal';
import UnreadBadge from '../components/UnreadBadge';
import { getUnreadCount } from '../utils/storage';

/**
 * HOME SCREEN
 *
 * The main screen showing all circles.
 * Users tap a circle to navigate to that circle's feed.
 *
 * Features the signature 'Open Hangout' toggle - our solution to
 * the "asking to hang out feels like a burden" problem.
 * Now enhanced with circle selection and optional context messages.
 */

/**
 * BREATHING CIRCLE COMPONENT
 *
 * Each circle breathes independently with its own timing.
 * The animation scales from 1.0 (normal) to 1.08 (slightly bigger) and back.
 *
 * When Open Hangout is active for this circle, it gets a sparkle/glow.
 * This signals availability without the pressure of directly asking.
 */
function BreathingCircle({ circle, delay, onPress, hangoutSettings, theme, unreadCount }) {
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

  // Sparkle glow animation when this circle is selected for Open Hangout
  useEffect(() => {
    const isSelected = hangoutSettings?.circles?.includes(circle.name);

    if (isSelected) {
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
  }, [hangoutSettings, circle.name, glowAnim]);

  const isSelected = hangoutSettings?.circles?.includes(circle.name);
  const showGlow = isSelected;

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

          {/* Unread badge for new posts */}
          <UnreadBadge count={unreadCount} theme={theme} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function Home({ navigation, theme }) {
  const circles = theme.circles;

  // State for Open Hangout settings (which circles, optional message)
  const [hangoutSettings, setHangoutSettings] = useState({
    circles: [],
    message: '',
  });

  // State for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for unread counts per circle
  const [unreadCounts, setUnreadCounts] = useState({});

  const handleSaveHangoutSettings = (settings) => {
    setHangoutSettings(settings);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  // Load unread counts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      async function loadUnreadCounts() {
        const counts = {};
        for (const circle of circles) {
          const count = await getUnreadCount(circle.name);
          counts[circle.name] = count;
        }
        setUnreadCounts(counts);
      }
      loadUnreadCounts();
    }, [circles])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings', { theme })}
      >
        <Text style={[styles.settingsText, { color: theme.subtitle }]}>⚙️ Settings</Text>
      </TouchableOpacity>

      {/* App Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Circles</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Connect mindfully
        </Text>
      </View>

      {/* Gentle notification banner */}
      {(() => {
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
        if (totalUnread === 0) return null;

        // Create a gentle message about new posts
        const circlesWithUnread = Object.entries(unreadCounts)
          .filter(([_, count]) => count > 0)
          .map(([name, count]) => `${count} in ${name}`)
          .slice(0, 2); // Show max 2 circles

        const message = circlesWithUnread.length === 1
          ? `${circlesWithUnread[0]}`
          : circlesWithUnread.length === 2
          ? `${circlesWithUnread[0]}, ${circlesWithUnread[1]}`
          : `${totalUnread} new thoughts`;

        return (
          <View style={[styles.notificationBanner, { backgroundColor: theme.selectedBg }]}>
            <Text style={[styles.notificationText, { color: theme.subtitle }]}>
              ✨ {message} {circlesWithUnread.length > 1 ? 'new thoughts' : 'new thought'}
            </Text>
          </View>
        );
      })()}

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
              onPress={() =>
                navigation.navigate('CircleFeed', { circle, hangoutSettings })
              }
              hangoutSettings={hangoutSettings}
              theme={theme}
              unreadCount={unreadCounts[circle.name] || 0}
            />
          ))}
        </View>
      </View>

      {/* Open Hangout Toggle - our signature feature */}
      <OpenHangoutToggle
        hangoutSettings={hangoutSettings}
        onPress={handleOpenModal}
        theme={theme}
      />

      {/* Open Hangout Modal */}
      <OpenHangoutModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveHangoutSettings}
        initialSettings={hangoutSettings}
        theme={theme}
        availableCircles={circles}
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
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '500',
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
  notificationBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '400',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
