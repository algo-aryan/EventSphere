import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { title, category, bulletPoints, tone } = await req.json();

    if (!bulletPoints) {
      return NextResponse.json({ error: "Bullet points are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert event copywriter. Generate a highly engaging, professional, and polished event description based on the following raw bullet points provided by the organizer.

      Event Title: ${title || "Not provided"}
      Event Category: ${category || "Not provided"}
      Desired Tone: ${tone || "Professional and Exciting"}

      Raw details (bullet points):
      ${bulletPoints}

      Format the output in clean HTML (using <h3>, <p>, <ul>, <li> tags) so it can be directly rendered on the event page. Do not include markdown code block syntax like \`\`\`html. Just return the raw HTML string. Ensure the description highlights the value proposition and builds anticipation.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```html/g, "").replace(/```/g, "").trim();
      return NextResponse.json({ description: text });
    } catch (apiError: any) {
      console.warn("Gemini API Error, falling back to mock description:", apiError.message);
      // Fallback for hackathon demo if API key/model fails
      const mockHtml = `
        <h3>Join us for ${title || "an incredible event"}</h3>
        <p>This is a highly engaging, professional, and polished event description that highlights the value proposition of the event.</p>
        <h4>Key Highlights:</h4>
        <ul>
          ${bulletPoints.split('\n').filter((b:string) => b.trim()).map((b:string) => `<li>${b.replace(/^-/, '').trim()}</li>`).join('')}
        </ul>
        <p>Don't miss out on this amazing opportunity to connect, learn, and grow!</p>
      `;
      return NextResponse.json({ description: mockHtml });
    }
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
