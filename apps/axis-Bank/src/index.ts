import express from "express";
import db from "@repo/db/client";
import axios from "axios";

const app = express();
import * as Cors from "cors";

app.use(Cors.default()); // Use Cors.default() instead of cors()
app.use(express.json())

app.post("/axisBank", async (req, res): Promise<any> => {
  const { token, userId, amount } = req.body;
  console.log("Axis Bank Transaction Started");

  try 
  {
      const transaction = await db.onRampTransaction.findUnique({
          where: { userId: Number(userId), token }
      });

      if (!transaction || transaction.status !== "Processing") {
          return res.status(400).json({ message: "Invalid transaction status" });
      }

      const userBalance = await db.axisBank.findUnique({
          where: { userId: Number(userId) }
      });

      if (!userBalance || userBalance.amount < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
      }

      await db.axisBank.update({
          where: { userId: Number(userId) },
          data: {
              amount: { decrement: Number(amount) },
              locked: { increment: Number(amount) }
          }
      });
      console.log("Amount Shi h locked bhi krdia. Ab webhook ko bolrhe")

      await axios.post("http://localhost:3003/axisWebhook", { token, user_identifier: userId, amount });
      console.log("webhook se aagye sb badhiya")
      return res.json({ message: "Webhook triggered successfully" });
  } catch (error) {
      console.error("AxisBank error:", error);
      return res.status(500).json({
         message: "Axis mein aya kuch to" 
      });
  }
});

app.post("/axisBankWithdrawl", async (req, res): Promise<any> => {
    const { token, userId, amount } = req.body;
    try{
        console.log("axisbank mei aa gya")
        const transaction = await db.offRampTransaction.findUnique({
            where: { userId: Number(userId), token }
        });
  
        if (!transaction || transaction.status !== "Processing") {
            return res.status(400).json({ message: "Invalid transaction status" });
        }

        await db.axisBank.update({
            where:{
                userId:Number(userId)
            },
            data:{
                locked:{
                    increment:Number(amount)
                }
            }
        })
        console.log("axis ka locked bda diya")

        await axios.post("http://localhost:3003/axisWebWithdrawl", { token, user_identifier: userId, amount });
        console.log("webhook se aagye sb badhiya")
        return res.status(200).json({ message: "Webhook triggered successfully" });

    }
    catch (error) {
        console.error("AxisBank error:", error);
        return res.status(500).json({
           message: "Axis mein aya kuch to" 
        });
    }
})


app.listen(3004);

function cors(): any {
  throw new Error("Function not implemented.");
}
