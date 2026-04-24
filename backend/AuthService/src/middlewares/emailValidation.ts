import joi from "joi";
import { Request,Response,NextFunction } from "express";
async function emailValidator(req:Request,res:Response,next:NextFunction):Promise<any>{
            try {
                const {email}=req.body;
                const emailSchema = joi.object({
      email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
});
     const {error}=emailSchema.validate({email});
     if(error){
        return res.status(400).json({success:false,mssg:"Enter a valid email!"});
     }
      next();
         
            } catch (err) {
                 console.log(`${err}`);
                 return res.status(500).json({success:false,mssg:"Internal Server Error"});
            }
}

export {emailValidator};