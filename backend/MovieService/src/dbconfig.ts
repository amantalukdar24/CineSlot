import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function dbConfig():void{
 const MongoURL=process.env.MongoURL as string;
 if(!MongoURL){
   console.log("Mongo Url not found");
   return;
 }
 mongoose.connect(MongoURL)
 .then(()=>{
    console.log("Mongo-MS connected");
 })
 .catch((err)=>{
    console.log(`Mongo-MS Error-${err}`);
 })
}

export default dbConfig;
