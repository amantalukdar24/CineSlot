import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function dbConfig():void{
 mongoose.connect(process.env.MongoURL as string)
 .then(()=>{
    console.log("Mongo-MS connected");
 })
 .catch((err)=>{
    console.log(`Mongo-MS Error-${err}`);
 })
}

export default dbConfig;