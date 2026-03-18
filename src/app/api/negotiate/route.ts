import { NextResponse } from 'next/server';

interface NegotiationRequest {
  merchantName: string;
  usageDeclinePercent: number;
  currentCost: number;
  lastUsedDays: number;
}

export async function POST(request: Request) {
  const body: NegotiationRequest = await request.json();
  const { merchantName, usageDeclinePercent, currentCost, lastUsedDays } = body;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  let script: string;
  let talkingPoints: string[];

  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that drafts professional retention negotiation emails. Keep it brief (3 sentences), polite, and focused on requesting a discount based on decreased usage.',
            },
            {
              role: 'user',
              content: `Draft a retention negotiation email for ${merchantName}. Current subscription costs $${currentCost}/month. Usage has declined by ${usageDeclinePercent}% and the service was last used ${lastUsedDays} days ago. The user wants to stay but needs a better price.`,
            },
          ],
          max_tokens: 200,
        }),
      });

      const data = await response.json();
      script = data.choices?.[0]?.message?.content || generateFallbackScript(merchantName, currentCost, usageDeclinePercent);
    } catch (error) {
      script = generateFallbackScript(merchantName, currentCost, usageDeclinePercent);
    }
  } else if (ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          system: 'You are a helpful assistant that drafts professional retention negotiation emails. Keep it brief (3 sentences), polite, and focused on requesting a discount based on decreased usage.',
          messages: [
            {
              role: 'user',
              content: `Draft a retention negotiation email for ${merchantName}. Current subscription costs $${currentCost}/month. Usage has declined by ${usageDeclinePercent}% and the service was last used ${lastUsedDays} days ago. The user wants to stay but needs a better price.`,
            },
          ],
        }),
      });

      const data = await response.json();
      script = data.content?.[0]?.text || generateFallbackScript(merchantName, currentCost, usageDeclinePercent);
    } catch (error) {
      script = generateFallbackScript(merchantName, currentCost, usageDeclinePercent);
    }
  } else {
    script = generateFallbackScript(merchantName, currentCost, usageDeclinePercent);
  }

  talkingPoints = [
    `Current usage: Only ${usageDeclinePercent}% of the time`,
    `Last active: ${lastUsedDays} days ago`,
    `Willing to stay if price is adjusted to $${(currentCost * 0.5).toFixed(2)}/mo`,
    'Mention competitor alternatives',
  ];

  return NextResponse.json({
    script,
    talkingPoints,
    expectedSavings: currentCost * 0.5,
  });
}

function generateFallbackScript(merchantName: string, currentCost: number, declinePercent: number): string {
  return `Subject: Loyalty Inquiry for My ${merchantName} Subscription

Dear ${merchantName} Customer Retention Team,

I've been a loyal customer for over a year, but my usage has decreased significantly—down ${declinePercent}% recently. I'd like to continue using ${merchantName}, but at my current usage level, the $${currentCost}/month price isn't justified. Are there any loyalty discounts, retention offers, or lower-tier plans available?

Thank you for your time.

Best regards`;
}
