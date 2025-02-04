import { getServerSession } from "next-auth";
import { RemoveMoney } from "../../../components/RemoveMoneyCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { OffRampTransactions } from "../../../components/OffRampTransactions";

export default async function() {

  const balance = await getBalance();
  const transactions = await getOffRampTransactions();

  return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
      Withdraw Funds
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div>
          <RemoveMoney />
      </div>
      <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
              <OffRampTransactions transactions={transactions} />
          </div>
      </div>
    </div>
  </div>
}

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
  return txns.map(t => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider
  }))
}
