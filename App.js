import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import CircleFeed from './screens/CircleFeed';
import Settings from './screens/Settings';

/**
 * CIRCLES - A Mindful Social Media App
 *
 * This is your navigation structure - the map of your app.
 * Users can navigate between the home screen and individual circle feeds.
 */

/**
 * TIME-BASED COLOR PALETTES
 *
 * Enhanced with more vibrant, saturated colors for better visual appeal.
 * The app changes its entire color scheme based on the time of day.
 * This respects your natural circadian rhythms - bright in the day, calm at night.
 */
const COLOR_THEMES = {
  morning: {
    name: 'Morning',
    timeRange: '5am - 12pm',
    background: '#FBF8F3', // Softer cream
    title: '#3D2E1F', // Richer dark brown - better contrast
    subtitle: '#6B5D52', // Warmer mid-tone
    prompt: '#5D4E3F', // Deeper brown
    footer: '#8B7B6B', // Muted but readable
    circles: [
      { id: 1, name: 'Inner Circle', color: '#7AC29A', emoji: '🌿' }, // More vibrant sage
      { id: 2, name: 'Family', color: '#F4A89F', emoji: '❤️' }, // Richer peachy pink
      { id: 3, name: 'Friends', color: '#A8C8E8', emoji: '🌟' }, // Brighter sky blue
      { id: 4, name: 'Work', color: '#E8C89F', emoji: '💼' }, // Warmer golden beige
    ],
    selectedBg: '#FFFFFF',
    statusBar: 'dark-content',
  },
  afternoon: {
    name: 'Afternoon',
    timeRange: '12pm - 6pm',
    background: '#EBF2F8', // Clearer blue-white
    title: '#1A2B3C', // Deeper slate - better contrast
    subtitle: '#3D4E5F', // Richer mid-tone
    prompt: '#2C3E50', // Stronger blue-gray
    footer: '#5A6C7D', // More readable
    circles: [
      { id: 1, name: 'Inner Circle', color: '#4CAF7B', emoji: '🌿' }, // Vibrant emerald sage
      { id: 2, name: 'Family', color: '#E8735F', emoji: '❤️' }, // Rich terracotta
      { id: 3, name: 'Friends', color: '#5B9FD8', emoji: '🌟' }, // Bright sky blue
      { id: 4, name: 'Work', color: '#D4A574', emoji: '💼' }, // Rich golden tan
    ],
    selectedBg: '#FFFFFF',
    statusBar: 'dark-content',
  },
  evening: {
    name: 'Evening',
    timeRange: '6pm - 5am',
    background: '#1E2030', // Richer twilight
    title: '#F5EBE0', // Warmer cream - better contrast
    subtitle: '#C8B8A8', // Richer tan
    prompt: '#D8C8B8', // Warmer beige
    footer: '#9B8B7B', // More visible
    circles: [
      { id: 1, name: 'Inner Circle', color: '#4A8B6B', emoji: '🌿' }, // Richer forest green
      { id: 2, name: 'Family', color: '#C85B5B', emoji: '❤️' }, // Vibrant rose
      { id: 3, name: 'Friends', color: '#5B7BC8', emoji: '🌟' }, // Rich twilight blue
      { id: 4, name: 'Work', color: '#C89B4A', emoji: '💼' }, // Rich amber
    ],
    selectedBg: '#2B2D40',
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

// Create the navigation stack
const Stack = createNativeStackNavigator();

export default function App() {
  // Get the current theme based on time of day
  const timeOfDay = getTimeOfDay();
  const theme = COLOR_THEMES[timeOfDay];

  return (
    <>
      {/* StatusBar adapts to time of day */}
      <StatusBar barStyle={theme.statusBar} />

      {/* Navigation container wraps all screens */}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // We use custom headers for our calm aesthetic
            animation: 'fade', // Gentle transitions, not jarring slides
          }}
        >
          {/* Home screen - shows all circles */}
          <Stack.Screen name="Home">
            {(props) => <Home {...props} theme={theme} />}
          </Stack.Screen>

          {/* Circle feed screen - shows posts for a specific circle */}
          <Stack.Screen name="CircleFeed">
            {(props) => <CircleFeed {...props} theme={theme} />}
          </Stack.Screen>

          {/* Settings screen - user identity and preferences */}
          <Stack.Screen name="Settings">
            {(props) => <Settings {...props} theme={theme} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
