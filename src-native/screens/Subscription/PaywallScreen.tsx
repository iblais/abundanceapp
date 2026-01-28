/**
 * Abundance Recode - Paywall Screen
 *
 * Premium subscription options with elegant design
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenWrapper,
  GlassCard,
  H2,
  H3,
  H4,
  Body,
  BodySmall,
  Label,
  LabelSmall,
  Icon,
  Button,
} from '@components/common';
import { useAppTheme } from '@theme/ThemeContext';
import { useUserStore } from '@store/useUserStore';
import { spacing, borderRadius, sizing } from '@theme/spacing';
import { RootStackParamList } from '@navigation/types';

type PaywallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;

interface PlanOption {
  id: string;
  title: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: 'yearly',
    title: 'Annual',
    price: '$59.99',
    period: '/year',
    savings: 'Save 50%',
    isPopular: true,
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
  },
];

const FEATURES = [
  'Unlimited guided meditations',
  'All identity-shifting exercises',
  'Full Inner Mentor access',
  'Advanced progress analytics',
  'Premium soundscapes',
  'Ad-free experience',
];

interface PlanCardProps {
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
      <GlassCard
        variant={isSelected ? 'accent' : 'light'}
        style={[
          styles.planCard,
          isSelected && {
            borderColor: theme.colors.accent.gold,
            borderWidth: 2,
          },
        ]}
      >
        {plan.isPopular && (
          <View
            style={[
              styles.popularBadge,
              { backgroundColor: theme.colors.accent.gold },
            ]}
          >
            <LabelSmall color={theme.colors.neutral.gray900}>
              Most Popular
            </LabelSmall>
          </View>
        )}
        <View style={styles.planContent}>
          <View style={styles.planHeader}>
            <H4>{plan.title}</H4>
            {isSelected && (
              <View
                style={[
                  styles.checkCircle,
                  { backgroundColor: theme.colors.accent.gold },
                ]}
              >
                <Icon
                  name="check"
                  size={sizing.iconXs}
                  color={theme.colors.neutral.gray900}
                />
              </View>
            )}
          </View>
          <View style={styles.planPrice}>
            <H2>{plan.price}</H2>
            <BodySmall color={theme.colors.text.tertiary}>
              {plan.period}
            </BodySmall>
          </View>
          {plan.savings && (
            <View
              style={[
                styles.savingsBadge,
                { backgroundColor: theme.colors.semantic.success + '20' },
              ]}
            >
              <LabelSmall color={theme.colors.semantic.success}>
                {plan.savings}
              </LabelSmall>
            </View>
          )}
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
      {/* Header */}
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
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: theme.colors.accent.goldSoft },
            ]}
          >
            <Icon
              name="sparkle"
              size={sizing.iconXl}
              color={theme.colors.accent.gold}
            />
          </View>
          <H2 align="center" style={styles.heroTitle}>
            Unlock Your Full Potential
          </H2>
          <Body
            align="center"
            color={theme.colors.text.secondary}
            style={styles.heroSubtitle}
          >
            Access the complete Abundance Recode experience and transform your
            reality.
          </Body>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View
                style={[
                  styles.featureCheck,
                  { backgroundColor: theme.colors.accent.goldSoft },
                ]}
              >
                <Icon
                  name="check"
                  size={sizing.iconXs}
                  color={theme.colors.accent.gold}
                />
              </View>
              <Body color={theme.colors.text.secondary}>{feature}</Body>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerSpacer: {
    width: 44,
  },
  closeButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    maxWidth: 280,
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  plansSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    paddingVertical: spacing.lg,
    position: 'relative',
    overflow: 'visible',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  planContent: {},
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
    marginTop: spacing.sm,
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
