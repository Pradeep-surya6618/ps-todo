import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import Todo from "@/models/Todo";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let updates = {};
  try {
    updates = await req.json();
  } catch (e) {
    // Body might be empty
  }
  await dbConnect();
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updates,
      { new: true },
    );
    if (!todo)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    return NextResponse.json(todo);
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
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });
    if (!todo)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
