import { Request,Response } from "express";
import showTime from "../models/showtime";
import MOVIE from "../models/movie";
import mongoose from "mongoose";
const registerShowTime=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {movieId,forDate} =req.body;
        const times=JSON.parse(req.body.times);
        const movie=await MOVIE.findById(movieId);
        if(!movie) return res.status(404).json({success:false,mssg:"No Movies Found"});
        const todaysDate:Date=new Date();
        todaysDate.setHours(0,0,0,0);
        if(new Date(forDate)<todaysDate) return res.status(400).json({success:false,mssg:"Its Valid Date"});
        if(new Date(forDate)>=movie.dates.start && new Date(forDate)<=movie.dates.end){
            const isShowTimeData=await showTime.findOne({forDate});
            if(isShowTimeData){
                 const setTimes=Array.from(new Set([...times,...isShowTimeData.times]));
                 const result=await showTime.findByIdAndUpdate(isShowTimeData._id,{times:setTimes});
                 if(result) return res.status(201).json({success:true,mssg:"Show Times Created"});
            }
            else{
                const result=await showTime.create({
                    forDate,
                    times,
                    movieId
                });
                if(result) return res.status(201).json({success:true,mssg:"Show Times Created"});
            
            }
          
        }
          return res.status(404).json({success:false,mssg:"Something Went Wrong"});
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
const getShowsTime=async (req:Request,res:Response):Promise<any>=>{
  try{
    const {movieId}=req.body;
    const showsTimeData=await showTime.find({movieId});
    return res.status(200).json({success:true,showsTimeData});
    
  }
  catch(err){
     console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Down"});
}
}
const compareDates=(givendate:string):boolean=>{
  const date=new Date();
  
  const currenttime:number=date.getHours()*60+date.getMinutes();
  const [timeString,meridiem]:string[]=givendate.split(" ");
  if(timeString===undefined) return false;
   const [hr,min]:string[]=timeString.split(":");
  let givenhr=0;
  if(meridiem==="pm"){
      
      if(Number(hr)!==12) givenhr=12+Number(hr);
      else if(Number(hr)===12) givenhr=12;
  }
  else if(meridiem==="am"){
      if(Number(hr)===12) givenhr=0;
      givenhr=Number(hr);
  }
  const giventime:number=givenhr*60+Number(min);
  if(currenttime<giventime) return true;
  else return false;
}
const getShowsTimeClient=async (req:Request,res:Response):Promise<any>=>{
    try {
        const {id}=req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const results=await showTime.aggregate([{$match:{movieId:new mongoose.Types.ObjectId(id as string),forDate:{$gte:today}}},{$project:{_id:1,forDate:1,times:1,movieId:1}},{$sort:{forDate:1}},{$limit:7}]);
        const movie=await MOVIE.findById(id);
        if(!movie) return res.status(404).json({success:false,mssg:"Movie Not Found"});
        const {name:movieName}=movie;
     const  showsTimeData=results.map((ele)=>{
  
            if(ele.forDate.toDateString() === today.toDateString()){
                let filterTimes=ele.times.filter((time:string)=>{
                   return compareDates(time);
                });
              ele.times=filterTimes;

            }
            return ele;
        }).filter((ele)=>{
            return ele.times.length>0;
        });
        
        
        return res.status(200).json({success:true,showsTimeData,movieName});

    } catch (err) {
    console.log(`${err}`);
    return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
export {registerShowTime,getShowsTime,getShowsTimeClient};