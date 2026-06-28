"use client";

import { useState } from "react";

export type InputType = "youtube" | "blog" | "audio";
export type Tone = "professional" | "casual" | "storytelling" | "genz";
export type Platform = "twitter" | "linkedin" | "instagram" | "blog" | "email";

export interface GenerationResult {
  contentId: string;
  outputs: { platform: Platform; content: string }[];
}

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter Thread",
  linkedin: "LinkedIn Post",
  instagram: "Instagram Caption",
  blog: "Blog Article",
  email: "Email Newsletter",
};

const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  casual: "Casual",
  storytelling: "Storytelling",
  genz: "Gen-Z",
};

interface ContentFormProps {
  onResult: (result: GenerationResult) => void;
}

export default function ContentForm({ onResult }: ContentFormProps) {
  const [inputType, setInputType] = useState<InputType>("youtube");
  const [urlValue, setUrlValue] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [tone, setTone] = useState<Tone>("professional");
  const [platforms, setPlatforms] = useState<Platform[]>(["twitter", "linkedin"]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  function togglePlatform(platform: Platform) {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (platforms.length === 0) {
      setError("Please select at least one platform to generate content for.");
      return;
    }

    if (inputType === "audio" && !audioFile) {
      setError("Please select an audio file to upload.");
      return;
    }

    if (inputType !== "audio" && !urlValue.trim()) {
      setError(`Please enter a ${inputType === "youtube" ? "YouTube" : "blog"} URL.`);
      return;
    }

    setLoading(true);

    try {
      // Step 1: extract transcript based on input type
      setStatusMessage("Extracting content...");
      let transcript = "";
      let title = "";
      let sourceUrl: string | undefined;
      let sourceFileName: string | undefined;

      if (inputType === "youtube") {
        const res = await fetch("/api/extract/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to extract YouTube transcript");
        transcript = data.transcript;
        title = "YouTube Video";
        sourceUrl = urlValue;
      } else if (inputType === "blog") {
        const res = await fetch("/api/extract/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to extract blog content");
        transcript = data.transcript;
        title = data.title || "Blog Article";
        sourceUrl = urlValue;
      } else if (inputType === "audio" && audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        const res = await fetch("/api/extract/audio", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to transcribe audio");
        transcript = data.transcript;
        title = audioFile.name;
        sourceFileName = audioFile.name;
      }

      if (!transcript) {
        throw new Error("No content could be extracted. Please try a different input.");
      }

      // Step 2: generate content for selected platforms
      setStatusMessage(
        `Generating content for ${platforms.length} platform${platforms.length > 1 ? "s" : ""}... this may take ${platforms.length * 10}-${platforms.length * 20} seconds.`
      );

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          inputType,
          tone,
          title,
          sourceUrl,
          sourceFileName,
          platforms,
        }),
      });

      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Failed to generate content");

      onResult(genData);
      setStatusMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatusMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
      {/* Input type selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Input type</label>
        <div className="flex gap-2">
          {(["youtube", "blog", "audio"] as InputType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setInputType(type)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                inputType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type === "youtube" ? "YouTube" : type === "blog" ? "Blog URL" : "Audio File"}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional input field */}
      {inputType === "audio" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Audio file</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600"
          />
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {inputType === "youtube" ? "YouTube URL" : "Blog URL"}
          </label>
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder={
              inputType === "youtube"
                ? "https://www.youtube.com/watch?v=..."
                : "https://example.com/blog-post"
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Tone picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as Tone)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
            <option key={t} value={t}>
              {TONE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Platform checkboxes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Generate for platforms
        </label>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
            <label
              key={p}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                platforms.includes(p)
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={platforms.includes(p)}
                onChange={() => togglePlatform(p)}
                className="sr-only"
              />
              {PLATFORM_LABELS[p]}
            </label>
          ))}
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {statusMessage && (
        <div className="rounded-md bg-indigo-50 p-3 text-sm text-indigo-700">{statusMessage}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Working..." : "Generate Content"}
      </button>
    </form>
  );
}