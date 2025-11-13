import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import CircleFeed from './screens/CircleFeed';

/**
 * CIRCLES - A Mindful Social Media App
 *
 * This is your navigation structure - the map of your app.
 * Users can navigate between the home screen and individual circle feeds.
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
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
