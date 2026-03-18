import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const CRON_SECRET = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const PLAID_ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN;
    const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
    const PLAID_SECRET = process.env.PLAID_SECRET;

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startDate = yesterday.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    let recentTransactions: Array<{
      transaction_id: string;
      merchant_name: string;
      amount: number;
      date: string;
    }> = [];

    if (PLAID_ACCESS_TOKEN && PLAID_CLIENT_ID && PLAID_SECRET) {
      const response = await fetch('https://sandbox.plaid.com/transactions/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: PLAID_ACCESS_TOKEN,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();
      recentTransactions = data.transactions || [];
    } else {
      recentTransactions = [
        { transaction_id: 'z1', merchant_name: 'HULU', amount: 12.99, date: endDate },
      ];
    }

    const cancelledMerchants = ['HULU', 'NETFLIX', 'SPOTIFY', 'GYM'];
    const zombieCharges = recentTransactions.filter(tx => 
      cancelledMerchants.some(m => tx.merchant_name?.toUpperCase().includes(m))
    );

    if (zombieCharges.length > 0) {
      console.log('🚨 ZOMBIE ALERTS DETECTED:', zombieCharges);
    }

    return NextResponse.json({
      success: true,
      checkedTransactions: recentTransactions.length,
      zombieChargesFound: zombieCharges.length,
      zombieCharges,
      message: 'Zombie alert check completed',
    });
  } catch (error) {
    console.error('CRON job error:', error);
    return NextResponse.json(
      { error: 'Failed to run zombie alert check' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
