import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import User from "@/models/User";
import { NextResponse } from "next/server";

async function getUserId(session) {
  if (!session?.user?.id && session?.user?.email) {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?._id;
  }
  return session?.user?.id;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    let query = { userId };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    if (tag) {
      query.tags = tag;
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const body = await request.json();

    const note = await Note.create({
      userId,
      title: body.title,
      content: body.content || "",
      color: body.color || "#ff2e63",
      isPinned: body.isPinned || false,
      tags: body.tags || [],
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
