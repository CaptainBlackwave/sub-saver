'use client';

export function useAnalytics() {
  const capture = (event: string, properties?: Record<string, unknown>) => {
    console.log('[Analytics]', event, properties);
  };

  const trackSubscriptionKilled = (subscriptionName: string, amountSaved: number) => {
    capture('Subscription Killed', {
      subscription_name: subscriptionName,
      amount_saved_monthly: amountSaved,
      amount_saved_annual: amountSaved * 12,
    });
  };

  const trackBankConnected = (institutionName: string) => {
    capture('Bank Connected', { institution: institutionName });
  };

  const trackGmailConnected = () => {
    capture('Gmail Connected');
  };

  const trackNegotiationUsed = (subscriptionName: string) => {
    capture('Negotiation Used', { subscription_name: subscriptionName });
  };

  const trackGoalReached = (goalName: string, amount: number) => {
    capture('Goal Reached', { goal_name: goalName, amount });
  };

  return {
    capture,
    trackSubscriptionKilled,
    trackBankConnected,
    trackGmailConnected,
    trackNegotiationUsed,
    trackGoalReached,
  };
}
