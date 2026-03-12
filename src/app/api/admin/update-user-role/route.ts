export const dynamic = 'force-dynamic';


import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";


interface UpdateRolePayload {
    userId: string;
    newRole: string;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
        return NextResponse.json(
            { message: "Unauthorized. Must be an administrator." },
            { status: 403 }
        );
    }

    try {
        
        const { userId, newRole }: UpdateRolePayload = await req.json();

        if (!userId || !newRole) {
            return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            
            select: { id: true, name: true, email: true, role: true }, 
        });
    
        return NextResponse.json({ message: "User role updated successfully.", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Failed to update user role:", error);
        return NextResponse.json({ message: "Failed to update user role." }, { status: 500 });
    }
}
