import { NextResponse } from "next/server";

export async function POST() {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    return NextResponse.json({
      link_token: 'mock-update-link-token',
      message: 'Using mock mode - add PLAID credentials for real re-authentication',
    });
  }

  try {
    const response = await fetch('https://sandbox.plaid.com/link/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: { client_user_id: 'user-123' },
        client_name: 'GhostCheck',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        options: {
          update_mode: 'background',
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json({
      link_token: data.link_token,
      type: 'update',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create update link token' },
      { status: 500 }
    );
  }
}
