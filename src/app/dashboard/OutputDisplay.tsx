"use client";

import { useState, useEffect } from "react";
import { GenerationResult, Platform } from "./ContentForm";

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter Thread",
  linkedin: "LinkedIn Post",
  instagram: "Instagram Caption",
  blog: "Blog Article",
  email: "Email Newsletter",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: "bg-sky-50 text-sky-700 border-sky-200",
  linkedin: "bg-blue-50 text-blue-700 border-blue-200",
  instagram: "bg-pink-50 text-pink-700 border-pink-200",
  blog: "bg-emerald-50 text-emerald-700 border-emerald-200",
  email: "bg-amber-50 text-amber-700 border-amber-200",
};

function OutputCard({
  platform,
  content,
  delayMs,
}: {
  platform: Platform;
  content: string;
  delayMs: number;
}) {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFlipped(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isFailed = content.startsWith("Generation failed");

  return (
    <div className="flip-card-container" style={{ perspective: "1500px" }}>
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front face — shown briefly before flip */}
        <div className="flip-card-face flip-card-front">
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm">
            <span
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${PLATFORM_COLORS[platform]}`}
            >
              {PLATFORM_LABELS[platform]}
            </span>
          </div>
        </div>

        {/* Back face — actual content, visible after flip */}
        <div className="flip-card-face flip-card-back">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${PLATFORM_COLORS[platform]}`}
              >
                {PLATFORM_LABELS[platform]}
              </span>
              {!isFailed && (
                <button
                  onClick={handleCopy}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            {isFailed ? (
              <p className="text-sm text-red-600">{content}</p>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                {content}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-card-container {
          position: relative;
          width: 100%;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-face {
          backface-visibility: hidden;
        }
        .flip-card-front {
          position: absolute;
          inset: 0;
          height: 100%;
          min-height: 120px;
        }
        .flip-card-back {
          transform: rotateY(180deg);
          position: relative;
        }
        .flip-card-inner:not(.flipped) .flip-card-back {
          visibility: hidden;
        }
      `}</style>
    </div>
  );
}

export default function OutputDisplay({ result }: { result: GenerationResult }) {
  return (
    <div className="space-y-4">
      {result.outputs.map((output, index) => (
        <OutputCard
          key={output.platform}
          platform={output.platform}
          content={output.content}
          delayMs={300 + index * 200}
        />
      ))}
    </div>
  );
}