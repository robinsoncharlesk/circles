import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

/**
 * POST OPTIONS MENU
 *
 * Simple action menu for posts - Edit or Delete.
 * Only shows for the user's own posts.
 * Gentle, non-destructive design that reduces anxiety.
 */

export default function PostOptionsMenu({ visible, onClose, onEdit, onDelete, theme }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menu, { backgroundColor: theme.selectedBg }]}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onEdit();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.title }]}>
              ✏️ Edit
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.footer }]} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onDelete();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, styles.deleteText, { color: '#D94444' }]}>
              🗑️ Delete
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.footer }]} />

          <TouchableOpacity
            style={styles.option}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.subtitle }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menu: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  option: {
    padding: 18,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
    fontWeight: '500',
  },
  deleteText: {
    // Red color applied inline
  },
  divider: {
    height: 1,
    opacity: 0.1,
  },
});
