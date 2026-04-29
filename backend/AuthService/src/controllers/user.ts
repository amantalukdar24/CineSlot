import {Request,Response} from "express";
import USER from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OTP from "../models/otp"
import bycrpt from "bcrypt"
import nodemailer from "nodemailer"
dotenv.config();
const registerUser=async (req:Request,res:Response):Promise<any>=>{
    try{
    const {name,email,finalOtp}=req.body;
    const existEmail=await USER.findOne({email});
    if(existEmail) return res.status(409).json({success:false,mssg:"Email Exist"});
    
    const otpMatch=await OTP.findOne({email});
   
    if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const hashOtp=await bycrpt.compare(finalOtp,otpMatch.otp);
   
    if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const user=await USER.create({
        name,
        email
    });
    if(user){
        const token:string=await jwt.sign({_id:user._id,name:user.name,email:user.email},process.env.JWT_KEY as string);
         await OTP.findOneAndDelete({email});
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
            const existEmail=await USER.findOne({email});
    if(!existEmail) return res.status(409).json({success:false,mssg:"User didn't Exist Signup"});
        }
            if(mode==="signup"){
            const existEmail=await USER.findOne({email});
    if(existEmail) return res.status(409).json({success:false,mssg:"User Exist Signin"});
        }
    let otp:string="";
    for(let i=0;i<4;i++){
      otp+=Math.floor(Math.random()*10);
    }
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        requireTLS:true,
        logger:true,
        debug:true,
        auth:{
            user:process.env.NM_email,
            pass:process.env.NM_pass
        }
    });
    const mailOptions = {
  from: process.env.NM_email,
  to:email,
  subject: "CineSlot | Email Verification OTP",
  html: `
  <div style="max-width:600px; margin:0 auto; padding:20px; font-family:Arial, sans-serif; background-color:#f9f9f9;">
    
    <h1 style="color:orangered; text-align:center;">
      🎬 Welcome to CineSlot!
    </h1>

    <p style="font-size:16px; color:#333;">
      Hi there,
    </p>

    <p style="font-size:16px; color:#333;">
      Thank you for signing up on <strong>CineSlot</strong>.  
      Please use the OTP below to verify your email address.
    </p>

    <div style="margin:30px 0; text-align:center;">
      <span style="
        display:inline-block;
        padding:15px 30px;
        font-size:24px;
        letter-spacing:5px;
        font-weight:bold;
        background-color:#fff;
        color:#000;
        border:2px dashed orangered;
        border-radius:8px;
      ">
        ${otp}
      </span>
    </div>

    <p style="font-size:14px; color:#555;">
      This OTP is valid for <strong>10 minutes</strong>.  
      Do not share it with anyone.
    </p>

    <p style="font-size:14px; color:#555;">
      If you didn’t request this, you can safely ignore this email.
    </p>

    <hr style="margin:30px 0;" />

    <p style="font-size:12px; color:#999; text-align:center;">
      © ${new Date().getFullYear()} CineSlot. All rights reserved.
    </p>
  </div>
  `
};

  await  transporter.sendMail(mailOptions);

    const hashedOtp:string=await bycrpt.hash(otp,10);
    const existOtp=await OTP.findOne({email});
    if(existOtp){
         const result=await OTP.findByIdAndUpdate(existOtp._id,{
            otp:hashedOtp
         });
         if(result) return res.status(201).json({success:true,mssg:"Otp has been sent to your email"});
    }
    else{
        const result=await OTP.create({
            email,
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
     
    const user=await USER.findOne({email});
    if(!user) return res.status(409).json({success:false,mssg:"User didn't Exist Signup"});
     const otpMatch=await OTP.findOne({email});
    if(!otpMatch) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const hashOtp=await bycrpt.compare(finalOtp,otpMatch.otp);
    if(!hashOtp) return res.status(400).json({success:false,mssg:"Incorrect Otp"});
    const token=await jwt.sign({_id:user._id,name:user.name,email:user.email},process.env.JWT_KEY as string);
    if(token){
    await OTP.deleteOne({email});
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