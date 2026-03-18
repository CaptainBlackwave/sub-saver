export interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
}

export interface TierOption {
  name: string;
  price: number;
  savings: number;
}

export interface Subscription {
  id: string;
  name: string;
  merchantVariants: string[];
  monthlyCost: number;
  billingCycle: number;
  nextBillingDate: string;
  lastUsedDate?: string;
  category: string;
  logo?: string;
  cancelUrl?: string;
  websiteUrl?: string;
  tiers?: TierOption[];
  usageHistory?: number[];
}

export interface ClusteredSubscription extends Subscription {
  transactions: Transaction[];
  totalSpent: number;
  ghostScore: number;
  riskScore: number;
  status: 'active' | 'ghost' | 'warning' | 'healthy' | 'pending_cancel' | 'zombie' | 'trial';
  suggestedTier?: TierOption;
  potentialSavings?: number;
  cancelDate?: string;
}

export interface DashboardStats {
  totalMonthly: number;
  totalAnnual: number;
  subscriptionCount: number;
  ghostCount: number;
  upcomingRenewals: ClusteredSubscription[];
  subscriptions: ClusteredSubscription[];
  foundMoneyTotal: number;
  categorySpending: CategorySpending[];
  healthScore: number;
  trials: TrialSubscription[];
  goalProgress: GoalProgress;
}

export interface CategorySpending {
  category: string;
  totalMonthly: number;
  subscriptionCount: number;
  subscriptions: string[];
  insight?: string;
}

export interface ZombieAlert {
  subscriptionId: string;
  subscriptionName: string;
  originalCharge: number;
  zombieChargeDate: string;
  daysSinceCancel: number;
}

export interface UserCancellations {
  [subscriptionId: string]: {
    cancelDate: string;
    expectedSavings: number;
  };
}

export interface TrialSubscription {
  id: string;
  name: string;
  merchantName: string;
  monthlyCostAfterTrial: number;
  trialEndDate: string;
  daysUntilExpiry: number;
  logo?: string;
}

export interface GoalProgress {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  percentComplete: number;
  ghostsNeeded: number;
}

export interface NegotiationScript {
  subscriptionName: string;
  script: string;
  talkingPoints: string[];
  expectedSavings: number;
}
