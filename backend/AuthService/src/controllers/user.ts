import {Request,Response} from "express";
import USER from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OTP from "../models/otp"
import bycrpt from "bcrypt"
import nodemailer from "nodemailer";
import { sendMail } from "../services/sendMail";
dotenv.config();
const registerUser=async (req:Request,res:Response):Promise<any>=>{
    try{
    const {name,email,finalOtp}=req.body;
    const existEmail=await USER.findOne({email:email.toLowerCase()});
    if(existEmail) return res.status(409).json({success:false,mssg:"Email Exist"});
    
    const otpMatch=await OTP.findOne({email:email.toLowerCase()});
   
    if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const hashOtp=await bycrpt.compare(finalOtp,otpMatch.otp);
   
    if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const user=await USER.create({
        name,
        email:email.toLowerCase()
    });
    if(user){
        const token:string=await jwt.sign({_id:user._id,name:user.name,email:user.email},process.env.JWT_KEY as string);
         await OTP.findOneAndDelete({email:email.toLowerCase()});
         return res.status(201).json({success:true,mssg:"Account Created",token});
    }
    else return res.status(404).json({success:false,mssg:"Something Went Wrong"});
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
            const existEmail=await USER.findOne({email:email.toLowerCase()});
    if(!existEmail) return res.status(409).json({success:false,mssg:"User didn't Exist Signup"});
        }
            if(mode==="signup"){
            const existEmail=await USER.findOne({email:email.toLowerCase()});
    if(existEmail) return res.status(409).json({success:false,mssg:"User Exist Signin"});
        }
    let otp:string="";
    for(let i=0;i<4;i++){
      otp+=Math.floor(Math.random()*10);
    }
    const isMailSend=await sendMail(email.toLowerCase(),otp,false,mode);
    if(!isMailSend) return res.status(400).json({success:false,mssg:"Something Went Wrong, Try Again"});
    const hashedOtp:string=await bycrpt.hash(otp,10);
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

const loginUser=async (req:Request,res:Response):Promise<any>=>{
    try {
         const {email,finalOtp}=req.body;
     
    const user=await USER.findOne({email:email.toLowerCase()});
    if(!user) return res.status(409).json({success:false,mssg:"User didn't Exist Signup"});
     const otpMatch=await OTP.findOne({email:email.toLowerCase()});
    if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const hashOtp=await bycrpt.compare(finalOtp,otpMatch.otp);
    if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const token=await jwt.sign({_id:user._id,name:user.name,email:user.email},process.env.JWT_KEY as string);
    if(token){
    await OTP.deleteOne({email:email.toLowerCase()});
    return res.status(200).json({success:true,mssg:"Welcome Back!",token});
    }
    return res.status(404).json({success:false,mssg:"Something went wrong"});

    } catch (err) {
        console.log(err);
        return res.status(500).json({success:false,mssg:"Internal Server Error"});
    }
}
const getUser=async (req:Request,res:Response):Promise<any>=>{
     try{
        const {id}=req.query;
        if(!id) return res.status(400).json({success:false,mssg:"Invalid Request"});
        const user=await USER.findById(id);
        if(!user) return res.status(404).json({success:false,mssg:"User Not Found"});
        return res.status(200).json({success:true,user});
     }
     catch(err){
      console.log(err);
      return res.status(500).json({success:false,mssg:"Internal Server Error"});
     }
}
const getAccountDetails=async (req:Request,res:Response):Promise<any>=>{
  try {
    const id=req.user?._id;
    const user=await USER.findById(id);
    if(!user) return res.status(400).json({success:false,mssg:"Accout Not Found"})
    return res.status(200).json({success:true,user});
  } catch (err) {
    console.log(err);
    return res.status(500).json({success:false,mssg:"Internal Server Error"});
  }
}
export {registerUser,getOtp,loginUser,getUser,getAccountDetails};