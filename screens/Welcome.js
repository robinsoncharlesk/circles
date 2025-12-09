import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { saveDisplayName, saveOnboardingComplete } from '../utils/storage';

/**
 * WELCOME SCREEN
 *
 * First-time user experience that introduces the Circles philosophy.
 * Calm, inviting, and sets the tone for mindful social connection.
 */

// Breathing circle animation for visual interest
function BreathingCircle({ color, delay }) {
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

    const timer = setTimeout(() => {
      breathe.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      breathe.stop();
    };
  }, [breathAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.decorativeCircle,
        {
          backgroundColor: color,
          transform: [{ scale: breathAnim }],
        },
      ]}
    />
  );
}

export default function Welcome({ onComplete, theme }) {
  const [displayName, setDisplayName] = useState('');

  const handleGetStarted = async () => {
    // Save display name if provided
    if (displayName.trim()) {
      await saveDisplayName(displayName.trim());
    }

    // Mark onboarding as complete
    await saveOnboardingComplete();

    // Notify parent that onboarding is done
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative breathing circles */}
          <View style={styles.decorativeCircles}>
            <BreathingCircle color={theme.circles[0].color} delay={0} />
            <BreathingCircle color={theme.circles[1].color} delay={400} />
            <BreathingCircle color={theme.circles[2].color} delay={800} />
          </View>

          {/* Main welcome content */}
          <View style={styles.content}>
            {/* Welcome header */}
            <Text style={[styles.title, { color: theme.title }]}>
              Welcome to Circles
            </Text>
            <Text style={[styles.subtitle, { color: theme.subtitle }]}>
              A different kind of social media
            </Text>

            {/* Philosophy section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                Our Philosophy
              </Text>

              <View style={styles.principlesList}>
                <View style={styles.principle}>
                  <Text style={styles.principleIcon}>🚫</Text>
                  <Text style={[styles.principleText, { color: theme.subtitle }]}>
                    No likes
                  </Text>
                </View>

                <View style={styles.principle}>
                  <Text style={styles.principleIcon}>🚫</Text>
                  <Text style={[styles.principleText, { color: theme.subtitle }]}>
                    No ads
                  </Text>
                </View>

                <View style={styles.principle}>
                  <Text style={styles.principleIcon}>🚫</Text>
                  <Text style={[styles.principleText, { color: theme.subtitle }]}>
                    No endless scrolling
                  </Text>
                </View>
              </View>

              <Text style={[styles.philosophyDescription, { color: theme.subtitle }]}>
                Just real conversations with the people who matter.
              </Text>
            </View>

            {/* Circles explanation */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                What are Circles?
              </Text>
              <Text style={[styles.description, { color: theme.subtitle }]}>
                Circles are your different social groups. Share thoughts with your
                closest friends, family updates with relatives, and professional
                insights with colleagues—all in separate, meaningful spaces.
              </Text>

              <View style={styles.circleExamples}>
                {theme.circles.map((circle) => (
                  <View key={circle.id} style={styles.circleExample}>
                    <View
                      style={[
                        styles.circleExampleDot,
                        { backgroundColor: circle.color },
                      ]}
                    />
                    <Text style={[styles.circleExampleText, { color: theme.subtitle }]}>
                      {circle.emoji} {circle.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Optional name input */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.title }]}>
                What should we call you?
              </Text>
              <Text style={[styles.description, { color: theme.subtitle }]}>
                This is optional—you can set it now or later in Settings.
              </Text>

              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: theme.selectedBg || '#FFFFFF',
                    color: theme.title,
                    borderColor: theme.subtitle,
                  },
                ]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name (optional)"
                placeholderTextColor={theme.footer}
                maxLength={30}
              />
            </View>

            {/* Get started button */}
            <TouchableOpacity
              style={[styles.getStartedButton, { backgroundColor: theme.title }]}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={[styles.getStartedText, { color: theme.background }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            {/* Footer tagline */}
            <Text style={[styles.footer, { color: theme.footer }]}>
              Connect mindfully, one circle at a time.
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  decorativeCircles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  decorativeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 48,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '300',
    marginBottom: 16,
  },
  principlesList: {
    marginBottom: 20,
  },
  principle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  principleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  principleText: {
    fontSize: 18,
    fontWeight: '400',
  },
  philosophyDescription: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  circleExamples: {
    gap: 12,
  },
  circleExample: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleExampleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  circleExampleText: {
    fontSize: 16,
    fontWeight: '400',
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  getStartedButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '300',
  },
});
