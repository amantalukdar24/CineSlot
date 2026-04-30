import {Resend} from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend=new Resend(process.env.resend_key as string);

const sendMail=async (email:string,otp:string,admin:boolean):Promise<boolean>=>{
    try {
        const {data,error}=await resend.emails.send({
            from:process.env.resend_email as string,
            to:email,
            subject:admin ? "CineSlot-For Staffs | Email Verification OTP" : "CineSlot | Email Verification OTP",
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
        });
    if(error) return false;
    return true;
    } catch (err) {
        console.log(`${err}`);
        return false;
    }
}
export {sendMail};
