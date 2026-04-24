import {Schema,model,Types} from "mongoose";
interface ticketI{
    seatNo:string,
    forDate:Types.ObjectId,
    time:string,
    movieId:Types.ObjectId,
    bookedUser:Types.ObjectId,
    seatType:string,
    fare:number,
    order_id:string,
    payment_id:string,
    cancel:boolean
}
const ticketSchema=new Schema<ticketI>({
    seatNo:{
        type:String,
        required:true,
        
    },
    forDate:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"showTime",
        },
    time:{
         type:String,
         required:true,
    },
    movieId:{
        type:Schema.Types.ObjectId,
        ref:"movie",
        required:true,
    },
    bookedUser:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    seatType:{
        type:String,
        required:true,
        enums:["Regular","Premium","VIP"]
    },
    fare:{
        type:Number,
        required:true,
        enums:[100,200,350]
    },
    order_id:{
        type:String,
        required:true,
    },
    payment_id:{
        type:String,
        required:true,
    },cancel:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
});

const seatBooking=model<ticketI>("seatBooking",ticketSchema);

export default seatBooking;