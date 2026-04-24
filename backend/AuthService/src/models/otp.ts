import {Schema,model,Document} from "mongoose";

interface Iotp extends Document{
    email:string,
    otp:string,
    createdAt:Date,
}
const otpSchema:Schema<Iotp>=new Schema({
     email:{
        type:String,
        required:true,
        unique:true
     },
     otp:{
        type:String,
        default:""
     },
      createdAt:{
        type:Date,
        default:Date.now(),
        expires:600
    }

});
const OTP=model<Iotp>("otp",otpSchema);
export default OTP;