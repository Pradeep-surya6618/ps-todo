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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const { id } = await params;
    const body = await request.json();

    const safeUpdates = {};
    if (body.title !== undefined) safeUpdates.title = body.title;
    if (body.content !== undefined) safeUpdates.content = body.content;
    if (body.color !== undefined) safeUpdates.color = body.color;
    if (body.isPinned !== undefined) safeUpdates.isPinned = body.isPinned;
    if (body.tags !== undefined) safeUpdates.tags = body.tags;
    if (body.isArchived !== undefined) safeUpdates.isArchived = body.isArchived;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { $set: safeUpdates },
      { new: true },
    );

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const { id } = await params;

    const note = await Note.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
