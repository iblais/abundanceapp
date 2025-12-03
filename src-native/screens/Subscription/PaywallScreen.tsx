/**
 * Abundance Flow - Premium Paywall Screen
 *
 * Matches reference with:
 * - Title "Unlock Your Full Potential" centered at top
 * - Subtitle about becoming the version of you
 * - Two side-by-side glass pricing cards (Monthly / Annual)
 * - "Best Value" gold ribbon on Annual card
 * - Feature list with gold checkmarks
 * - Gold gradient "Start Free Trial" button at bottom
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H2,
  H3,
  Body,
  BodySmall,
  Icon,
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing, layout } from '@theme/spacing';
import { textStyles } from '@theme/typography';
import { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - layout.screenPaddingHorizontal * 2 - spacing.md) / 2;

type PaywallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;

interface PlanOption {
  id: string;
  title: string;
  price: string;
  period: string;
  isBestValue?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
  },
  {
    id: 'yearly',
    title: 'Annual',
    price: '$79.99',
    period: '/year',
    isBestValue: true,
  },
];

const FEATURES = [
  'Unlimited meditations',
  'Inner Mentor AI',
  'Reality Shift Board',
  'Learn & Grow library',
];

interface PlanCardProps {
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={styles.planCardWrapper}
    >
      {/* Best Value ribbon */}
      {plan.isBestValue && (
        <View style={styles.ribbonContainer}>
          <LinearGradient
            colors={[theme.colors.accent.gold, theme.colors.accent.goldDark || '#B8973D']}
            style={styles.ribbon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.ribbonText, { color: theme.colors.text.inverse }]}>
              Best{'\n'}Value
            </Text>
          </LinearGradient>
        </View>
      )}

      <GlassCard
        variant={isSelected ? 'accent' : 'light'}
        style={[
          styles.planCard,
          isSelected && {
            borderColor: theme.colors.accent.gold,
            borderWidth: 2,
          },
        ]}
        padding="lg"
      >
        <View style={styles.planContent}>
          {/* Plan title */}
          <Body color={theme.colors.text.secondary} style={styles.planTitle}>
            {plan.title}
          </Body>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[textStyles.h1, styles.priceText, { color: theme.colors.text.primary }]}>
              {plan.price}
            </Text>
            <BodySmall color={theme.colors.text.muted}>{plan.period}</BodySmall>
          </View>

          {/* Features */}
          <View style={styles.planFeatures}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.planFeatureRow}>
                <Icon
                  name="check"
                  size={14}
                  color={theme.colors.accent.gold}
                />
                <BodySmall
                  color={theme.colors.text.secondary}
                  style={styles.planFeatureText}
                >
                  {feature}
                </BodySmall>
              </View>
            ))}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

export const PaywallScreen: React.FC = () => {
  const navigation = useNavigation<PaywallNavigationProp>();
  const theme = useAppTheme();
  const { upgradeToPremium } = useUserStore();

  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    // Simulate purchase flow
    // In production, this would integrate with IAP
    setTimeout(() => {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      upgradeToPremium(expiresAt.toISOString());
      setIsLoading(false);
      navigation.goBack();
    }, 1500);
  };

  const handleRestorePurchases = () => {
    // Would restore IAP purchases
    console.log('Restore purchases');
  };

  return (
    <ScreenWrapper padded={false}>
      {/* Header with close button */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon
            name="close"
            size={sizing.iconBase}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <H2 align="center" style={styles.heroTitle}>
            Unlock Your Full{'\n'}Potential
          </H2>
          <Body
            align="center"
            color={theme.colors.text.secondary}
            style={styles.heroSubtitle}
          >
            Become the version of you who{'\n'}effortlessly receives abundance
          </Body>
        </View>

        {/* Side-by-side Plan Cards */}
        <View style={styles.plansRow}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        {/* Subscribe Button */}
        <View style={styles.buttonSection}>
          <Button
            title="Start Free Trial"
            onPress={handleSubscribe}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
          />
          <BodySmall
            align="center"
            color={theme.colors.text.muted}
            style={styles.trialNote}
          >
            7-day free trial, then{' '}
            {PLANS.find((p) => p.id === selectedPlan)?.price}
            {PLANS.find((p) => p.id === selectedPlan)?.period}
          </BodySmall>
        </View>

        {/* Restore Purchases */}
        <TouchableOpacity
          onPress={handleRestorePurchases}
          style={styles.restoreButton}
        >
          <BodySmall color={theme.colors.text.tertiary}>
            Restore Purchases
          </BodySmall>
        </TouchableOpacity>

        {/* Legal */}
        <View style={styles.legalSection}>
          <BodySmall
            align="center"
            color={theme.colors.text.muted}
            style={styles.legalText}
          >
            By subscribing, you agree to our Terms of Service and Privacy
            Policy. Subscription automatically renews unless auto-renew is
            turned off at least 24 hours before the end of the current period.
          </BodySmall>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.md,
  },
  headerSpacer: {
    width: 44,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing['3xl'],
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  heroTitle: {
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    maxWidth: 280,
  },
  plansRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  planCardWrapper: {
    flex: 1,
    position: 'relative',
  },
  ribbonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  ribbon: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    transform: [{ rotate: '15deg' }],
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 12,
  },
  planCard: {
    flex: 1,
    minHeight: 220,
  },
  planContent: {
    alignItems: 'center',
  },
  planTitle: {
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  planFeatures: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  planFeatureText: {
    flex: 1,
    fontSize: 13,
  },
  buttonSection: {
    marginBottom: spacing.lg,
  },
  trialNote: {
    marginTop: spacing.sm,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  legalSection: {
    marginTop: spacing.lg,
  },
  legalText: {
    lineHeight: 18,
  },
});

export default PaywallScreen;
