"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import OutputDisplay from "../dashboard/OutputDisplay";
import { Platform } from "../dashboard/ContentForm";

interface HistoryItem {
  _id: string;
  title: string;
  inputType: string;
  tone: string;
  createdAt: string;
  outputs: { platform: Platform; content: string }[];
  sourceUrl?: string;
  sourceFileName?: string;
}

const INPUT_TYPE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  blog: "Blog",
  audio: "Audio",
};

export default function HistoryClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load history");
        setItems(data.contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            RepurposeAI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              New content
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900">Your content history</h2>

        {loading && <p className="mt-4 text-sm text-gray-600">Loading...</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">
            No content yet.{" "}
            <Link href="/dashboard" className="text-indigo-600 hover:underline">
              Create your first piece of content
            </Link>
            .
          </p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelected(item)}
              className="rounded-xl bg-white p-4 text-left shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {INPUT_TYPE_LABELS[item.inputType] || item.inputType}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-2 truncate text-sm font-medium text-gray-900">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-500">
                {item.outputs.length} platform{item.outputs.length !== 1 ? "s" : ""} generated
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{selected.title}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <OutputDisplay result={{ contentId: selected._id, outputs: selected.outputs }} />
          </div>
        )}
      </main>
    </div>
  );
}