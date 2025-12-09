import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * UNREAD BADGE
 *
 * A gentle, non-intrusive badge showing unread post counts.
 * Informative, not manipulative. Calm design that respects attention.
 */

export default function UnreadBadge({ count, theme }) {
  if (count === 0) {
    return null; // Don't show badge if no unread posts
  }

  // Cap display at 9+ for cleaner look
  const displayCount = count > 9 ? '9+' : count.toString();

  return (
    <View style={[styles.badge, { backgroundColor: theme.title }]}>
      <Text style={[styles.badgeText, { color: theme.background }]}>
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
