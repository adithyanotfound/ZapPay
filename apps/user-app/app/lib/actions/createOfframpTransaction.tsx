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
  try
  {
    const balance=await prisma.balance.findUnique({
      where:{
        userId:Number(session.user.id)
      }
    })
    //@ts-ignore
    if(balance?.amount<amount)
    {
      throw new Error("Not enough Balance");
    }
    
    await prisma.$transaction([
      prisma.offRampTransaction.create({
        data: {
            provider,
            status: "Processing", // Use Enum in schema if possible
            startTime: new Date(),
            token,
            userId: Number(session.user.id),
            amount: amount * 100
        }
      })
      ,
      prisma.balance.updateMany({
        where:{userId:Number(session.user.id)},
        data:{
          locked :{increment: amount*100},
          amount :{decrement:amount*100}
        }
      })
    ])
    console.log("OffRampTransaction created and wallet se locked mei daal diya")
    
    const bankEndpoint = provider === "Axis Bank" ? "http://localhost:3004/axisBankWithdrawl" : "http://localhost:3005/hdfcBankWithdrawl";
    
    const bankResponse=await axios.post(bankEndpoint,{token, userId: Number(session.user.id), amount:(Number(amount)*100 )})
    if (bankResponse.status !== 200) { // Or whatever your success code is
        throw new Error("Bank transaction failed: " + bankResponse.data?.message || JSON.stringify(bankResponse.data) || bankResponse.statusText);  // Re-throw with details from the bank
    }
    return { message: "Done" };
  }
  catch(error:any){
    await prisma.balance.update({
      where:{userId:Number(session.user.id)},
      data:{
        locked :{decrement: amount*100},
        amount :{increment:amount*100}
      }
    })
    await prisma.offRampTransaction.update({
      where: { token },
      data: { status: "Failure" }
    })

    console.error("Error creating OffRampTransaction:", error);
    throw new Error(error.message || "Withdrawal failed");
    

  }
}