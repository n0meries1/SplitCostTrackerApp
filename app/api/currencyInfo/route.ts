import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const currency = await prisma.currency.findMany({
        orderBy: {
            createdAt: 'asc',
        },
    });
    return NextResponse.json(currency);

}


