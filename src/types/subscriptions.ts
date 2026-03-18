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
  status: 'active' | 'ghost' | 'warning' | 'healthy';
  suggestedTier?: TierOption;
  potentialSavings?: number;
}

export interface DashboardStats {
  totalMonthly: number;
  totalAnnual: number;
  subscriptionCount: number;
  ghostCount: number;
  upcomingRenewals: ClusteredSubscription[];
  subscriptions: ClusteredSubscription[];
}
