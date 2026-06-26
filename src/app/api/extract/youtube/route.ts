import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Could not extract a valid YouTube video ID from that URL" },
        { status: 400 }
      );
    }

    const transcriptParts = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptParts || transcriptParts.length === 0) {
      return NextResponse.json(
        { error: "No transcript/captions available for this video" },
        { status: 404 }
      );
    }

    const fullTranscript = transcriptParts.map((part) => part.text).join(" ");

    return NextResponse.json({
      transcript: fullTranscript,
      videoId,
    });
  } catch (error) {
    console.error("YouTube transcript extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract transcript. This video may have captions disabled." },
      { status: 500 }
    );
  }
}