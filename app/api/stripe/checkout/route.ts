import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Commented out until Stripe API keys are configured
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2025-12-15.clover',
// });

// Premium plan price: $29/month (in cents)
const PREMIUM_PRICE_CENTS = 2900;

export async function POST(request: NextRequest) {
  // Return early if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured',
        message: 'Please set STRIPE_SECRET_KEY in your environment variables',
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  });

  try {
    const { companyId, email, customerId } = await request.json();

    if (!companyId || !email) {
      return NextResponse.json(
        { error: 'Company ID and email are required' },
        { status: 400 }
      );
    }

    // Use existing customer or create new one
    let stripeCustomerId = customerId;

    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          companyId,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create Stripe Checkout Session with inline price
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Plan',
              description:
                'Unlock powerful AI-driven matching, real-time notifications, and custom search profiles',
            },
            unit_amount: PREMIUM_PRICE_CENTS,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        companyId,
        email,
      },
      success_url: `${request.nextUrl.origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/subscription?canceled=true`,
      subscription_data: {
        metadata: {
          companyId,
          email,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
