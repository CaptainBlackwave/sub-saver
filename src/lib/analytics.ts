import { ClusteredSubscription, DashboardStats, Transaction, Subscription } from '../types/subscriptions';
import { mockTransactions, subscriptionTemplates } from './data';

function normalizeMerchantName(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

function findMatchingTemplate(merchantName: string): Subscription | undefined {
  const normalized = normalizeMerchantName(merchantName);
  return subscriptionTemplates.find(t => 
    t.merchantVariants.some(v => normalizeMerchantName(v) === normalized || normalized.includes(normalizeMerchantName(v)))
  );
}

export function clusterTransactions(transactions: Transaction[]): ClusteredSubscription[] {
  const clusters = new Map<string, ClusteredSubscription>();

  for (const tx of transactions) {
    const template = findMatchingTemplate(tx.merchantName);
    
    if (template) {
      if (!clusters.has(template.id)) {
        clusters.set(template.id, {
          ...template,
          transactions: [],
          totalSpent: 0,
          ghostScore: 0,
          status: 'active'
        });
      }
      const cluster = clusters.get(template.id)!;
      cluster.transactions.push(tx);
      cluster.totalSpent += tx.amount;
    }
  }

  return Array.from(clusters.values());
}

export function calculateGhostScore(subscription: ClusteredSubscription): number {
  if (!subscription.lastUsedDate) return 0;
  
  const now = new Date('2026-03-18');
  const lastUsed = new Date(subscription.lastUsedDate);
  const daysSinceUsed = Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
  
  const maxDaysInMonth = 30;
  const usageRatio = Math.max(0, 1 - (daysSinceUsed / maxDaysInMonth));
  
  return usageRatio;
}

export function determineStatus(subscription: ClusteredSubscription): 'active' | 'ghost' | 'warning' | 'healthy' {
  const score = calculateGhostScore(subscription);
  
  if (score === 0) return 'ghost';
  if (score < 0.3) return 'warning';
  if (score > 0.7) return 'healthy';
  return 'active';
}

export function getDaysUntilRenewal(nextBillingDate: string): number {
  const now = new Date('2026-03-18');
  const billing = new Date(nextBillingDate);
  return Math.floor((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function analyzeSubscriptions(): DashboardStats {
  const clustered = clusterTransactions(mockTransactions);
  
  const analyzed = clustered.map(sub => {
    const ghostScore = calculateGhostScore(sub);
    const status = determineStatus(sub);
    return { ...sub, ghostScore, status };
  });

  const totalMonthly = analyzed.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;
  const ghostCount = analyzed.filter(sub => sub.status === 'ghost').length;
  
  const upcomingRenewals = analyzed
    .filter(sub => getDaysUntilRenewal(sub.nextBillingDate) <= 48 && getDaysUntilRenewal(sub.nextBillingDate) > 0)
    .sort((a, b) => getDaysUntilRenewal(a.nextBillingDate) - getDaysUntilRenewal(b.nextBillingDate));

  return {
    totalMonthly,
    totalAnnual,
    subscriptionCount: analyzed.length,
    ghostCount,
    upcomingRenewals,
    subscriptions: analyzed
  };
}

export type { ClusteredSubscription };
