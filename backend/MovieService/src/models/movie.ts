import { Schema, model, Types } from "mongoose";

interface movieI {
    name: string,
    description: string,
    producedBy: Types.ObjectId,
    staffs: {
        producer: string,
        director: string,
        actor: string,
    },
    genres:string,
    lang:string,
    duration:string,
    coverImage: {
        url: string,
        publicId: string,
    },
    dates: {
        start: Date,
        end: Date
    }
}
const movieSchema = new Schema<movieI>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    producedBy: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    staffs: {
        producer: {
            type: String,
            required: true,
        },
        director: {
            type: String,
            required: true,
        },
        actors: {
            type: String,
            required: true
        }
    },
    genres:{
        type:String,
        required:true
    },
    lang:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    coverImage: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        }

    },
    dates: {
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        }
    },
 

}, {
    timestamps: true,
});

const MOVIE = model<movieI>("movie", movieSchema);
export default MOVIE;