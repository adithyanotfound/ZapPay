import { getServerSession } from "next-auth";
import { RemoveMoney } from "../../../components/RemoveMoneyCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { OffRampTransactions } from "../../../components/OffRampTransactions";

export default async function () {
  const balance = await getBalance();
  const transactions = await getOffRampTransactions();

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Withdraw Money from Wallet</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="w-full">
        <RemoveMoney />
      </div>
      <div className="space-y-6">
        <BalanceCard amount={balance.amount} locked={balance.locked} />
        <OffRampTransactions transactions={transactions} />
      </div>
    </div>
  </div>
)}

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
async function getOffRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.offRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id)
    }
  });
  return txns.map((t: { startTime: any; amount: any; status: any; provider: any; }) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider
  }))
}