import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { loadDisplayName, saveDisplayName } from '../utils/storage';

export default function Settings({ navigation, route }) {
  const { theme } = route.params;
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadName();
  }, []);

  const loadName = async () => {
    const name = await loadDisplayName();
    if (name) {
      setDisplayName(name);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      return;
    }
    setIsSaving(true);
    await saveDisplayName(displayName.trim());
    setIsSaving(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.title }]}>Your Identity</Text>
          <Text style={[styles.subtitle, { color: theme.subtitle }]}>
            This is how you'll appear on posts and comments.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.title }]}>Display Name</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.cardBackground || '#FFFFFF',
                color: theme.title,
                borderColor: theme.subtitle
              }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name..."
              placeholderTextColor={theme.subtitle}
              maxLength={30}
              autoFocus={true}
            />
            <Text style={[styles.charCount, { color: theme.subtitle }]}>
              {displayName.length}/30
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.title },
              !displayName.trim() && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!displayName.trim() || isSaving}
          >
            <Text style={[styles.saveButtonText, { color: theme.background }]}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: theme.subtitle }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 14,
    textAlign: 'right',
  },
  saveButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});
