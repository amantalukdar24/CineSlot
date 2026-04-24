import {model,Schema,Types} from "mongoose";

interface showTimeI{
    forDate:Date,
    times:String[],
    movieId:Types.ObjectId
}
const showTimeSchema=new Schema<showTimeI>({
    forDate:{
        type:Date,
        required:true,
        unique:true,
    },
    times:{
        type:[String],
        required:true,
    },
    movieId:{
        type:Schema.Types.ObjectId,
        ref:"movie",
        required:true,
    }

},{
    timestamps:true,
});

const showTime=model<showTimeI>("showTime",showTimeSchema);

export default showTime;