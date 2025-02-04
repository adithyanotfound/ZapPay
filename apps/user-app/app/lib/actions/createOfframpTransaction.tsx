"use server";
import axios from "axios";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import crypto from "crypto";

export async function createOffRampTransaction(provider: string, amount: number){
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
      return { message: "Unauthenticated request" };
  }
  
  const token = crypto.randomUUID();
  
  const balance=prisma.balance.findUnique({
    where:{
      userId:Number(session.userId.id)
    }
  })
//@ts-ignore
  if(balance?.amount<amount)
  {
    return {message:"Not Enough amount"};
  }
  try{
    await prisma.offRampTransaction.create({
      data: {
          provider,
          status: "Processing", // Use Enum in schema if possible
          startTime: new Date(),
          token,
          userId: Number(session.user.id),
          amount: amount * 100
      }
    });

    await prisma.balance.updateMany({
      where:{userId:Number(session.user.id)},
      data:{
        locked :{increment: amount},
        amount :{decrement:amount}
      }
    })

    const bankEndpoint = provider === "Axis Bank" ? "http://localhost:3004/axisBankWithdrawl" : "http://localhost:3005/hdfcBankWithdrawl";
    
    await axios.post(bankEndpoint,{token, userId: Number(session.user.id), amount:(Number(amount)*100 )})

    return { message: "Done" };
  }
  catch(error){
    console.error("Error creating OffRampTransaction:", error);
    return { message: "Withdrawl failed" };

  }
}