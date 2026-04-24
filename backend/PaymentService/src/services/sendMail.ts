import amqp from "amqplib";
import nodemailer from "nodemailer";
import { datetoString } from "./date";
import { connectRabbitMQ } from "../amqpConfig";
import dotenv from "dotenv";
dotenv.config();
function HtmlMaker(Mssg:any):string{
return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    background:#f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
    padding:20px;
  }
  .card{
    max-width:600px;
    margin:auto;
    background:white;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 8px 20px rgba(0,0,0,0.1);
  }
  .header{
    background:#111827;
    color:white;
    padding:18px;
    text-align:center;
  }
  .content{
    padding:20px;
    color:#111827;
  }
  .info{
    margin:12px 0;
    font-size:16px;
  }
  .seats{
    margin-top:15px;
    background:#f9fafb;
    border:1px dashed #9ca3af;
    padding:14px;
    text-align:center;
    font-size:20px;
    font-weight:bold;
    border-radius:6px;
  }
  .footer{
    margin-top:20px;
    text-align:center;
    font-size:13px;
    color:#6b7280;
  }
</style>
</head>

<body>

<div class="card">

  <div class="header">
    <h2>🎟️ Booking Confirmed</h2>
    <p>Your seats are successfully reserved</p>
  </div>

  <div class="content">

    <div class="info"><strong>Movie:</strong> ${Mssg.movieName}</div>
    <div class="info"><strong>Date:</strong> ${datetoString(Mssg.forDate)}</div>
    <div class="info"><strong>Show Time:</strong> ${Mssg.time}</div>

    <div class="seats">
      Seats: ${Mssg.selectedSeats.join(", ")}
    </div>

    <div class="footer">
      Please arrive 15 minutes before the show.<br/>
      Enjoy your movie 🍿
    </div>

  </div>

</div>

</body>
</html>
`;
}
async function sendMail(){
    try {
        const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.NM_email,
            pass:process.env.NM_pass
        }
    });
      
        const channel=await connectRabbitMQ();
        if(!channel) return;
        channel.prefetch(1);
        await channel.assertQueue("mail_queue",{durable:true});
        channel.consume("mail_queue",async (mssg:any)=>{
            if(mssg!==null){
             const parsedMssg=JSON.parse(mssg.content as any);
             const html=HtmlMaker(parsedMssg);
             const mailOptions={
                from:process.env.NM_email,
                to:parsedMssg.to,
                subject:"CineSlot | Booking Confirmed",
                html:html
             }
             await transporter.sendMail(mailOptions);
                channel.ack(mssg);
            }
        })
    } catch (err) {
        console.log(`${err}`);
    }
}

export default sendMail;