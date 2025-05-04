"use client";
import { useState } from "react";
import { Card } from "@repo/ui/card";

export const OffRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: "Success" | "Failure" | "Processing";
        provider: string;
    }[];
}) => {
    const [showAll, setShowAll] = useState(false);
    const visibleTransactions = showAll ? transactions : transactions.slice(0, 5);

    if (!transactions.length) {
        return (
            <Card title="Recent Withdrawals">
                <div className="text-center pb-8 pt-8">No Recent Withdrawals</div>
            </Card>
        );
    }

    return (
        <Card title="Recent Withdrawals">
            <div className="pt-2">
                {visibleTransactions.map((t, index) => (
                    <div key={index} className="flex justify-between mt-3">
                        <div>
                            <div className={`${t.status === "Success" ? "text-green-500" : "text-red-500"}`}>
                                {t.status}
                            </div>
                            <div className="text-slate-600 text-xs">{t.time.toDateString()}</div>
                        </div>
                        <div className="flex flex-col justify-center">+ Rs {t.amount / 100}</div>
                    </div>
                ))}
                {transactions.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-500 text-sm mt-3 underline w-full text-center"
                    >
                        {showAll ? "Show Less" : `+${transactions.length - 5} more transactions`}
                    </button>
                )}
            </div>
        </Card>
    );
};
