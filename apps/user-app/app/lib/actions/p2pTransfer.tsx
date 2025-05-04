"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    try {
        const session = await getServerSession(authOptions);
        const from = session?.user?.id;
        if (!from) {
            throw new Error("Error while sending: User not authenticated");
        }

        const toUser = await prisma.user.findFirst({
            where: { number: to }
        });

        if (!toUser) {
            throw new Error("User not found");
        }

        await prisma.$transaction(async (tx: { $queryRaw: any; balance: { findUnique: (arg0: { where: { userId: number; }; }) => any; update: (arg0: { where: { userId: number; } | { userId: any; }; data: { amount: { decrement: number; }; } | { amount: { increment: number; }; }; }) => any; }; p2pTransfer: { create: (arg0: { data: { amount: number; fromUserId: number; toUserId: any; timestamp: Date; }; }) => any; }; }) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });
            
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });
            await tx.p2pTransfer.create({
                data:{
                    amount,
                    fromUserId:Number(from),
                    toUserId:toUser.id,
                    timestamp:new Date()
                }
            })
        });

        return { success: true, message: "Transfer successful" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}