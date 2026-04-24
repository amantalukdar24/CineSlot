import razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
const createRazorpayInstance=()=>{
   return new razorpay({
    key_id:process.env.RazorPay_API_KEY as string,
    key_secret:process.env.RazorPay_API_Secret as string,
    
})};
export default createRazorpayInstance;