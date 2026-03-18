import { ClusteredSubscription, DashboardStats, Transaction, Subscription, TierOption, CategorySpending, ZombieAlert, UserCancellations, TrialSubscription, GoalProgress, NegotiationScript } from '../types/subscriptions';
import { mockTransactions, subscriptionTemplates } from './data';

const userCancellations: UserCancellations = {
  '10': { cancelDate: '2026-03-01', expectedSavings: 155.88 },
  '5': { cancelDate: '2026-02-15', expectedSavings: 599.88 },
};

const zombieTransactions: Transaction[] = [
  { id: 'z1', merchantName: 'HULU', amount: 12.99, date: '2026-03-15', category: 'Streaming' },
  { id: 'z2', merchantName: 'GYM MEMBER', amount: 49.99, date: '2026-03-01', category: 'Fitness' },
];

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
          riskScore: 0,
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

export function calculateRetentionRisk(usageHistory?: number[]): number {
  if (!usageHistory || usageHistory.length < 2) return 0;
  
  const recentMonths = usageHistory.slice(0, 2);
  const olderMonths = usageHistory.slice(2, 4);
  
  if (olderMonths.length === 0 || recentMonths.every(m => m === 0)) return 1;
  
  const recentAvg = recentMonths.reduce((a, b) => a + b, 0) / recentMonths.length;
  const olderAvg = olderMonths.reduce((a, b) => a + b, 0) / olderMonths.length;
  
  if (olderAvg === 0) return recentAvg === 0 ? 1 : 0;
  
  const decline = (olderAvg - recentAvg) / olderAvg;
  return Math.max(0, Math.min(1, decline));
}

