export const dynamic = 'force-dynamic';


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const topics = await prisma.topic.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive", 
        },
      },
      take: 10,
    });

    return NextResponse.json({ filtered: topics }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Unable to get topics to search" },
      { status: 502 }
    );
  }
}
