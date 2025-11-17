import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * STORAGE UTILITIES
 *
 * Local persistence for posts and comments using AsyncStorage.
 * Makes the app feel real - your content survives app restarts.
 */

const STORAGE_PREFIX = '@circles_posts_';

/**
 * Save posts for a specific circle to local storage
 */
export async function savePosts(circleName, posts) {
  try {
    const key = `${STORAGE_PREFIX}${circleName}`;
    const jsonValue = JSON.stringify(posts);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving posts:', error);
    // Fail silently - don't crash the app if storage fails
  }
}

/**
 * Load posts for a specific circle from local storage
 */
export async function loadPosts(circleName) {
  try {
    const key = `${STORAGE_PREFIX}${circleName}`;
    const jsonValue = await AsyncStorage.getItem(key);

    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }

    return []; // Return empty array if no posts found
  } catch (error) {
    console.error('Error loading posts:', error);
    return []; // Return empty array on error
  }
}

/**
 * Clear all posts for a specific circle (useful for testing/debugging)
 */
export async function clearPosts(circleName) {
  try {
    const key = `${STORAGE_PREFIX}${circleName}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing posts:', error);
  }
}

/**
 * Clear all data (useful for reset/logout)
 */
export async function clearAllData() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const circleKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
    await AsyncStorage.multiRemove(circleKeys);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

/**
 * Save user's display name
 */
export async function saveDisplayName(name) {
  try {
    await AsyncStorage.setItem('@circles_display_name', name);
  } catch (error) {
    console.error('Error saving display name:', error);
  }
}

/**
 * Load user's display name
 */
export async function loadDisplayName() {
  try {
    const name = await AsyncStorage.getItem('@circles_display_name');
    return name || 'You'; // Default to "You" if no name set
  } catch (error) {
    console.error('Error loading display name:', error);
    return 'You';
  }
}
