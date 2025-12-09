import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

/**
 * OPEN HANGOUT MODAL
 *
 * Enhanced Open Hangout with circle selection and optional context.
 * Makes the feature more practical and flexible for different situations.
 */

const MAX_MESSAGE_LENGTH = 120;

export default function OpenHangoutModal({
  visible,
  onClose,
  onSave,
  initialSettings,
  theme,
  availableCircles,
}) {
  const [selectedCircles, setSelectedCircles] = useState(
    initialSettings?.circles || []
  );
  const [message, setMessage] = useState(initialSettings?.message || '');

  const handleToggleCircle = (circleName) => {
    if (selectedCircles.includes(circleName)) {
      setSelectedCircles(selectedCircles.filter((c) => c !== circleName));
    } else {
      setSelectedCircles([...selectedCircles, circleName]);
    }
  };

  const handleSave = () => {
    onSave({
      circles: selectedCircles,
      message: message.trim(),
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial settings
    setSelectedCircles(initialSettings?.circles || []);
    setMessage(initialSettings?.message || '');
    onClose();
  };

  const charsRemaining = MAX_MESSAGE_LENGTH - message.length;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        {/* Dim background */}
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleCancel}
        />

        {/* Modal content */}
        <View style={[styles.modalContent, { backgroundColor: theme.selectedBg }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: theme.title }]}>
                Open to Hangout
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.subtitle }]}>
                Let people know you're free to connect
              </Text>
            </View>

            {/* Circle selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                Which circles?
              </Text>
              <Text style={[styles.sectionHint, { color: theme.footer }]}>
                Select who can see you're available
              </Text>

              <View style={styles.circleOptions}>
                {availableCircles.map((circle) => {
                  const isSelected = selectedCircles.includes(circle.name);
                  return (
                    <TouchableOpacity
                      key={circle.id}
                      style={[
                        styles.circleOption,
                        {
                          backgroundColor: isSelected
                            ? circle.color
                            : theme.background,
                          borderColor: circle.color,
                        },
                      ]}
                      onPress={() => handleToggleCircle(circle.name)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.circleEmoji}>{circle.emoji}</Text>
                      <Text
                        style={[
                          styles.circleLabel,
                          {
                            color: isSelected ? '#FFF' : theme.title,
                          },
                        ]}
                      >
                        {circle.name}
                      </Text>
                      <Text style={styles.checkbox}>
                        {isSelected ? '✓' : '○'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional message */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                Optional message
              </Text>
              <Text style={[styles.sectionHint, { color: theme.footer }]}>
                Add context about your availability
              </Text>

              <TextInput
                style={[
                  styles.messageInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.title,
                    borderColor: theme.footer,
                  },
                ]}
                placeholder="e.g., 'Free tonight after 7pm' or 'Coffee break!'"
                placeholderTextColor={theme.footer}
                value={message}
                onChangeText={setMessage}
                maxLength={MAX_MESSAGE_LENGTH}
                multiline
              />

              {message.length > 0 && (
                <Text
                  style={[
                    styles.charCounter,
                    {
                      color:
                        charsRemaining < 20 ? '#D64545' : theme.footer,
                    },
                  ]}
                >
                  {charsRemaining} characters remaining
                </Text>
              )}
            </View>

            {/* Example use cases (helpful hints) */}
            {selectedCircles.length === 0 && message.length === 0 && (
              <View style={styles.examples}>
                <Text style={[styles.examplesTitle, { color: theme.subtitle }]}>
                  Example use cases:
                </Text>
                <Text style={[styles.exampleText, { color: theme.footer }]}>
                  • Hometown visit: Open to "Inner Circle", message: "In Durham
                  this weekend!"
                </Text>
                <Text style={[styles.exampleText, { color: theme.footer }]}>
                  • Spontaneous: Open to "Friends", message: "Free tonight after
                  7pm"
                </Text>
                <Text style={[styles.exampleText, { color: theme.footer }]}>
                  • Networking: Open to "Work", message: "Coffee break near
                  downtown"
                </Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: theme.subtitle }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  {
                    backgroundColor:
                      selectedCircles.length === 0 ? theme.footer : theme.title,
                    opacity: selectedCircles.length === 0 ? 0.4 : 1,
                  },
                ]}
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={selectedCircles.length === 0}
              >
                <Text style={styles.saveButtonText}>
                  {selectedCircles.length > 0 ? 'Open to Hangout' : 'Select Circles'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    fontWeight: '300',
    marginBottom: 12,
  },
  circleOptions: {
    gap: 10,
  },
  circleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  circleEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  circleLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
  },
  checkbox: {
    fontSize: 18,
    color: '#FFF',
  },
  messageInput: {
    minHeight: 80,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: '300',
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  examples: {
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    // backgroundColor comes from dynamic theme
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '400',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFF',
  },
});
