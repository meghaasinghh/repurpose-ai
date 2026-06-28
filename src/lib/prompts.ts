import { Tone } from "@/lib/models/Content";

const toneDescriptions: Record<Tone, string> = {
  professional: "professional, polished, and authoritative",
  casual: "casual, friendly, and conversational",
  storytelling: "narrative-driven, using storytelling techniques and a personal voice",
  genz: "Gen-Z style with internet slang, high energy, and trendy phrasing",
};

function basePromptContext(transcript: string, tone: Tone): string {
  return `You are an expert content repurposing assistant. Below is a transcript/source content. Your tone must be ${toneDescriptions[tone]}.

SOURCE CONTENT:
"""
${transcript}
"""
`;
}

export function buildTwitterPrompt(transcript: string, tone: Tone): string {
  return (
    basePromptContext(transcript, tone) +
    `
Write a Twitter/X thread (5-8 tweets) summarizing the key insights from this content.
Rules:
- First tweet must be a strong hook that makes people want to read more
- Each tweet under 280 characters
- Number tweets like "1/", "2/", etc.
- Include 2-3 relevant hashtags only in the LAST tweet
- End with a clear call-to-action
- Use emojis sparingly and only where natural

Return ONLY the thread, with each tweet separated by a blank line. No preamble, no explanation.`
  );
}

export function buildLinkedInPrompt(transcript: string, tone: Tone): string {
  return (
    basePromptContext(transcript, tone) +
    `
Write a LinkedIn post summarizing the key insights from this content.
Rules:
- Strong opening hook line (this is what shows before "see more")
- Use short paragraphs and line breaks for readability
- Include actionable takeaways
- 150-300 words
- End with a question or call-to-action to drive engagement
- Include 3-5 relevant hashtags at the very end

Return ONLY the post text. No preamble, no explanation.`
  );
}

export function buildInstagramPrompt(transcript: string, tone: Tone): string {
  return (
    basePromptContext(transcript, tone) +
    `
Write an Instagram caption summarizing the key insight from this content.
Rules:
- Attention-grabbing first line (shows before "more")
- Use emojis naturally throughout
- Keep it under 150 words
- Include a clear call-to-action (e.g. "Save this for later", "Comment below")
- Include 8-12 relevant hashtags at the end, separated from the caption by a blank line

Return ONLY the caption. No preamble, no explanation.`
  );
}

export function buildBlogPrompt(transcript: string, tone: Tone): string {
  return (
    basePromptContext(transcript, tone) +
    `
Write an SEO-friendly blog article based on this content.
Rules:
- Compelling, SEO-friendly title (as an H1, using "# Title" markdown)
- Use H2 subheadings ("## Subheading") to break up sections
- 500-800 words
- Include a brief introduction and a clear conclusion with a takeaway
- Naturally incorporate likely SEO keywords related to the topic

Return ONLY the article in markdown format. No preamble, no explanation.`
  );
}

export function buildEmailPrompt(transcript: string, tone: Tone): string {
  return (
    basePromptContext(transcript, tone) +
    `
Write an email newsletter based on this content.
Rules:
- Compelling subject line on the first line, prefixed with "Subject: "
- Then a blank line, then the email body
- Friendly greeting (e.g. "Hey there,")
- 200-350 words
- Clear structure with key takeaways
- End with a call-to-action and a sign-off

Return ONLY the subject line and email body in the format described. No preamble, no explanation.`
  );
}