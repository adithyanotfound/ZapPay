import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickActionsCard from "../../../components/QuickActionsCard";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findFirst({
    where: { userId },
  });
  return {
    amount: balance?.amount ?? 0,
    locked: balance?.locked ?? 0,
  };
}

async function getP2P(userId: number) {
  return await prisma.p2pTransfer.count({
    where: { fromUserId: userId },
  });
}

async function totalP2P(userId: number) {
  const totalAmount = await prisma.p2pTransfer.aggregate({
    _sum: { amount: true },
    where: { fromUserId: userId },
  });
  return totalAmount._sum.amount ?? 0;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return <div className="p-10 text-center">Please log in to view your dashboard.</div>;
  }

  const [balance, p2pCount, totalExpenses] = await Promise.all([
    getBalance(userId),
    getP2P(userId),
    totalP2P(userId),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols p-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balance.amount / 100}</div>
          <p className="text-xs text-muted-foreground">+20.1 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{p2pCount}</div>
          <p className="text-xs text-muted-foreground">+10.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExpenses/100}</div>
          <p className="text-xs text-muted-foreground">-5.2% from last month</p>
        </CardContent>
      </Card>
      <QuickActionsCard />
    </div>
  )
}