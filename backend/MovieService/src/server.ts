import express, { urlencoded,Request,Response } from "express";
import dbConfig from "./dbconfig";
import dotenv from "dotenv";
import movieRouter from "./routes/movie";
import showRouter from "./routes/show";
import seatBookRouter from "./routes/seatBooking";
import paymentRouter from "./routes/payment";
import bookingRouter from "./routes/bookings";
import cors from "cors";
const PORT:number=Number(process.env.PORT) || 4001;
dotenv.config();
const app=express();
dbConfig();
app.use(urlencoded());
app.use(cors());
app.use(express.json());
app.use(express.text());
app.get("/",async (req:Request,res:Response):Promise<any>=>{
    try {
        return res.status(200).json({success:true,mssg:"Server Waked Up!"});
        
    } catch (err) {
         console.log(`${err}`);
         return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
});
app.use("/movie",movieRouter);
app.use("/show",showRouter);
app.use("/seatbook",seatBookRouter);
app.use("/payment",paymentRouter);
app.use("/bookings",bookingRouter);
app.listen(PORT,()=>{
    console.log(`Server Running on port:${PORT}`);
});