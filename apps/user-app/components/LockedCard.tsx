"use client";

import React from "react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { releaseAmount } from "../app/lib/actions/releaseAmount";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LockedCard({locked}:{locked:number}) {

  if (locked=== 0) {
    return null;
  }
  const router=useRouter();

  return (
    <Card title={"Release Locked Amount"}>
      
        <div className="flex justify-between  py-2">
          <div>
              Total Locked Balance
          </div>
          <div>
              {locked / 100} INR
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              const res = await releaseAmount(locked);
              if (res.message === "Amount released successfully") {
                toast.success("Amount released successfully!");
              } else {
                toast.error("Failed to release amount.");
              }
              router.refresh()
            }}
          >
            Release Amount
          </Button>
        </div>

    </Card>
  );
}
