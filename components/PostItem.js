import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRelativeTime } from '../utils/time';

/**
 * POST ITEM
 *
 * Displays a single post in a circle's feed.
 * Clean, readable, journal-like - not screaming for attention.
 */

export default function PostItem({ post, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.selectedBg }]}>
      {/* Post header - author and time */}
      <View style={styles.header}>
        <Text style={[styles.author, { color: theme.title }]}>You</Text>
        <Text style={[styles.separator, { color: theme.footer }]}>•</Text>
        <Text style={[styles.timestamp, { color: theme.footer }]}>
          {getRelativeTime(post.timestamp)}
        </Text>
      </View>

      {/* Post content */}
      <Text style={[styles.content, { color: theme.title }]}>
        {post.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    fontSize: 15,
    fontWeight: '500',
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '300',
  },
  content: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
  },
});
