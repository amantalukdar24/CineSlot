import express,{Application, urlencoded} from "express";
import dotenv from "dotenv";
import dbConfig from "./dbconfig";
import cors from "cors";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import movieServiceRouter from "./routes/routeMovie";
import showRouter from "./routes/routeShow";
import seatBookRouter from "./routes/routeSeatBook";
import paymentRouter from "./routes/routePayment";
import bookingRouter from "./routes/routeBooking";
dotenv.config();
const PORT:number=Number(process.env.PORT) ||  4000;
const app:Application=express();
dbConfig();
app.use(cors());
app.use(urlencoded());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieServiceRouter);
app.use("/show",showRouter);
app.use("/seatbook",seatBookRouter);
app.use("/payment",paymentRouter);
app.use("/bookings",bookingRouter);
app.listen(PORT,()=>{
    console.log(`Auth Service running on PORT:${PORT}`);

})