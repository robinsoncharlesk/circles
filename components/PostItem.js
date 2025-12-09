import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getRelativeTime } from '../utils/time';
import Comment from './Comment';
import CommentInput from './CommentInput';
import PostOptionsMenu from './PostOptionsMenu';

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
  displayName,
  isExpanded,
  onToggleExpand,
  onAddComment,
  onEdit,
  onDelete,
}) {
  const commentCount = post.comments?.length || 0;
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
          <View style={styles.headerLeft}>
            <Text style={[styles.author, { color: theme.title }]}>{displayName}</Text>
            <Text style={[styles.separator, { color: theme.footer }]}>•</Text>
            <Text style={[styles.timestamp, { color: theme.footer }]}>
              {getRelativeTime(post.timestamp)}
            </Text>
            {post.editedAt && (
              <Text style={[styles.editedLabel, { color: theme.footer }]}>
                (edited)
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={(e) => {
              e.stopPropagation();
              setIsMenuVisible(true);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.optionsIcon, { color: theme.subtitle }]}>⋯</Text>
          </TouchableOpacity>
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

      {/* Options menu for edit/delete */}
      <PostOptionsMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onEdit={() => onEdit && onEdit(post)}
        onDelete={() => onDelete && onDelete(post.id)}
        theme={theme}
      />
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  editedLabel: {
    fontSize: 12,
    fontWeight: '300',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  optionsButton: {
    padding: 4,
  },
  optionsIcon: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
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
