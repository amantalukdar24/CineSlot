import {Request,Response} from "express";
import seatBooking from "../models/seatBooking";
import {Types} from "mongoose";
import redis from "../redisConfig";
import showTime from "../models/showtime";


const getBookedSeats=async (req:Request,res:Response):Promise<any>=>{
    try {
        
        const {forDate,time,movieId}=req.body;
   
        const results=await seatBooking.aggregate([{$match:{ forDate:new Types.ObjectId(forDate),time,movieId:new Types.ObjectId(movieId),cancel:false}},{
            $group:{_id:"$seatType",seatNo:{$push:"$seatNo"}}
        }]);
      
        return res.status(200).json({success:true,results});
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});

    }

}
const createSeats=async (req:Request,res:Response)=>{
    try {
        const {selectedSeats,forDate,time,movieId,bookedUser,order_id,payment_id}=req.body;
        const parsedSelectedSeats=JSON.parse(selectedSeats);
        const promises=await Promise.all(
           parsedSelectedSeats.map(async (seat:string)=>{
                  const seatType=seat.startsWith("A") ? "Regular" : seat.startsWith("B") ? "Premium" : "VIP";
                  const fare=seat.startsWith("A") ? 100 : seat.startsWith("B") ? 200 : 350;
                  const result=await seatBooking.create({
                    seatNo:seat,movieId,forDate,time,bookedUser,seatType,fare,order_id,payment_id,cancel:false
                  });
                  if(result) return true;
                  else return false;
           })
           
        );
        if(promises.includes(false)) return res.status(400).json({success:false,mssg:"Something Went Wrong!"});
        const showTimeInfo=await showTime.findById(forDate).populate("movieId");
        await redis.del(`bookings-${bookedUser}`);
        return res.status(201).json({success:true,showTimeInfo});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({err})

    }
}
const checkSeatAvaiable=async (req:Request,res:Response)=>{
try {
   
    const {movieId,forDate,time,seats,userId}=req.body;
    const parsedSeats=JSON.parse(seats);
    const seatChecks= await Promise.all(
    parsedSeats.map((seat:string)=>{
    const key=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
    return redis.get(key).then((val)=>({seat,val}));
    }));
    
    const bookedSeats=seatChecks.find((s:any)=>s.val);

    if(bookedSeats){
        return res.status(409).json({success:false,mssg:`Something Went Wrong`})
    }
    await Promise.all(
    parsedSeats.map((seat:string)=>{
    const key=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
    return redis.set(key,JSON.stringify({booked:"Yes",userId}),"EX",300);
     }));
 return res.status(200).json({success:true,mssg:"Seat Locked for 5 mins"})
    
} catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Down"});
}
}
const removeSeats=async (req:Request,res:Response):Promise<any>=>{
    try{ 
        const {movieId,forDate,time,seats,userId}=req.body;
       const parsedSeats=JSON.parse(seats);
        await Promise.all(
            parsedSeats.map(async (seat:string)=>{
                 const key:string=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
                 const val:string|null=await redis.get(key);
                 if(val!==null && JSON.parse(val).userId===userId){
                     await redis.del(key);
                     
                 }
            })
        )
        return res.status(200).json({success:true});
    }
    catch(err){
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
const getTemporaryBookSeats=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {forDate,time,movieId}=req.body;
        let regularSeats:string[]=[];
        let premiumSeats:string[]=[];
        let vipSeats:string[]=[];
        await Promise.all(
            Array.from({length:20},async (_,i)=>{
                const seat=`A${i+1}`;
                const key=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
               const val:string | null=await redis.get(key);
               if(val!==null && JSON.parse(val).booked==="Yes") regularSeats.push(seat);
            })
        );
        await Promise.all(
            Array.from({length:30},async (_,i)=>{
                const seat=`B${i+1}`;
                const key=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
                   const val:string|null=await redis.get(key);
                   if(val!==null && JSON.parse(val).booked==="Yes") premiumSeats.push(seat);
                
    })
        );
       await Promise.all(
            Array.from({length:12},async (_,i)=>{
                const seat=`C${i+1}`;
                const key=`${movieId}-${forDate}-${time.split(" ")[0]}-${time.split(" ")[1]}-${seat}`;
               const val:string | null=await redis.get(key);
               if(val!==null && JSON.parse(val).booked==="Yes") vipSeats.push(seat);
            })
        );
        return res.json({success:true,regularSeats,vipSeats,premiumSeats});

        
    } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}

export {getBookedSeats,createSeats,checkSeatAvaiable,getTemporaryBookSeats,removeSeats};