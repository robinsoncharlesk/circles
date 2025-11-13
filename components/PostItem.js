import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getRelativeTime } from '../utils/time';
import Comment from './Comment';
import CommentInput from './CommentInput';

/**
 * POST ITEM
 *
 * Displays a single post in a circle's feed.
 * Tap to expand and see comments - feels like unfolding a conversation.
 * Clean, readable, journal-like - not screaming for attention.
 */

export default function PostItem({
  post,
  theme,
  isExpanded,
  onToggleExpand,
  onAddComment,
}) {
  const commentCount = post.comments?.length || 0;

  return (
    <View style={styles.wrapper}>
      {/* Main post - tappable to expand/collapse */}
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.selectedBg }]}
        onPress={onToggleExpand}
        activeOpacity={0.9}
      >
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

        {/* Comment indicator */}
        {commentCount > 0 && (
          <Text style={[styles.commentHint, { color: theme.footer }]}>
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Text>
        )}

        {/* Expand hint */}
        {!isExpanded && (
          <Text style={[styles.expandHint, { color: theme.footer }]}>
            Tap to {commentCount > 0 ? 'view comments' : 'add a comment'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Expanded section - comments and input */}
      {isExpanded && (
        <View style={styles.expandedSection}>
          {/* Existing comments */}
          {post.comments?.map((comment) => (
            <Comment key={comment.id} comment={comment} theme={theme} />
          ))}

          {/* Comment input */}
          <CommentInput
            onSubmit={(text) => onAddComment(text)}
            theme={theme}
          />

          {/* Collapse hint */}
          <TouchableOpacity
            style={styles.collapseButton}
            onPress={onToggleExpand}
            activeOpacity={0.7}
          >
            <Text style={[styles.collapseText, { color: theme.footer }]}>
              Tap post to collapse
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    padding: 20,
    borderRadius: 16,
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
  commentHint: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 12,
  },
  expandHint: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 6,
    fontStyle: 'italic',
  },
  expandedSection: {
    paddingTop: 8,
  },
  collapseButton: {
    marginTop: 12,
    marginLeft: 20,
    paddingVertical: 8,
  },
  collapseText: {
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'italic',
  },
});
