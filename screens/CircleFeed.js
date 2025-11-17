import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import PostCreationModal from '../components/PostCreationModal';
import PostItem from '../components/PostItem';
import { loadPosts, savePosts, loadDisplayName } from '../utils/storage';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * CIRCLE FEED SCREEN
 *
 * Enhanced with smooth animations, loading states, and polished UX.
 * This is where users see posts from a specific circle and can create new ones.
 * It feels like a shared journal with close friends, not a broadcast platform.
 *
 * Now with:
 * - Local persistence (posts survive restarts)
 * - Smooth fade-in animations
 * - Loading states with spinners
 * - Warm, encouraging empty states
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

/**
 * Get warm, contextual empty state messages for each circle
 */
function getEmptyStateMessage(circleName) {
  const messages = {
    'Inner Circle': {
      title: 'Your closest connections',
      subtitle: 'Share what matters most with those who know you best.',
    },
    Family: {
      title: 'Keep family connected',
      subtitle: 'Share moments, thoughts, and love with those who raised you.',
    },
    Friends: {
      title: 'Real friends, real conversations',
      subtitle: 'Share life with people who get you.',
    },
    Work: {
      title: 'Connect beyond the office',
      subtitle: 'Build genuine relationships with colleagues.',
    },
  };

  return messages[circleName] || {
    title: `Start sharing with ${circleName}`,
    subtitle: 'This is your space for meaningful connections.',
  };
}

export default function CircleFeed({ route, navigation, theme }) {
  // Get the circle data and hangout settings passed from home screen
  const { circle, hangoutSettings } = route.params;

  // Check if you're "open" to this circle
  const isOpenToThis = hangoutSettings?.circles?.includes(circle.name);

  // State for posts in this circle
  const [posts, setPosts] = useState([]);

  // State for post creation modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for which post is expanded (null if none)
  const [expandedPostId, setExpandedPostId] = useState(null);

  // State for tracking if posts have been loaded from storage
  const [isLoaded, setIsLoaded] = useState(false);

  // State for user's display name
  const [displayName, setDisplayName] = useState('You');

  // Load display name when component mounts
  useEffect(() => {
    async function loadName() {
      const name = await loadDisplayName();
      setDisplayName(name);
    }
    loadName();
  }, []);

  // Load posts from storage when component mounts
  useEffect(() => {
    async function loadStoredPosts() {
      const storedPosts = await loadPosts(circle.name);
      setPosts(storedPosts);

      // Small delay before showing content for smooth transition
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
    }

    loadStoredPosts();
  }, [circle.name]);

  // Save posts to storage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      savePosts(circle.name, posts);
    }
  }, [posts, circle.name, isLoaded]);

  // Handle creating a new post with animation
  const handleCreatePost = (text) => {
    // Configure smooth layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newPost = {
      id: Date.now().toString(),
      text: text,
      timestamp: new Date().toISOString(),
      author: 'You',
      comments: [], // Initialize empty comments array
    };

    // Add to beginning of posts array (newest first)
    setPosts([newPost, ...posts]);
  };

  // Handle toggling post expansion with animation
  const handleToggleExpand = (postId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // Handle adding a comment to a post with animation
  const handleAddComment = (postId, commentText) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString(),
      author: displayName,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );
  };

  const emptyMessage = getEmptyStateMessage(circle.name);

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
          <Text style={styles.headerEmoji}>{circle.emoji}</Text>
          <Text style={[styles.headerTitle, { color: theme.title }]}>
            {circle.name}
          </Text>
        </View>

        {/* Spacer to center the title */}
        <View style={styles.backButton} />
      </View>

      {/* Loading state */}
      {!isLoaded ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={circle.color} />
          <Text style={[styles.loadingText, { color: theme.subtitle }]}>
            Loading your thoughts...
          </Text>
        </View>
      ) : (
        <>
          {/* Posts feed or empty state */}
          <ScrollView
            style={styles.feedContainer}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Availability banner when you're "open" to this circle */}
            {isOpenToThis && (
              <View
                style={[styles.availabilityBanner, { backgroundColor: circle.color }]}
              >
                <Text style={styles.availabilityEmoji}>✨</Text>
                <View style={styles.availabilityTextContainer}>
                  <Text style={styles.availabilityTitle}>
                    You're open to hangout with {circle.name}
                  </Text>
                  {hangoutSettings.message && (
                    <Text style={styles.availabilityMessage}>
                      "{hangoutSettings.message}"
                    </Text>
                  )}
                </View>
              </View>
            )}

            {posts.length === 0 ? (
              // Empty state
              <View style={styles.emptyState}>
                <BreathingEmoji emoji={circle.emoji} />

                <Text style={[styles.emptyTitle, { color: theme.title }]}>
                  {emptyMessage.title}
                </Text>

                <Text style={[styles.emptySubtitle, { color: theme.subtitle }]}>
                  {emptyMessage.subtitle}
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: theme.subtitle, marginTop: 12 },
                  ]}
                >
                  Tap the button below to share your first thought.
                </Text>
              </View>
            ) : (
              // Posts list
              <View style={styles.postsList}>
                {posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    theme={theme}
                    displayName={displayName}
                    isExpanded={expandedPostId === post.id}
                    onToggleExpand={() => handleToggleExpand(post.id)}
                    onAddComment={(commentText) =>
                      handleAddComment(post.id, commentText)
                    }
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Floating 'Share Something' button */}
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: circle.color }]}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingButtonText}>✏️ Share Something</Text>
          </TouchableOpacity>

          {/* Post creation modal */}
          <PostCreationModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onPost={handleCreatePost}
            theme={theme}
            circleName={circle.name}
          />
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '300',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100, // Space for floating button
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 24,
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
  postsList: {
    padding: 20,
    paddingBottom: 100, // Space for floating button
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  availabilityTextContainer: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFF',
    marginBottom: 4,
  },
  availabilityMessage: {
    fontSize: 14,
    fontWeight: '300',
    color: '#FFF',
    fontStyle: 'italic',
    opacity: 0.95,
  },
});
