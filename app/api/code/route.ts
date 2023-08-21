import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"

import { increateAPILimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

const intsructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explannation."
}

export async function POST(req: Request) {
    try {

        const { userId } = auth();

        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI Api Key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Prompts are required", { status: 500 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trail has expired", { status: 403 });
        }
        
        
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [intsructionMessage, ...messages]
        });

        if(!isPro) {
            await increateAPILimit();
        }

        return NextResponse.json(response.data.choices[0].message);

    } catch (error) {
        console.log("[CODE API] " + error);
        return new NextResponse("Interal Server Error", { status: 500 });
    }
}