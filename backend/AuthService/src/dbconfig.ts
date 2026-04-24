import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function dbConfig():void{
    
    mongoose.connect(process.env.MongoUrl as string)
   .then(()=>{
    console.log("Mongo Connected");
})
.catch((err)=>{
    console.log(`Mongo Error-${err}`);
});
}

export default dbConfig;