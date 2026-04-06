import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/conversations - 获取所有对话
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("获取对话失败:", error);
    return NextResponse.json(
      { error: "获取对话失败" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - 添加新对话
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, tags, model, content } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { error: "标题和摘要不能为空" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        summary,
        content: content || null,
        tags: tags || "",
        model: model || null,
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("创建对话失败:", error);
    return NextResponse.json(
      { error: "创建对话失败" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations?id=xxx - 删除对话
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
    }

    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除对话失败:", error);
    return NextResponse.json(
      { error: "删除对话失败" },
      { status: 500 }
    );
  }
}
