/**
 * RevenueCat Integration Service
 * Handles subscription management, purchases, and entitlement checks
 */

// RevenueCat API Configuration
// TODO: Replace with actual API keys from RevenueCat dashboard
const REVENUECAT_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || 'your_api_key_here';

// Subscription Plans
export const PLANS = {
  MONTHLY: {
    id: 'abundance_monthly',
    price: '$14.99',
    period: 'per month',
    priceValue: 14.99,
  },
  ANNUAL: {
    id: 'abundance_annual',
    price: '$99.99',
    period: 'per year',
    priceValue: 99.99,
    savings: '30%',
  },
};

// Premium Features List
export const PREMIUM_FEATURES = [
  'Access to all 50+ Guided Meditations',
  'Full Audiobook Library',
  'Unlimited Inner Mentor Chat',
  'Advanced Progress Analytics',
  'Exclusive Soundscapes & Visualizations',
  'All future content included',
];

// Subscription Status Interface
export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: 'monthly' | 'annual' | null;
  expiresAt: string | null;
  willRenew: boolean;
}

// Customer Info Interface
export interface CustomerInfo {
  originalAppUserId: string;
  entitlements: {
    active: Record<string, {
      identifier: string;
      productIdentifier: string;
      expiresDate: string | null;
      willRenew: boolean;
    }>;
  };
  activeSubscriptions: string[];
}

// Mock customer info for development
const getMockCustomerInfo = (userId: string): CustomerInfo => {
  const savedStatus = typeof window !== 'undefined'
    ? localStorage.getItem('subscriptionStatus')
    : null;

  if (savedStatus) {
    const status = JSON.parse(savedStatus);
    if (status.isSubscribed) {
      return {
        originalAppUserId: userId,
        entitlements: {
          active: {
            premium: {
              identifier: 'premium',
              productIdentifier: status.plan === 'annual' ? PLANS.ANNUAL.id : PLANS.MONTHLY.id,
              expiresDate: status.expiresAt,
              willRenew: status.willRenew,
            },
          },
        },
        activeSubscriptions: [status.plan === 'annual' ? PLANS.ANNUAL.id : PLANS.MONTHLY.id],
      };
    }
  }

  return {
    originalAppUserId: userId,
    entitlements: { active: {} },
    activeSubscriptions: [],
  };
};

/**
 * RevenueCat Service
 * Provides methods for subscription management
 */
export const revenueCatService = {
  /**
   * Initialize RevenueCat SDK
   * Call this on app startup
   */
  async initialize(userId?: string): Promise<void> {
    try {
      // TODO: Implement actual RevenueCat SDK initialization
      // import Purchases from '@revenuecat/purchases-js';
      // await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      // if (userId) {
      //   await Purchases.logIn(userId);
      // }
      console.log('RevenueCat: Initialized with user:', userId || 'anonymous');
    } catch (error) {
      console.error('RevenueCat initialization error:', error);
      throw error;
    }
  },

  /**
   * Get current customer info and subscription status
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      // TODO: Implement actual RevenueCat SDK call
      // import Purchases from '@revenuecat/purchases-js';
      // const customerInfo = await Purchases.getCustomerInfo();
      // return customerInfo;

      // Mock implementation for development
      const userId = typeof window !== 'undefined'
        ? localStorage.getItem('revenueCatUserId') || 'anonymous_user'
        : 'anonymous_user';
      return getMockCustomerInfo(userId);
    } catch (error) {
      console.error('RevenueCat getCustomerInfo error:', error);
      throw error;
    }
  },

  /**
   * Check if user has active premium subscription
   */
  async checkSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements.active['premium'];

      if (premiumEntitlement) {
        const isAnnual = premiumEntitlement.productIdentifier === PLANS.ANNUAL.id;
        return {
          isSubscribed: true,
          plan: isAnnual ? 'annual' : 'monthly',
          expiresAt: premiumEntitlement.expiresDate,
          willRenew: premiumEntitlement.willRenew,
        };
      }

      return {
        isSubscribed: false,
        plan: null,
        expiresAt: null,
        willRenew: false,
      };
    } catch (error) {
      console.error('RevenueCat checkSubscriptionStatus error:', error);
      return {
        isSubscribed: false,
        plan: null,
        expiresAt: null,
        willRenew: false,
      };
    }
  },

  /**
   * Purchase a subscription package
   */
  async purchasePackage(planType: 'monthly' | 'annual'): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
      // TODO: Implement actual RevenueCat SDK purchase
      // import Purchases from '@revenuecat/purchases-js';
      // const offerings = await Purchases.getOfferings();
      // const package = planType === 'annual'
      //   ? offerings.current?.annual
      //   : offerings.current?.monthly;
      // if (package) {
      //   const { customerInfo } = await Purchases.purchasePackage(package);
      //   return { success: true, customerInfo };
      // }

      // Mock implementation - simulate successful purchase
      console.log(`RevenueCat: Initiating ${planType} subscription purchase`);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save mock subscription status
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + (planType === 'annual' ? 1 : 0));
      expiresAt.setMonth(expiresAt.getMonth() + (planType === 'monthly' ? 1 : 0));

      const status: SubscriptionStatus = {
        isSubscribed: true,
        plan: planType,
        expiresAt: expiresAt.toISOString(),
        willRenew: true,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('subscriptionStatus', JSON.stringify(status));
      }

      return {
        success: true,
        customerInfo: getMockCustomerInfo('user'),
      };
    } catch (error) {
      console.error('RevenueCat purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      };
    }
  },

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
      // TODO: Implement actual RevenueCat SDK restore
      // import Purchases from '@revenuecat/purchases-js';
      // const customerInfo = await Purchases.restorePurchases();
      // return { success: true, customerInfo };

      console.log('RevenueCat: Restoring purchases');

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if there's a stored subscription
      const customerInfo = getMockCustomerInfo('user');
      const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;

      if (hasActiveSubscription) {
        return { success: true, customerInfo };
      }

      return {
        success: false,
        error: 'No previous purchases found',
      };
    } catch (error) {
      console.error('RevenueCat restore error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      };
    }
  },

  /**
   * Cancel subscription (redirects to platform subscription management)
   */
  async manageSubscription(): Promise<void> {
    // This typically opens the platform's subscription management page
    // For web, this might redirect to a billing portal
    // For mobile, this opens the App Store / Play Store subscription settings

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      window.open('https://apps.apple.com/account/subscriptions', '_blank');
    } else if (isAndroid) {
      window.open('https://play.google.com/store/account/subscriptions', '_blank');
    } else {
      // Web fallback - open billing portal or show instructions
      console.log('RevenueCat: Opening subscription management');
      alert('To manage your subscription, please visit your app store account settings.');
    }
  },
};

export default revenueCatService;
