import {Schema,model,Document} from "mongoose";

interface IUser extends Document{
name:string,
email:string,

}
const userSchema:Schema<IUser>=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
},{
    timestamps:true
});

const USER=model<IUser>("user",userSchema);

export default USER;