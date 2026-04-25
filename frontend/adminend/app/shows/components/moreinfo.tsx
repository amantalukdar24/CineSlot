import React,{useState,useEffect} from "react";
import { toast } from "react-hot-toast";
import { Poppins, } from "next/font/google";
import { datetoString } from "@/app/services/date";
import {motion} from "framer-motion";
interface MoreInfoI{
    moreDetails:{
        bookedAt:Date,fare:number,bookedUser:string},
        setShowMoreInfo:React.Dispatch<React.SetStateAction<boolean>>
}
const poppins=Poppins({
  subsets:["latin"],weight:"400"
})
function MoreInfo({moreDetails,setShowMoreInfo}:MoreInfoI){
    const AuthService_Url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const [user,setUser]=useState<{name:string,email:string }|null>(null);
    useEffect(()=>{
         const userInfo=async ():Promise<void>=>{
          const result=await fetch(`${AuthService_Url}/user/getuser?id=${moreDetails.bookedUser}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":localStorage.getItem("token") as string
            }
          });
          const data=await result.json();
         if(data.success){
            setUser({name:data.user.name,email:data.user.email});
          }
          else{
            toast.error(data.mssg)
          }
         }
         userInfo();

    },[moreDetails])
   
    return(
        <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}  className="absolute top-1/2 left-1/2 transform translate-[-50%] w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] h-[40vh] bg-gray-800 rounded-xl flex flex-col gap-2 px-2 py-3">
          <div className="flex items-center">
               <button className="px-2 py-3 text-[1.5rem] text-center text-white cursor-pointer" onClick={()=>{setShowMoreInfo(false)}}>{`<`}</button>
          </div>
          <div className={`${poppins.className} flex flex-col gap-2 px-2 py-3 text-[0.6rem] sm:text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] text-white`}> 
            <h3>Name: {user?.name}</h3>
            <h3>Email: {user?.email}</h3>
            <h3>Date of Booking: {datetoString(moreDetails.bookedAt)}</h3>
            <h3>Ticket Fare: {moreDetails.fare}</h3>
          </div>
        </motion.div>
    )
}
export default MoreInfo;