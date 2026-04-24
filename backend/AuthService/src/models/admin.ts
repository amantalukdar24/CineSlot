import {Schema,model,Document} from "mongoose";

interface AdminI extends Document{
    email:string,
    name:string,
    address:{
        landmark:string,
        city:string,
        pincode:string
    }
}
const adminSchema=new Schema<AdminI>({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
   
    address:{
        landmark:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
            
        },
        pincode:{
            type:String,
            required:true,
        }
    }
},{
    timestamps:true
});

const ADMIN=model<AdminI>("admin",adminSchema);

export default ADMIN;