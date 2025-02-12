import { Card } from "@repo/ui/card"

export const OffRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Withdrawals">
            <div className="text-center pb-8 pt-8">
                No Recent withdrawals
            </div>
        </Card>
    }
    return <Card title="Recent Withdrawls">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between mt-3">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}