export function findBestTier(subscription: ClusteredSubscription): TierOption | undefined {
  if (!subscription.tiers || subscription.tiers.length === 0) return undefined;
  
  const bestTier = subscription.tiers.reduce((best, tier) => {
    if (tier.savings > (best?.savings || 0)) return tier;
    return best;
  }, subscription.tiers[0]);
  
  return bestTier.savings > 0 ? bestTier : undefined;
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

export function calculateCategorySpending(subscriptions: ClusteredSubscription[]): CategorySpending[] {
  const categoryMap = new Map<string, CategorySpending>();
  
  for (const sub of subscriptions) {
    if (!categoryMap.has(sub.category)) {
      categoryMap.set(sub.category, {
        category: sub.category,
        totalMonthly: 0,
        subscriptionCount: 0,
        subscriptions: []
      });
    }
    
    const cat = categoryMap.get(sub.category)!;
    cat.totalMonthly += sub.monthlyCost;
    cat.subscriptionCount += 1;
    cat.subscriptions.push(sub.name);
  }
  
  const insights: Record<string, string> = {
    'Streaming': 'You have {count} streaming services. Consider consolidating to save ${savings}/mo.',
    'Software': 'Review Adobe - downgrade to Photography plan for $35/mo savings.',
    'Fitness': 'Gym membership unused since January. Potential $600/yr savings.',
  };
  
  const result = Array.from(categoryMap.values()).sort((a, b) => b.totalMonthly - a.totalMonthly);
  
  for (const cat of result) {
    if (cat.category === 'Streaming' && cat.subscriptionCount >= 3) {
      cat.insight = insights['Streaming']
        .replace('{count}', cat.subscriptionCount.toString())
        .replace('{savings}', ((cat.subscriptionCount - 1) * 10).toString());
    } else if (insights[cat.category]) {
      cat.insight = insights[cat.category];
    }
  }
  
  return result;
}

export function detectZombieCharges(): ZombieAlert[] {
  const alerts: ZombieAlert[] = [];
  
  for (const [subId, cancelInfo] of Object.entries(userCancellations)) {
    const cancelDate = new Date(cancelInfo.cancelDate);
    
    for (const tx of zombieTransactions) {
      const txDate = new Date(tx.date);
      if (txDate > cancelDate) {
        const template = subscriptionTemplates.find(t => t.id === subId);
        if (template) {
          alerts.push({
            subscriptionId: subId,
            subscriptionName: template.name,
            originalCharge: cancelInfo.expectedSavings / 12,
            zombieChargeDate: tx.date,
            daysSinceCancel: Math.floor((txDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
      }
    }
  }
  
  return alerts;
}

export function calculateFoundMoney(): number {
  let total = 0;
  for (const [, cancelInfo] of Object.entries(userCancellations)) {
    const cancelDate = new Date(cancelInfo.cancelDate);
    const now = new Date('2026-03-18');
    const monthsSinceCancel = Math.max(1, Math.floor((now.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    total += cancelInfo.expectedSavings / 12 * monthsSinceCancel;
  }
  return total;
}

export function analyzeSubscriptions(): DashboardStats {
  const clustered = clusterTransactions(mockTransactions);
  
  const analyzed = clustered.map(sub => {
    const ghostScore = calculateGhostScore(sub);
    const riskScore = calculateRetentionRisk(sub.usageHistory);
    const status = determineStatus(sub);
    const suggestedTier = findBestTier(sub);
    const potentialSavings = suggestedTier ? suggestedTier.savings : 0;
    
    const cancellation = userCancellations[sub.id];
    
    return { 
      ...sub, 
      ghostScore, 
      riskScore, 
      status: cancellation ? 'pending_cancel' as const : status, 
      suggestedTier, 
      potentialSavings,
      cancelDate: cancellation?.cancelDate
    };
  });

  const totalMonthly = analyzed.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;
  const ghostCount = analyzed.filter(sub => sub.status === 'ghost').length;
  
  const upcomingRenewals = analyzed
    .filter(sub => getDaysUntilRenewal(sub.nextBillingDate) <= 48 && getDaysUntilRenewal(sub.nextBillingDate) > 0)
    .sort((a, b) => getDaysUntilRenewal(a.nextBillingDate) - getDaysUntilRenewal(b.nextBillingDate));

  const categorySpending = calculateCategorySpending(analyzed);
  const foundMoney = calculateFoundMoney();
  const healthScore = calculateHealthScore(analyzed, totalAnnual);
  const trials = getActiveTrials();
  const goalProgress = calculateGoalProgress(analyzed, foundMoney);

  return {
    totalMonthly,
    totalAnnual,
    subscriptionCount: analyzed.length,
    ghostCount,
    upcomingRenewals,
    subscriptions: analyzed,
    foundMoneyTotal: foundMoney,
    categorySpending,
    healthScore,
    trials,
    goalProgress
  };
}

export function calculateHealthScore(subscriptions: ClusteredSubscription[], totalAnnual: number): number {
  if (totalAnnual === 0) return 100;
  
  const wastedSpend = subscriptions
    .filter(s => s.status === 'ghost')
    .reduce((sum, s) => sum + s.monthlyCost * 12, 0);
  
  const score = Math.round(100 * (1 - wastedSpend / totalAnnual));
  return Math.max(0, Math.min(100, score));
}

export function getActiveTrials(): TrialSubscription[] {
  const now = new Date('2026-03-18');
  const mockTrials = [
    { id: 't1', name: 'Claude Pro', merchantName: 'ANTHROPIC', monthlyCostAfterTrial: 20, trialEndDate: '2026-03-22', logo: 'C' },
    { id: 't2', name: 'Figma Professional', merchantName: 'FIGMA', monthlyCostAfterTrial: 15, trialEndDate: '2026-03-25', logo: 'F' },
  ];
  
  return mockTrials.map(trial => {
    const endDate = new Date(trial.trialEndDate);
    const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { ...trial, daysUntilExpiry };
  });
}

export function calculateGoalProgress(subscriptions: ClusteredSubscription[], foundMoney: number): GoalProgress {
  const goalName = 'Vacation Fund';
  const targetAmount = 2000;
  const currentAmount = foundMoney;
  
  const ghostSavings = subscriptions
    .filter(s => s.status === 'ghost')
    .reduce((sum, s) => sum + s.monthlyCost * 12, 0);
  
  const percentComplete = Math.round((currentAmount / targetAmount) * 100);
  const ghostsNeeded = Math.ceil((targetAmount - currentAmount) / 100);
  
  return {
    goalName,
    targetAmount,
    currentAmount,
    percentComplete: Math.min(100, percentComplete),
    ghostsNeeded
  };
}

export function generateNegotiationScript(subscription: ClusteredSubscription): NegotiationScript {
  const daysSinceUse = subscription.lastUsedDate 
    ? Math.floor((new Date('2026-03-18').getTime() - new Date(subscription.lastUsedDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  const usagePercent = subscription.usageHistory && subscription.usageHistory.length > 0
    ? Math.round((subscription.usageHistory[subscription.usageHistory.length - 1] / 30) * 100)
    : 0;
  
  const script = `Hi, I've been a loyal customer but my usage has decreased significantly. I've only used ${subscription.name} ${usagePercent}% of the time over the past month. I'd like to continue using the service, but the current price doesn't match my usage. Are there any loyalty discounts, retention offers, or lower-tier plans available?`;
  
  const talkingPoints = [
    `Current usage: Only ${usagePercent}% of the time`,
    `Last active: ${daysSinceUse} days ago`,
    `Willing to stay if price is adjusted`,
    `Mention competitor alternatives`
  ];
  
  const expectedSavings = subscription.monthlyCost * 0.5;
  
  return {
    subscriptionName: subscription.name,
    script,
    talkingPoints,
    expectedSavings
  };
}

export type { ClusteredSubscription };
