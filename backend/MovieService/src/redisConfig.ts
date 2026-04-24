import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redis=new Redis(process.env.RedisURL as string);
redis.on("connect",()=>{
    console.log("Redis Connected");
});
redis.on("error",(err)=>{
    console.log(`Redis Error-${err}`);
})
export default redis;