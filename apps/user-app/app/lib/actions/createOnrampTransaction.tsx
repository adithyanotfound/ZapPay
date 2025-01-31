"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
//entry in OnRampTransaction table
export async function createOnRampTransaction(provider: string, amount: number) {
    // ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }

    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: crypto.randomUUID(),
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    });

    return {
        message: "Done"
    }
}
