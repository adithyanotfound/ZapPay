import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import LockedCard from "../../../components/LockedCard";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)//next auth se string hi aega number bhi
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function () {
    const balance = await getBalance()
    const transactions = await getOnRampTransactions()
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Add Money to Wallet</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full space-y-6">
            <AddMoney/>
            <LockedCard locked={balance.locked}/>
          </div>
          <div className="space-y-6">
            <BalanceCard amount={balance.amount} locked={balance.locked} />
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    )
  }