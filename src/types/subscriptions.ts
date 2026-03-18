export interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
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
}

export interface ClusteredSubscription extends Subscription {
  transactions: Transaction[];
  totalSpent: number;
  ghostScore: number;
  status: 'active' | 'ghost' | 'warning' | 'healthy';
}

export interface DashboardStats {
  totalMonthly: number;
  totalAnnual: number;
  subscriptionCount: number;
  ghostCount: number;
  upcomingRenewals: ClusteredSubscription[];
  subscriptions: ClusteredSubscription[];
}
