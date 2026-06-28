import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Content, InputType, Tone } from "@/lib/models/Content";
import { generateText } from "@/lib/gemini";
import {
  buildTwitterPrompt,
  buildLinkedInPrompt,
  buildInstagramPrompt,
  buildBlogPrompt,
  buildEmailPrompt,
} from "@/lib/prompts";

const PLATFORM_BUILDERS = {
  twitter: buildTwitterPrompt,
  linkedin: buildLinkedInPrompt,
  instagram: buildInstagramPrompt,
  blog: buildBlogPrompt,
  email: buildEmailPrompt,
} as const;

type Platform = keyof typeof PLATFORM_BUILDERS;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
    }

    const body = await req.json();
    const {
      transcript,
      inputType,
      tone = "professional",
      title,
      sourceUrl,
      sourceFileName,
      platforms,
    }: {
      transcript: string;
      inputType: InputType;
      tone: Tone;
      title: string;
      sourceUrl?: string;
      sourceFileName?: string;
      platforms: Platform[];
    } = body;

    if (!transcript || !inputType || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "transcript, inputType, and at least one platform are required" },
        { status: 400 }
      );
    }

    const invalidPlatforms = platforms.filter((p) => !PLATFORM_BUILDERS[p]);
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Invalid platform(s): ${invalidPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate content for each requested platform sequentially.
    // Sequential (not parallel) to stay friendly with Gemini's free-tier rate limits.
    const outputs = [];
    for (const platform of platforms) {
      const promptBuilder = PLATFORM_BUILDERS[platform];
      const prompt = promptBuilder(transcript, tone);

      try {
        const generatedText = await generateText(prompt);
        outputs.push({
          platform,
          content: generatedText,
        });
      } catch (err) {
        console.error(`Generation failed for platform ${platform}:`, err);
        outputs.push({
          platform,
          content: `Generation failed for this platform. Please try regenerating.`,
        });
      }
    }

    await connectDB();

    const savedContent = await Content.create({
      user: session.user.id,
      inputType,
      sourceUrl,
      sourceFileName,
      transcript,
      tone,
      outputs,
      title: title || "Untitled Content",
    });

    return NextResponse.json({
      contentId: savedContent._id,
      outputs,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}