import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
  : 'http://localhost:3000/api/auth/callback/google';

interface EmailUsage {
  service: string;
  lastActivityDate: string;
  activityCount: number;
  source: 'gmail' | 'browser';
}

export async function GET() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({
      connected: false,
      message: 'Gmail integration not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.',
      setupRequired: [
        '1. Go to Google Cloud Console',
        '2. Enable Gmail API',
        '3. Create OAuth 2.0 credentials',
        '4. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment',
      ],
      providers: [
        { name: 'Gmail', status: 'disconnected', requiredScopes: ['https://www.googleapis.com/auth/gmail.readonly'] },
      ],
      mockData: [
        { service: 'Netflix', lastActivityDate: '2026-03-17', activityCount: 12, source: 'gmail' as const },
        { service: 'Spotify', lastActivityDate: '2026-03-18', activityCount: 28, source: 'gmail' as const },
        { service: 'Adobe', lastActivityDate: '2026-03-01', activityCount: 3, source: 'gmail' as const },
      ] as EmailUsage[]
    });
  }

  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.labels.readonly',
  ];

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return NextResponse.json({
    connected: false,
    authUrl: authUrl.toString(),
    message: 'Click to connect your Gmail account',
    providers: [
      { name: 'Gmail', status: 'disconnected', requiredScopes: scopes },
    ],
  });
}

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return NextResponse.json({
      error: 'No refresh token provided',
      setupRequired: 'Complete OAuth flow to get refresh token',
    }, { status: 400 });
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({
      error: 'Gmail credentials not configured',
      mockData: [
        { service: 'Netflix', lastActivityDate: '2026-03-17', activityCount: 12, source: 'gmail' as const },
        { service: 'Spotify', lastActivityDate: '2026-03-18', activityCount: 28, source: 'gmail' as const },
      ] as EmailUsage[]
    });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const { access_token: accessToken } = await tokenResponse.json();

    const knownMerchants = [
      'netflix', 'spotify', 'hulu', 'disney', 'adobe', 'apple', 'amazon',
      'youtube', 'hbo', 'notion', 'slack', 'dropbox', 'github', 'chatgpt',
    ];

    const query = knownMerchants
      .map(m => `subject:"${m}" OR subject:"${m.toUpperCase()}"`)
      .join(' OR ');

    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const gmailData = await gmailResponse.json();
    const messages = gmailData.messages || [];

    const activityMap = new Map<string, { lastDate: string; count: number }>();

    for (const msg of messages.slice(0, 20)) {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject,From,Date`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const msgData = await msgResponse.json();
      const headers = msgData.payload?.headers || [];
      
      const subject = headers.find((h: { name: string }) => h.name === 'Subject')?.value || '';
      const from = headers.find((h: { name: string }) => h.name === 'From')?.value || '';
      const date = headers.find((h: { name: string }) => h.name === 'Date')?.value || '';

      const merchant = knownMerchants.find(m => 
        subject.toLowerCase().includes(m) || from.toLowerCase().includes(m)
      );

      if (merchant) {
        const existing = activityMap.get(merchant) || { lastDate: '', count: 0 };
        const msgDate = new Date(date);
        
        if (!existing.lastDate || msgDate > new Date(existing.lastDate)) {
          existing.lastDate = date;
        }
        existing.count += 1;
        
        activityMap.set(merchant, existing);
      }
    }

    const usageData: EmailUsage[] = Array.from(activityMap.entries()).map(([service, data]) => ({
      service: service.charAt(0).toUpperCase() + service.slice(1),
      lastActivityDate: data.lastDate,
      activityCount: data.count,
      source: 'gmail' as const,
    }));

    return NextResponse.json({
      connected: true,
      usageData,
      message: `Found ${usageData.length} subscriptions with email activity`,
    });
  } catch (error) {
    console.error('Gmail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gmail data' },
      { status: 500 }
    );
  }
}
