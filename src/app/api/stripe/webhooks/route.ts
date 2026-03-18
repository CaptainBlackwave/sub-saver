import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription;

      console.log(`✅ Checkout completed for user ${userId}, subscription ${subscriptionId}`);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as unknown as { subscription?: string };
      const subscriptionId = invoice.subscription;

      console.log(`✅ Invoice paid for subscription ${subscriptionId}`);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as { subscription?: string };
      const subscriptionId = invoice.subscription;

      console.log(`❌ Payment failed for subscription ${subscriptionId}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(`❌ Subscription cancelled: ${subscription.id}`);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(`✅ Subscription updated: ${subscription.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
