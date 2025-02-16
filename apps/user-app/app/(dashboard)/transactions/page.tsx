import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const transactions = [
    { id: 1, date: "2023-06-01", description: "Received from John Doe", amount: 100, type: "credit" },
    { id: 2, date: "2023-06-02", description: "Sent to Jane Smith", amount: 50, type: "debit" },
    { id: 3, date: "2023-06-03", description: "Added from Bank Account", amount: 200, type: "credit" },
    { id: 4, date: "2023-06-04", description: "Coffee Shop", amount: 5, type: "debit" },
    { id: 5, date: "2023-06-05", description: "Salary Deposit", amount: 3000, type: "credit" },
]

export default function TransactionHistory() {
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
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                                    <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                                        {transaction.type === "credit" ? "+" : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

    )
}