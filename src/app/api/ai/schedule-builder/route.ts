import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { sessions, startTime, endTime } = await req.json();

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: "Session data is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert event planner and logistics coordinator. 
      I need you to build an optimal, non-overlapping schedule for an event.

      Event Timeframe: ${startTime} to ${endTime}

      Unordered Sessions/Speakers to schedule:
      ${JSON.stringify(sessions, null, 2)}

      Please generate a logical schedule. Consider audience flow (e.g., put big keynotes at the start or end, group similar topics). 
      Format the output as a clean HTML string (using <ul>, <li>, <strong> for time) so it can be rendered directly in the UI. Do not use markdown code blocks like \`\`\`html.
      Ensure there are short breaks between major sessions.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```html/g, "").replace(/```/g, "").trim();
      return NextResponse.json({ schedule: text });
    } catch (apiError: any) {
      console.warn("Gemini API Error, falling back to mock schedule:", apiError.message);
      // Fallback for hackathon demo if API key/model fails
      const mockHtml = `
        <ul style="list-style-type: none; padding: 0; space-y-4">
          ${sessions.map((s: any, i: number) => `
            <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
              <strong>Session ${i + 1}:</strong> ${s.title || 'Untitled Session'}
              <br/>
              <span style="color: #64748b;">Duration: ${s.duration || '60'} mins | Speaker: ${s.speaker || 'TBA'}</span>
            </li>
          `).join('')}
        </ul>
      `;
      return NextResponse.json({ schedule: mockHtml });
    }
  } catch (error) {
    console.error("Error generating schedule:", error);
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
  }
}
