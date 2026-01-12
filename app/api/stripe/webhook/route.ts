import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Commented out until Stripe API keys are configured
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2025-12-15.clover',
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  // Return early if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured',
        message:
          'Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your environment variables',
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;

      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const companyId = session.metadata?.companyId;

      if (companyId) {
        // Here you would typically update your database
        // For now, we'll just log it
        console.log('Subscription activated:', {
          companyId,
          subscriptionId,
          customerId: subscription.customer,
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.companyId;

      if (companyId) {
        const isActive =
          subscription.status === 'active' ||
          subscription.status === 'trialing';

        console.log('Subscription status changed:', {
          companyId,
          subscriptionId: subscription.id,
          status: subscription.status,
          isActive,
        });

        // Here you would update your database with the new subscription status
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      // Handle subscription which can be string | Subscription | null
      const subscriptionId =
        (invoice as any).subscription &&
        typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id;

      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const companyId = subscription.metadata?.companyId;

        console.log('Payment succeeded:', {
          companyId,
          subscriptionId,
          invoiceId: invoice.id,
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      // Handle subscription which can be string | Subscription | null
      const subscriptionId =
        (invoice as any).subscription &&
        typeof (invoice as any).subscription === 'string'
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id;

      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const companyId = subscription.metadata?.companyId;

        console.log('Payment failed:', {
          companyId,
          subscriptionId,
          invoiceId: invoice.id,
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
