
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { quizId, cost } = await req.json();

        if (!quizId || typeof cost !== 'number' || cost <= 0) {
            return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
        }

        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { coins: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        if (user.coins < cost) {
            return NextResponse.json({ error: "Not enough coins." }, { status: 403 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { coins: { decrement: cost } }
        });

        return NextResponse.json({ success: true, message: "Coins deducted successfully." });

    } catch (error) {
        console.error("Error deducting coins:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}