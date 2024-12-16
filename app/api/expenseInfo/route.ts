import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const expense = await prisma.post.findMany();
    return NextResponse.json(expense);

}


