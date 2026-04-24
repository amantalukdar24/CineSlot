import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function dbConfig():void{
    const MongoUrl=process.env.MongoUrl as string;
    if(!MongoUrl) {
        console.log("Mongo Url not found");

    }
    mongoose.connect(MongoUrl)
   .then(()=>{
    console.log("Mongo Connected");
})
.catch((err)=>{
    console.log(`Mongo Error-${err}`);
});
}

export default dbConfig;