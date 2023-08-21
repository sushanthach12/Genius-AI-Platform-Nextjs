import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {

        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unnauthorised", { status: 401 });
        }

        const userSubcription = await prismadb.userSubscription.findUnique({
            where: { userId: userId }
        });

        // if the user already has a subscription, redirect to the billing page to cancel the subscription
        if (userSubcription && userSubcription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubcription.stripeCustomerId,
                return_url: settingsUrl
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        // if user doesnt have a subscription , then create a stripe checkout page
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2000 * 100,
                        recurring: {
                            interval: 'month'   // Monthy subcription
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId  // important to add meta data for webhooks
            }
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url}));

    } catch (error) {
        console.log("[STRIPE ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}