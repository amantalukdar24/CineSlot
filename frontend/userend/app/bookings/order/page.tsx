"use client";
import {useState,useEffect,FC} from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { paymentDetailsI } from "@/app/payment/success/page";
import {toast} from "react-hot-toast";
import { Poppins,Google_Sans_Code } from "next/font/google";
import { datetoString, get12hrTime } from "@/app/services/date";
import { AnimatePresence } from "framer-motion";
import Cancel from "../components/cancel";
import Link from "next/link";
import {motion} from "framer-motion";
import {Toaster} from "react-hot-toast";
import PageLoader from "@/app/component/skeletons/PageLoader";
import { AuthUser } from "@/app/services/auth";
const poppins=Poppins({
    subsets:["latin"],
    weight:"600",
});
const sanscode=Google_Sans_Code({
    subsets:["latin"],weight:"400"
})
function Page(){
    const searchParams=useSearchParams();
    const router=useRouter();
    const AuthService_URL:string=process.env.NEXT_PUBLIC_AuthSer_URL as string;
    const movieId:string=searchParams.get("movieId") as string;
    const payment_id:string=searchParams.get("pid") as string;
     const [paymentDetails,setPaymentDetails]=useState<paymentDetailsI | null>(null);
     const [cancelBtn,setCancelBtn]=useState<boolean>(false);
     const [cancel,setCancel]=useState<boolean>(false);
     const [loading,setLoading]=useState<boolean>(false);
     
    useEffect(()=>{
          if(!AuthUser){
            router.push("/signin");
            return;
          }
          if(!payment_id || !movieId) {
            router.push("/");
            toast.error("Invalid Request");
            return;
          }
         if(cancel) return;
          const getPaymentDetails=async ():Promise<void>=>{
            if(loading) return;
            setLoading(true);
            const result=await fetch(`${AuthService_URL}/payment/paymentsuccess`,{
              method:"POST",
              headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "authorization":localStorage.getItem("token") as string,
              },
              body:new URLSearchParams({movieId,payment_id})
});
           const data=await result.json();
         
           if(data.success){
            setPaymentDetails(data.result[0]);
}
          else{
            router.push("/");
            toast.error("Invalid Request");
            return;
          }
          setLoading(false);
          }
          getPaymentDetails();
    },[cancel])
  useEffect(()=>{
      if(paymentDetails===null) return;
      const checkDates=()=>{
        const forDate=new Date(paymentDetails.dates.forDate);
        forDate.setHours(0,0,0,0);
        const todaysDate=new Date();
        todaysDate.setHours(0,0,0,0);
        if(todaysDate<forDate) return true;
        return false;
      }
      

 if(checkDates() && !paymentDetails.cancel) setCancelBtn(true);
 else setCancelBtn(false);
 
  },[paymentDetails])
  
    return(
        <div className="flex flex-col items-center gap-5 px-2 py-3 bg-gray-100 h-screen">
          <Toaster position="top-center" reverseOrder={true}
  gutter={8} toastOptions={{duration:5000}} />
         <div className='flex justify-start items-center w-full'>
         <button onClick={()=>{router.push(`/bookings`)}} className='p-2 flex justify-center items-center cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
     {paymentDetails!==null && !loading && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.3,ease:"linear"}} className="flex flex-col gap-3 w-[90vw] sm:w-[80vw] md:w-[70vw] xl:w-[60vw] border-2 rounded-xl px-2 py-3 bg-linear-to-tr from-gray-100 to-gray-200">
       <div className="flex justify-center items-center border-b-2 py-2"> <h1 className={`${poppins.className} text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] text-center`}>Booking Details</h1></div> 
       <div className={`flex flex-row justify-between items-center gap-2 ${sanscode.className} text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem]`}>
      <Link href={`/movie?id=${paymentDetails.movieId}`} > <h2 className="cursor-pointer hover:text-gray-500">Movie: {paymentDetails?.movie.name}</h2></Link>
         <img src={paymentDetails.movie.coverImage.url} alt="Failed to Load" className="w-12.5 h-12.5 md:w-16 md:h-16 rounded-md"/>
       </div>
       <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] flex flex-col lg:flex-row gap-2 lg:gap-5`}>
        <h2>Order_id: {paymentDetails.order_id}</h2>
        <h2>Payment_id: {paymentDetails.payment_id}</h2>
       </div>
    <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] flex flex-row`}>
        <h2>Your Seats: {paymentDetails.seats.join(", ")}</h2>
</div>
       <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] flex flex-col sm:flex-row gap-2 sm:gap-5 `}>
        <h2>Show Time: {datetoString(paymentDetails.dates.forDate)}</h2>
        <h2>Show Time: {paymentDetails.time}</h2>
       </div>
       <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] flex flex-row`}>
        <h2>Amount Paid: <span className={`${poppins.className}`}>₹</span>{paymentDetails.amountPaid}</h2>
</div>
        <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.7rem] md:text-[1rem] lg:text-[1.1rem] flex flex-col lg:flex-row gap-2 lg:gap-5 `}>
        <h2>Payment Completed on: {datetoString(paymentDetails.createdAt)}</h2>
        <h2>Payment Completed at: {get12hrTime(paymentDetails.createdAt)}</h2>
     
       </div>
       { paymentDetails.cancel &&
        <div className={`${sanscode.className} text-[0.8rem] sm:text-[0.7rem] md:text-[1rem] lg:text-[1.1rem] flex flex-col lg:flex-row gap-2 lg:gap-5 `}>
          <h2>Status: <span className="text-red-400">Canceled</span></h2>
        </div>
       }
      </motion.div>
      }{
        loading && <PageLoader/>
      }
    {cancelBtn &&  <div className="flex justify-center items-center w-full px-2 py-3 mt-10">
         <button className='font-sans px-3 py-2 text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] bg-red-400 text-white cursor-pointer rounded-md' onClick={()=>{setCancel(true)}}>Cancel Booking</button>
      </div>
      }
    <AnimatePresence>   {cancel && paymentDetails!==null && <Cancel  setCancel={setCancel} paymentDetails={paymentDetails}/> }</AnimatePresence>
        </div>
    )
}
export default Page;