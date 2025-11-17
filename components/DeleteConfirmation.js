import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

/**
 * DELETE CONFIRMATION MODAL
 *
 * A gentle confirmation dialog before deleting posts or comments.
 * Reduces anxiety by preventing accidental deletions.
 */

export default function DeleteConfirmation({ visible, onClose, onConfirm, theme, type = 'post' }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.selectedBg }]}>
          <Text style={[styles.title, { color: theme.title }]}>
            Delete this {type}?
          </Text>
          <Text style={[styles.message, { color: theme.subtitle }]}>
            This can't be undone. Your {type} will be permanently removed.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: theme.title }]}>
                Keep it
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  container: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  deleteButton: {
    backgroundColor: '#D94444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
});
