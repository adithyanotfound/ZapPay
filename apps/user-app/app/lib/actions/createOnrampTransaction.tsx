"use server";
import axios from "axios";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import crypto from "crypto";

export async function createOnRampTransaction(provider: string, amount: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { message: "Unauthenticated request" };
    }

    const token = crypto.randomUUID();
    console.log("Aagya OnRampTransaction pe")
    console.log(token)
    try {
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing", // Use Enum in schema if possible
                startTime: new Date(),
                token,
                userId: Number(session.user.id),
                amount: amount * 100
            }
        });
        
        console.log("OnRampTransaction Processed")

        const bankEndpoint = provider === "Axis Bank" ? "http://localhost:3004/axisBank" : "http://localhost:3005/hdfcBank";

        await axios.post(bankEndpoint, { token, userId: Number(session.user.id), amount:(Number(amount)*100 )});
        console.log("Bank ko Post krdia")
        return { message: "Done" };
    } catch (error) {
        await prisma.onRampTransaction.update({
            where: { token },
            data: { status: "Failure" }
        })
        console.error("Error creating OnRampTransaction:", error);
        return { message: "Transaction failed" };
    }
}
