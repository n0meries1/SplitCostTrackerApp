import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("Request body:", body); // Log incoming data

        // Ensure participant is processed correctly
        const participantString = Array.isArray(body.participant)
            ? body.participant.join(", ") // Join array into string
            : String(body.participant);   // Convert single value to string

        console.log("Joined participant string:", participantString); // Debug participant string

        const expenseValue = parseFloat(body.expense);
// honestly have no idea how to fix this
        if (isNaN(expenseValue)) {
            console.error("Invalid expense value:", body.expense);
            return NextResponse.json({ error: "Invalid expense value" }, { status: 400 });
        }

        
        const currencyRate = await prisma.currency.findMany();
        const matchingCurrency = currencyRate.find((xs) => xs.label === body.currency);
        const newCurrency = body.expense / matchingCurrency.rate;
        
        await prisma.post.create({
            data: {
                expense: newCurrency,
                currency: body.currency,
                participant: participantString,
                activity: body.activity,
            },
    });

    console.log("Data successfully inserted into Prisma");

        return NextResponse.json("successful");
    } catch (error) {
        console.error("Error inserting data into Prisma:", error);
        return NextResponse.json(
            { error: "Failed to create post", details: error.message },
            { status: 500 }
        );
    }

}


