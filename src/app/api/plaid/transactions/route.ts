import { NextResponse } from 'next/server';

export async function GET() {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;
  const ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN;

  if (!ACCESS_TOKEN || !PLAID_CLIENT_ID || !PLAID_SECRET) {
    return NextResponse.json({
      transactions: [],
      message: 'No access token - using mock data. Set PLAID_ACCESS_TOKEN for real transactions.',
      mockTransactions: [
        { transaction_id: 'm1', merchant_name: 'NETFLIX.COM', amount: 15.99, date: '2026-03-15', category: ['Service', 'Subscription'] },
        { transaction_id: 'm2', merchant_name: 'SPOTIFY', amount: 10.99, date: '2026-03-12', category: ['Service', 'Subscription'] },
        { transaction_id: 'm3', merchant_name: 'ADOBE', amount: 54.99, date: '2026-03-10', category: ['Service', 'Software'] },
      ],
    });
  }

  try {
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    const response = await fetch('https://sandbox.plaid.com/transactions/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: ACCESS_TOKEN,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    const data = await response.json();
    
    return NextResponse.json({
      transactions: data.transactions || [],
      total_transactions: data.total_transactions || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
