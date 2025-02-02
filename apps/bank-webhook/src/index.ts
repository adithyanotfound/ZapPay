import express from "express";
import db from "@repo/db/client";
import * as Cors from "cors";
const app = express();

app.use(Cors.default()); // Use Cors.default() instead of cors()
app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)//cuz json se h expess.json
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.post("/axisWebhook", async (req, res) => {
    
    const { token, amount } = req.body;
    const userId=req.body.user_identifier; // Received as a string (even if sent as a number)
    
    // Axis bank should ideally send us a secret so we know this is sent by them
    
    /*if (req.headers["x-bank-secret"] !== process.env.BANK_SECRET) {
        return res.status(403).json({ message: "Unauthorized request" });
    }
    */
   console.log("Axis Webhook pe aagya")

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: { userId: Number(userId) },
                data: { amount: { increment: Number(amount) } }
            }),
            db.onRampTransaction.updateMany({
                where: { token },
                data: { status: "Success" }
            }),
            db.axisBank.updateMany({
                where: { userId: Number(userId) },
                data: { locked: { decrement: Number(amount) } }
            })
        ]);
        console.log("SAB KUCH DONE !!!")
        return res.json({ message: "Captured successfully" });
    } 
    catch (error) 
    {
        console.error("Error in axisWebhook:", error);

        // Rollback funds in case of failure
        await db.axisBank.updateMany({
            where: { userId: Number(userId) },
            data: {
                locked: { decrement: Number(amount) },
                amount: { increment: Number(amount) }
            }
        });

        return res.status(500).json({ message: "Error processing webhook" });
    }
})
app.listen(3003);

function cors(): any {
    throw new Error("Function not implemented.");
}
