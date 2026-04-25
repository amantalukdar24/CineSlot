"use client";

import {toast,Toaster} from "react-hot-toast";
import { paymentDetailsI } from "@/app/payment/success/page";
import { Poppins,Google_Sans_Code } from "next/font/google";
import {motion} from "framer-motion"
const poppins=Poppins({
    subsets:["latin"],
    weight:"600",
});
const sanscode=Google_Sans_Code({
    subsets:["latin"],weight:"400"
})
interface CancelI{
    setCancel:React.Dispatch<React.SetStateAction<boolean>>,
    paymentDetails:paymentDetailsI,
}
function Cancel({setCancel,paymentDetails}:CancelI){
    const AuthService_Url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const handleCancel=async ():Promise<void>=>{
        const result=await fetch(`${AuthService_Url}/bookings/cancelbooking`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "authorization":localStorage.getItem("token") as string,
            },
            body:new URLSearchParams({paymentDetails:JSON.stringify(paymentDetails)})
        });
        const data=await result.json();
        if(data.success){
            setCancel(false);
            toast.success(data.mssg);
            
        }
        else{
            toast.error(data.mssg);
        }
    }
    
    return(
     
        <motion.div className="absolute top-1/2 left-1/2 transform translate-[-50%] w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] h-[40vh] bg-gray-700 rounded-xl flex flex-col gap-2  px-2 py-3 " initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}>
                     
         <div className="flex justify-start items-center px-2 py-3">
                <button className="text-[1.3rem] md:text-[1.5rem] lg:text-[1.7rem] xl:text-[1.8rem] w-[3vw] h-[6vh] cursor-pointer font-mono text-white" onClick={()=>{setCancel(false)}}>{`<`}</button>
         </div>
         <div className="flex justify-center items-center w-full border-b-2 py-2  border-white">
            <h1 className={`${poppins.className} text-[1.2rem]  sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] text-red-400 text-center`}>Cancel Booking</h1>
         </div>
         <div className="flex flex-col gap-5 items-center ">
                 <p className={`${sanscode.className} text-[0.7rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] text-white`}> Refund will be processed within 7 days.</p>
             <button className="mt-5 w-[35vw] sm:w-[30vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] h-[5vh] bg-linear-to-r from-red-400 via-red-200 to-orange-400 font-mono text-[1.2rem] rounded-md cursor-pointer text-black" onClick={()=>{handleCancel()}}>Confirm</button>
         </div>
       
        </motion.div>
       
    )
}
export default Cancel;