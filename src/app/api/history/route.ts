import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Content } from "@/lib/models/Content";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
    }

    await connectDB();

    const contents = await Content.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .select("title inputType tone outputs createdAt sourceUrl sourceFileName");

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}