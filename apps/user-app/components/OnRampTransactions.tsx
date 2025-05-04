"use client"
import { Card } from "@repo/ui/card"
import { useState } from "react"

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date
    amount: number
    status: string
    provider: string
  }[]
}) => {

  const [showAll,setShowAll]=useState(false);
  const visibleTransactions=showAll?transactions:transactions.slice(0,5);
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center py-8">No Recent transactions</div>
      </Card>
    )
  }
  return (
    <Card title="Recent Transactions">
      <div className="space-y-4 pt-2">
        {visibleTransactions.map((t, index) => (
          <div key={index} className="flex justify-between">
            <div>
            <div className={`${t.status === "Success" ? "text-green-500 " : "text-red-500"}`}>{t.status}</div>
              <div className="text-slate-600 text-xs">{t.time.toDateString()}</div>
            </div>
            <div className="flex flex-col justify-center">+ Rs {t.amount / 100}</div>
          </div>
        ))}
        {transactions.length>5 && (
          <button className="text-blue-500 text-sm mt-3 underline w-full text-center"
            onClick={()=>setShowAll(!showAll)}>
            {showAll?`Show less`:`+${transactions.length-5} more transactions`}
          </button>
        )}

      </div>
    </Card>
  )
}