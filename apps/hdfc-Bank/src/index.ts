import express from "express";
import db from "@repo/db/client";
import axios from "axios";

const app = express();
import * as Cors from "cors";

app.use(Cors.default()); // Use Cors.default() instead of cors()
app.use(express.json())

app.post("/hdfcBank", async (req, res):Promise<any> => {
  const { token, userId, amount } = req.body;
  console.log("HDFC Bank Transaction Started");

  try 
  {
      const transaction = await db.onRampTransaction.findUnique({
          where: { userId: Number(userId), token }
      });

      if (!transaction || transaction.status !== "Processing") {
          return res.status(400).json({ message: "Invalid transaction status" });
      }

      const userBalance = await db.hDFCBank.findUnique({
          where: { userId: Number(userId) }
      });

      if (!userBalance || userBalance.amount < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
      }

      await db.hDFCBank.update({
          where: { userId: Number(userId) },
          data: {
              amount: { decrement: Number(amount) },
              locked: { increment: Number(amount) }
          }
      });
      console.log("Amount Shi h locked bhi krdia. Ab webhook ko bolrhe")

      await axios.post("http://localhost:3003/hdfcWebhook", { token, user_identifier: userId, amount });
      console.log("webhook se aagye sb badhiya")
      return res.json({ message: "Webhook triggered successfully" });
  } catch (error) {
      console.error("hdfcBank error:", error);
      return res.status(500).json({
         message: "hdfc mein aya kuch to" 
      });
  }
    
})

app.listen(3005);