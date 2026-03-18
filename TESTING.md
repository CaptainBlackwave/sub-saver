# GhostCheck Testing Guide

## Plaid Sandbox Testing

### Test Credentials
Use these credentials when connecting to Plaid Sandbox:

| Field | Value |
|-------|-------|
| Username | `user_good` |
| Password | `pass_good` |
| Phone | `+1-415-555-1212` |
| PIN | `1234` |

### Test Scenarios

1. **Standard Connection**
   - Use `user_good` / `pass_good`
   - Returns normal transaction history

2. **MFA Required**
   - Use `user_mfa` / `pass_good`
   - Triggers multi-factor authentication flow

3. **Institution Locked**
   - Use `user_locked` / `pass_good`
   - Simulates account lockout

4. **Connection Failed**
   - Use `user_disconnected` / `pass_good`
   - Simulates connection error

### Sandbox Transactions
The sandbox returns mock transactions including:
- Netflix ($15.99)
- Spotify ($10.99)
- Adobe ($54.99)
- Hulu ($12.99)
- Gym Membership ($49.99)

## Google OAuth Testing

### Test Users (Bypass Verification)
While your app is unverified:

1. Go to Google Cloud Console → APIs & Services → OAuth Consent Screen
2. Under "Test users", add your Google email
3. You can add up to 100 test users
4. These users won't see the "Unverified App" warning

### Gmail API Testing
Test queries to verify email scraping:
- `subject:"Your receipt from Netflix"`
- `subject:"Thanks for watching"`
- `subject:"Your weekly summary"`
- `from:no-reply@spotify.com`

## CRON Job Testing

### Manual Trigger
```bash
# Test zombie-alerts CRON
curl -X POST https://your-app.com/api/cron/zombie-alerts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test risk-score-update CRON
curl -X POST https://your-app.com/api/cron/risk-score-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Expected Responses
- Success: `{ "success": true, ... }`
- Unauthorized: `{ "error": "Unauthorized" }` (401)

## Database Testing

### View Data
```bash
# Use SQLite browser or CLI
sqlite3 .kilocode/db/*.db

# List tables
.tables

# View subscriptions
SELECT * FROM subscriptions;
```

## Integration Testing Checklist

- [ ] Plaid Link opens and connects
- [ ] Transactions sync correctly
- [ ] Ghost detection identifies unused subs
- [ ] Gmail OAuth flow completes
- [ ] Email usage data populates
- [ ] CRON jobs execute without error
- [ ] Found Money calculates correctly
- [ ] Goal Tracker persists between sessions

## Troubleshooting

### "Plaid connection failed"
- Verify PLAID_CLIENT_ID and PLAID_SECRET are correct
- Check you're using sandbox environment

### "Google unverified app" warning
- Add your email as a test user in Google Cloud Console
- This is expected for unverified apps

### "No transactions found"
- Check PLAID_ACCESS_TOKEN is valid
- Verify the user has transactions in the last 30 days
