import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ error: "No code provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a professional software engineer and code reviewer.
Review the following code and provide feedback focusing on:
- Readability
- Performance
- Maintainability
- Potential bugs or security issues
- Suggested improvements

Return your response as a concise review without markdown fences or formatting.

Code:
${code}
`;

        const result = await model.generateContent(prompt);

        let feedback = result.response.text();
        feedback = feedback
            .replace(/```[\s\S]*?\n?/, "")
            .replace(/```$/, "")
            .trim();

        return NextResponse.json({ feedback });
    } catch (error) {
        console.error("❌ AI Review Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
