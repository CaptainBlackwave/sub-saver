import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { public_token, metadata } = await request.json();
  
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    return NextResponse.json({
      access_token: 'mock-access-token',
      item_id: 'mock-item-id',
      message: 'Mock mode - add credentials for real data',
    });
  }

  try {
    const response = await fetch('https://sandbox.plaid.com/item/public_token/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token,
      }),
    });

    const data = await response.json();
    
    return NextResponse.json({
      access_token: data.access_token,
      item_id: data.item_id,
      institution: metadata?.institution?.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    );
  }
}
