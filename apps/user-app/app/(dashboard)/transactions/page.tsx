import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const userId = Number(session.user.id);

    const sentTransactions = await prisma.p2pTransfer.findMany({
        where: { fromUserId: userId },
        select: {
            id: true,
            timestamp: true,
            amount: true,
            toUser: { select: { number: true } }
        }
    });

    const receivedTransactions = await prisma.p2pTransfer.findMany({
        where: { toUserId: userId },
        select: {
            id: true,
            timestamp: true,
            amount: true,
            fromUser: { select: { number: true } }
        }
    });

    return [
        ...sentTransactions.map(tx => ({
            id: tx.id,
            date: new Date(tx.timestamp),
            user: tx.toUser.number,
            amount: tx.amount,
            type: "debit"
        })),
        ...receivedTransactions.map(tx => ({
            id: tx.id,
            date: new Date(tx.timestamp),
            user: tx.fromUser.number,
            amount: tx.amount,
            type: "credit"
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(tx => ({ ...tx, date: tx.date.toISOString().split("T")[0] }));
}

export default async function TransactionHistory() {
    const transactions = await getTransactions();

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Sender / Recipient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.user}</TableCell>
                                        <TableCell>&#8377; {transaction.amount / 100}</TableCell>
                                        <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                                            {transaction.type === "credit" ? "+" : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}