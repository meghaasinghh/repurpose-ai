import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Blog URL is required" }, { status: 400 });
    }

    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Please provide a valid URL" }, { status: 400 });
    }

    const { data: html } = await axios.get(validUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // Remove noise elements that aren't actual article content
    $(
      "script, style, nav, header, footer, aside, iframe, noscript, " +
        ".advertisement, .ads, .ad, .cookie-banner, .newsletter-signup, " +
        ".social-share, .related-posts, .comments, .sidebar, .breadcrumb, " +
        "button, form, [aria-hidden='true']"
    ).remove();

    // Try common article container selectors first, fall back to body
    let articleText = "";
    const selectors = [
      "article",
      "main",
      '[role="main"]',
      ".post-content",
      ".article-content",
      ".blog-post",
      ".entry-content",
      "#content",
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length && el.text().trim().length > 200) {
        articleText = el.text();
        break;
      }
    }

    if (!articleText) {
      articleText = $("body").text();
    }

    const cleanedText = articleText
      .replace(/\s+/g, " ")
      .replace(/Back to Blog/gi, "")
      .trim();

    const title = $("title").text().trim() || $("h1").first().text().trim() || "Untitled Article";

    if (cleanedText.length < 100) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from this URL" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      transcript: cleanedText,
      title,
    });
  } catch (error) {
    console.error("Blog extraction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch or parse this URL. Please check the link and try again." },
      { status: 500 }
    );
  }
}