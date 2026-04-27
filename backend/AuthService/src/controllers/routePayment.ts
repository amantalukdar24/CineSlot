import { Request,Response } from "express";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import dotenv from "dotenv";
import amqp from "amqplib";
import { connectRabbitMQ } from "../amqpConfig";

dotenv.config();

const checkValidQueryForPayment=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {forDate,movieId,time,selectedSeats}=req.body;
        const result=await fetchWithRetry(`${process.env.MovieService_Url}/payment/checkpaymentquery`,{
            method:"POST",
            headers:{
                 "Content-Type":"application/x-www-form-urlencoded",
            },
            body:new URLSearchParams({forDate,movieId,time,selectedSeats,bookedUser:req.user?._id})
        });
        const data=await result.json();
        return res.status(result.status).json(data);
        
    } catch(err) {
         console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}


const createOrder=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {selectedSeats}=req.body;
        const result=await fetchWithRetry(`${process.env.PaymentService_Url}/payment/createorder`,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
            body:new URLSearchParams({selectedSeats})
        });
        const data=await result.json();
        return res.status(result.status).json(data);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}

const verifyPayment=async (req:Request,res:Response):Promise<any>=>{
    try {
    
        const {selectedSeats,forDate,movieId,time,order_id,payment_id,signature}=req.body;
        const resVP=await fetchWithRetry(`${process.env.PaymentService_Url}/payment/verifypayment`,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",

            },
            body:new URLSearchParams({order_id,payment_id,signature})
        });
        const dataVP=await resVP.json();
        if(!dataVP.success) return res.status(resVP.status).json(dataVP);
        if(dataVP.success){
            const bookedUser=req.user?._id;
             const resMS=await fetchWithRetry(`${process.env.MovieService_Url}/seatbook/create`,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",

            },
            body:new URLSearchParams({selectedSeats,movieId,forDate,time,order_id,payment_id,bookedUser})
        });
        const dataMS=await resMS.json();
        if(dataMS.success){
          

            const {channel,connection}=await connectRabbitMQ();
            channel.prefetch(1)
            const routingkey:string=process.env.rbmq_email_ch_routing_key as string;
            const exchange:string=process.env.rbmq_email_ch_exchange as string;
            const mssg={
               to:req.user?.email,
               selectedSeats:JSON.parse(selectedSeats),
               movieName:dataMS.showTimeInfo.movieId.name,forDate:dataMS.showTimeInfo.forDate,time
            }
            await channel.assertExchange(exchange,"direct",{durable:true});
            await channel.assertQueue("mail_queue",{durable:true});
            await channel.bindQueue("mail_queue",exchange,routingkey);
            channel.publish(exchange,routingkey,Buffer.from(JSON.stringify(mssg)));
            setTimeout(()=>{
                 connection.close();
            },500);
        }
        return res.status(resMS.status).json(dataMS);
        }
       return res.status(resVP.status).json(dataVP);
    } catch (err) {
    console.log(`${err}`);
       return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
const paymentSuccessInfo=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {movieId,payment_id}=req.body;
        const result=await fetchWithRetry(`${process.env.MovieService_Url}/payment/paymentsuccess`,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
},
            body:new URLSearchParams({userId:req.user?._id,movieId,payment_id})
        });
        const data=await result.json();
        return res.status(result.status).json(data);
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
export {createOrder,verifyPayment,checkValidQueryForPayment,paymentSuccessInfo};