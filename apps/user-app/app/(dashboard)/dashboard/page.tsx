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

async function getAxisAmount(userId:number){
  const data=await prisma.axisBank.findUnique({
    where:{userId}
  })

  return data?.amount ?? 0;
}
async function getHdfcAmount(userId:number){
  const data=await prisma.hDFCBank.findUnique({
    where:{userId}
  })

  return data?.amount ?? 0;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) {
    return <div className="p-10 text-center">Please log in to view your dashboard.</div>;
  }

  const [balance, p2pCount, totalExpenses,hAmount,axisAmount] = await Promise.all([
    getBalance(userId),
    getP2P(userId),
    totalP2P(userId),
    getHdfcAmount(userId),
    getAxisAmount(userId)
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
          <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-around">
          <div className="text-l ">HDFC: {hAmount/100}</div>
          <div className="text-l ">Axis: {axisAmount/100}</div>
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