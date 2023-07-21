import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    organization: "org-arPo1uSkY8JIm5PZgf68fkmn",
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

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
        
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0,
            max_tokens: 256
        });


        return NextResponse.json(response.data.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION API]" + error);
        return new NextResponse("Interal Server Error", { status: 500 });
    }
}