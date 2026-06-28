"use client";

import { signOut } from "next-auth/react";

export default function DashboardClient({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">RepurposeAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {userName}</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Create content</h2>
        <p className="mt-1 text-sm text-gray-600">
          Paste a YouTube link, blog URL, or upload audio to get started.
        </p>
        {/* Form goes here in next step */}
      </main>
    </div>
  );
}