"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function releaseAmount(lockedAmount: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { message: "Unauthenticated request" };
    }

    await prisma.balance.update({
      where: { userId: Number(session.user.id) },
      data: {
        amount: { increment: lockedAmount },
        locked: { decrement: lockedAmount },
      },
    });

    return { message: "Amount released successfully" };
  } catch (error) {
    console.error("Error during transaction:", error);
    return { message: "Internal Server Error" };
  }
}
