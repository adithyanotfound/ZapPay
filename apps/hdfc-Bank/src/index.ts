import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcBank", async (req, res) => {
  const token=req.body.token;
  const userId=req.body.userId;


    
})

app.listen(3005);