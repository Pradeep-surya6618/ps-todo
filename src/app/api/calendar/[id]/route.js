import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import CalendarEvent from "@/models/CalendarEvent";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, description, date, type, color } = await req.json();
  await dbConnect();

  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, description, date, type, color },
      { new: true },
    );

    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  try {
    const event = await CalendarEvent.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ message: "Event deleted successful" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
