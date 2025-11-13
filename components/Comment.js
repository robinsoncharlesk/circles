import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRelativeTime } from '../utils/time';

/**
 * COMMENT COMPONENT
 *
 * Individual comment displayed as a warm, conversational bubble.
 * Like passing notes to friends - supportive, not debate-focused.
 */

export default function Comment({ comment, theme }) {
  return (
    <View style={styles.container}>
      {/* Connecting line - visual link to parent post */}
      <View style={[styles.connector, { backgroundColor: theme.footer }]} />

      {/* Comment bubble */}
      <View style={[styles.bubble, { backgroundColor: theme.selectedBg }]}>
        {/* Comment header - author and time */}
        <View style={styles.header}>
          <Text style={[styles.author, { color: theme.title }]}>
            {comment.author}
          </Text>
          <Text style={[styles.separator, { color: theme.footer }]}>•</Text>
          <Text style={[styles.timestamp, { color: theme.footer }]}>
            {getRelativeTime(comment.timestamp)}
          </Text>
        </View>

        {/* Comment text */}
        <Text style={[styles.text, { color: theme.subtitle }]}>
          {comment.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginLeft: 20, // Indent to show nesting
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  connector: {
    width: 2,
    height: '100%',
    marginRight: 12,
    borderRadius: 1,
    opacity: 0.3,
  },
  bubble: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
  },
  separator: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '300',
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 20,
  },
});
