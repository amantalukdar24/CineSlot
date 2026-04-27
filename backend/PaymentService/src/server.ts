import express, { urlencoded,Request,Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import paymentRouter from "./routes/payment";
import sendMail from "./services/sendMail";
dotenv.config();
const PORT:number=Number(process.env.PORT) || 4002;
const app=express();
app.use(urlencoded());
app.use(cors());
sendMail();
app.get("/",async (req:Request,res,Response):Promise<any>=>{
    try {
        return res.status(200).json({success:true,mssg:"Server Waked Up!"});
        
    } catch (err) {
         console.log(`${err}`);
         return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
});
app.use("/payment",paymentRouter);
app.listen(PORT,()=>{console.log(`Payment Server Running on PORT:${PORT}`)});