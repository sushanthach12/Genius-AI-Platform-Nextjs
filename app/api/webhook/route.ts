import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

// below command to keep running the webhook in the terminal
// stripe listen --forward-to localhost:3000/api/webhook

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    
    const payload = await req.text();
    const signature = headers().get("stripe-signature") as string


    let event: Stripe.Event | null = null;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature!,
            webhookSecret
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await prismadb.userSubscription.create({
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )
        await prismadb.userSubscription.update({
            where: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    return new NextResponse("SUCCESS", { status: 200 })
};
