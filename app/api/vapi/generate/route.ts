import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { GEMINI_MODEL } from "@/lib/config";
import { getRandomInterviewCover } from "@/lib/utils";

// Gemini sometimes wraps the JSON in ```json fences - strip them before parsing
function parseQuestions(raw: string): string[] {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  const json =
    start !== -1 && end > start ? cleaned.slice(start, end + 1) : cleaned;

  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error("Model did not return a list of questions");
  }
  return parsed.map(String);
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  if (!role || !level || !techstack || !amount || !userid) {
    console.error("Missing fields from Vapi:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
    });
    return Response.json(
      { success: false, error: "Missing required fields (check userid)" },
      { status: 400 }
    );
  }

  try {
    const { text } = await generateText({
      model: google(GEMINI_MODEL),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    `,
    });

    const techList = (
      Array.isArray(techstack) ? techstack : String(techstack).split(",")
    )
      .map((t: string) => t.trim())
      .filter(Boolean);

    const interview = {
      role,
      type,
      level,
      techstack: techList,
      questions: parseQuestions(text),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
