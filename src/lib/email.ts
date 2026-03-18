import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.log("RESEND_API_KEY not set - skipping email send:");
    console.log({ to, subject });
    return { success: false, error: "Resend not configured" };
  }

  try {
    const data = await resend.emails.send({
      from: "GhostCheck <noreply@ghostcheck.app>",
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendZombieAlertEmail({
  to,
  merchantName,
  amount,
  chargeDate,
}: {
  to: string;
  merchantName: string;
  amount: number;
  chargeDate: string;
}) {
  const subject = `🧟 Zombie Alert: ${merchantName} charged you after cancellation`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="color: white; margin: 0;">🧟 Zombie Alert!</h1>
      </div>
      
      <div style="padding: 30px; background: #fef2f2; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #dc2626; margin: 0 0 20px 0;">You were charged after cancelling!</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Merchant</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">${merchantName}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Amount Charged</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #dc2626;">$${amount.toFixed(2)}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Charge Date</p>
          <p style="margin: 0; font-size: 18px; color: #111827;">${chargeDate}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghostcheck.app'}/dashboard" 
           style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          View in GhostCheck
        </a>
      </div>
      
      <p style="text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px;">
        You're receiving this because you have GhostCheck monitor your subscriptions.
      </p>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendTrialExpiringEmail({
  to,
  trialName,
  daysLeft,
  costAfterTrial,
}: {
  to: string;
  trialName: string;
  daysLeft: number;
  costAfterTrial: number;
}) {
  const subject = `⏰ ${trialName} trial expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="color: white; margin: 0;">⏰ Trial Ending Soon</h1>
      </div>
      
      <div style="padding: 30px; background: #fffbeb; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #92400e; margin: 0 0 20px 0;">Your ${trialName} trial is about to end</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Days Remaining</p>
          <p style="margin: 0; font-size: 36px; font-weight: bold; color: #f59e0b;">${daysLeft} day${daysLeft !== 1 ? 's' : ''}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Cost after trial</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">$${costAfterTrial.toFixed(2)}/month</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghostcheck.app'}/dashboard" 
           style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Decide Now
        </a>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string;
}) {
  const subject = "Welcome to GhostCheck - Your first subscription audit";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 48px;">👻</span>
      </div>
      
      <h1 style="text-align: center; color: #111827;">Welcome to GhostCheck${name ? `, ${name}` : ''}!</h1>
      
      <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
        GhostCheck helps you find and eliminate unused subscriptions before they become ghosts.
      </p>
      
      <div style="margin: 30px 0;">
        <h3 style="color: #111827;">Here's how to get started:</h3>
        <ol style="color: #6b7280; line-height: 2;">
          <li>Connect your bank account to sync transactions</li>
          <li>Connect Gmail to track usage patterns</li>
          <li>Review your "Ghost" subscriptions</li>
          <li>Kill unused subscriptions to save money!</li>
        </ol>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ghostcheck.app'}/dashboard" 
           style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Get Started
        </a>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}
