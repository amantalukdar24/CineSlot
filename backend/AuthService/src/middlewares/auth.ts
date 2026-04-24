import jwt,{JwtPayload} from "jsonwebtoken";
import {config as dotenv} from "dotenv";
import { Request,Response,NextFunction} from "express";

async function authUser(req:Request,res:Response,next:NextFunction):Promise<any>{
   try {
     const token:string | undefined=req.headers["authorization"];
     if(!token) return res.status(400).json({success:false,mssg:"Unauthorized Access"});
     const decoded=await jwt.verify(token,process.env.JWT_KEY as string) as JwtPayload;
     if(!decoded) return res.status(400).json({success:false,mssg:"Unauthorized Access"});
     req.user=decoded;
    next();

   } catch (err) {
     return res.status(500).json({success:false,mssg:"Internal Server Error"});
   }

}

export {authUser};