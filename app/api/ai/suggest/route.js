import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
    try {
        const { language, code } = await req.json();
        const prompt = ` You are a helpful ${language} coding assistant. Given the following code snippet, suggest the next few lines that would logically continue it. Code: ${code}, Respond only with code continuation, no explanations and no current language name, just the code.`;

        const result = await model.generateContent(prompt);

        let suggestion = result.response.text();

        suggestion = suggestion
            .replace(/```[\s\S]*?\n?/, "")   // remove ```js, ```javascript, etc.
            .replace(/```$/, "")             // remove closing ```
            .trim();

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error("❌ AI Suggestion Error:", error);
        return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 });
    }
}
