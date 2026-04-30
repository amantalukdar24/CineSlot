import ADMIN from "../models/admin";
import OTP from "../models/otp";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt    from "bcrypt";
import nodemailer from "nodemailer";
import { Request,Response } from "express";
import {sendMail} from "../services/sendMail";
dotenv.config();

const registerAdmin=async (req:Request,res:Response)=>{
    try{
          const {name,email,address,finalOtp} =req.body;
           const existEmail=await ADMIN.findOne({email:email.toLowerCase()});
           if(existEmail) return res.status(409).json({success:false,mssg:"Email Exist"});
           const otpMatch=await OTP.findOne({email:email.toLowerCase()});
         if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
            const hashOtp=await bcrypt.compare(finalOtp,otpMatch.otp);
            
            if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
             
            const admin=await ADMIN.create({
                name,
                email:email.toLowerCase(),
               address:JSON.parse(address)
            });
         if(admin) {
            
            const token=await jwt.sign({_id:admin._id,name:admin.name,email:admin.email,address:admin.address},process.env.JWT_KEY as string);
             await OTP.findOneAndDelete({email:email.toLowerCase()});
            return res.status(201).json({success:true,mssg:"Admin Account Created",token});
         }
         return res.status(400).json({success:false,mssg:"Something went wrong"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}

const getOtp=async (req:Request,res:Response):Promise<any>=>{
    try {
      
        const {email,mode}=req.body;

        if(mode==="signin"){
            const existEmail=await ADMIN.findOne({email:email.toLowerCase()});
    if(!existEmail) return res.status(409).json({success:false,mssg:"Admin's Email didn't Exist Signup"});
        }
            if(mode==="signup"){
            const existEmail=await ADMIN.findOne({email:email.toLowerCase()});
    if(existEmail) return res.status(409).json({success:false,mssg:"Admin's Email Exist Signin"});
        }
    let otp:string="";
    for(let i=0;i<4;i++){
      otp+=Math.floor(Math.random()*10);
    }
    const isMailSend=await sendMail(email.toLowerCase(),otp,true);
    if(!isMailSend) return res.status(400).json({success:false,mssg:"Something Went Wrong, Try Again"});
    const hashedOtp:string=await bcrypt.hash(otp,10);
    const existOtp=await OTP.findOne({email:email.toLowerCase()});
    if(existOtp){
         const result=await OTP.findByIdAndUpdate(existOtp._id,{
            otp:hashedOtp
         });
         if(result) return res.status(201).json({success:true,mssg:"Otp has been sent to your email"});
    }
    else{
        const result=await OTP.create({
            email:email.toLowerCase(),
            otp:hashedOtp
        });
if(result) return res.status(201).json({success:true,mssg:"Otp has been sent to your email"});
    }
    return res.status(404).json({success:false,mssg:"Something went wrong"});
    
    } catch (err) {
        console.log(err)
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}

const loginAdmin=async (req:Request,res:Response):Promise<any>=>{
    try {
         const {email,finalOtp}=req.body;
     
    const admin=await ADMIN.findOne({email:email.toLowerCase()});
    if(!admin) return res.status(409).json({success:false,mssg:"Admin's Email didn't Exist Signup"});
     const otpMatch=await OTP.findOne({email:email.toLowerCase()});
    if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const hashOtp=await bcrypt.compare(finalOtp,otpMatch.otp);
    if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const token=await jwt.sign({_id:admin._id,name:admin.name,email:admin.email,address:admin.address},process.env.JWT_KEY as string);
    if(token){
    await OTP.deleteOne({email:email.toLowerCase()});
    return res.status(200).json({success:true,mssg:"Welcome Back!",token});
    }
    return res.status(404).json({success:false,mssg:"Something went wrong"});

    } catch (err) {
        console.log(err)
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
const getAccountDetails=async (req:Request,res:Response):Promise<any>=>{
  try {
    const id=req.user?._id;
    const user=await ADMIN.findById(id);
    if(!user) return res.status(400).json({success:false,mssg:"Accout Not Found"})
    return res.status(200).json({success:true,user});
  } catch (err) {
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
export {registerAdmin,getOtp,loginAdmin,getAccountDetails};