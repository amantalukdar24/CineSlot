import { Request,Response } from "express";
import createRazorpayInstance from "../razorpayConfig";
import crypto from "crypto";
const razorpayInstance=createRazorpayInstance();

const createOrder=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {selectedSeats}=req.body;
         let amount=0;
        const parseSelectedSeats=JSON.parse(selectedSeats);
        parseSelectedSeats.forEach((seat:string)=>{
            if(seat.startsWith("A")) amount+=100;
            else if(seat.startsWith("B")) amount+=200;
            else if(seat.startsWith("C")) amount+=350;
        });
        const options={
            amount:amount*100,
            currency:"INR",
            receipt:"receipt_order_id"
        }
        razorpayInstance.orders.create(options,(err,order)=>{
            if(err){
             
                return res.status(404).json({success:false,mssg:"Something Went Wrong"})
            }
         
            return res.status(200).json({success:true,order});
        })
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
        
    }
}
const verifyPayment=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {order_id,payment_id,signature}=req.body;
         const secret=process.env.RazorPay_API_Secret as string;
        const hmac=crypto.createHmac("sha256",secret);
        hmac.update(order_id+"|"+payment_id);
        const generatedSignature=hmac.digest("hex");
        if(generatedSignature===signature){
            return res.status(200).json({success:true,mssg:"Payment Verified"})
        }
        else return res.status(400).json({success:false,mssg:"Payment Failed"})

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
        
    }
}

export {createOrder,verifyPayment};