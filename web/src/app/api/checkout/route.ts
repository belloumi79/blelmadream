import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27-ac' as any,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = await req.json();
    const { items, name, email, phone, address, paymentMethod, locale } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const orderId = uuidv4();

    // 1. Create order in database
    await db.insert(orders).values({
      id: orderId,
      userId: session?.user?.id || null,
      totalAmount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // 2. Insert items
    for (const item of items) {
      await db.insert(orderItems).values({
        id: uuidv4(),
        orderId,
        productId: item.id,
        quantity: item.quantity,
        priceAtTime: item.price,
      });
    }

    // 3. Handle Stripe
    if (paymentMethod === 'stripe' && process.env.STRIPE_SECRET_KEY) {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'tnd',
            product_data: {
              name: item.name,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: item.price, // price in millimes
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/${locale}/order-success?id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/${locale}/cart`,
        customer_email: email,
        metadata: { orderId },
      });

      // Update order with session id
      await db.update(orders).set({ stripeSessionId: checkoutSession.id }).where(eq(orders.id, orderId));

      return NextResponse.json({ url: checkoutSession.url });
    }

    // For COD
    return NextResponse.json({ orderId });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
