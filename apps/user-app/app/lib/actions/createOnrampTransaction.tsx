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

        const bankResponse=await axios.post(bankEndpoint, { token, userId: Number(session.user.id), amount:(Number(amount)*100 )});
        if (bankResponse.status !== 200) { // Or whatever your success code is
            throw new Error("Bank transaction failed: " + bankResponse.data?.message || JSON.stringify(bankResponse.data) || bankResponse.statusText);  // Re-throw with details from the bank
        }
        return { message: "Done" };
    } catch (error:any) {
        await prisma.onRampTransaction.update({
            where: { token },
            data: { status: "Failure" }
        })
        console.error("Error creating OnRampTransaction:", error);
        throw new Error(error.message || "Withdrawal failed");
    }
}
