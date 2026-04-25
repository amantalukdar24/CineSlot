"use client";
import {useState,useEffect,Suspense} from 'react'
import { useRouter,useSearchParams } from 'next/navigation';
import {toast} from "react-hot-toast";
import {  datetoString,get12hrTime } from '@/app/services/date';
import {motion} from "framer-motion";
import PageLoader from '@/app/component/skeletons/PageLoader';
import { AuthUser } from '@/app/services/auth';
interface paymentDetailsI{
   _id:string,forDate:string,time:string,movieId:string,bookeduser:string,order_id:string,payment_id:string,cancel:boolean,createdAt:Date,updatedAt:Date,
   seats:string[],amountPaid:number,movie:{name:string,coverImage:{url:string}},dates:{forDate:Date}
}
export type {paymentDetailsI};
function SuccessContent() {
  const AuthService_URL=process.env.NEXT_PUBLIC_AuthSer_URL;
    const router=useRouter();
    const searchParams=useSearchParams();
    const payment_id:string|null=searchParams.get("pid");
    const movieId:string | null=searchParams.get("movieId");
    const [paymentDetails,setPaymentDetails]=useState<paymentDetailsI | null>(null);
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
    },[])
   
  return (
    <div className='bg-gray-100 backdrop-blur-2xl flex flex-col items-center px-2 py-3 w-full h-screen'>
          <div className='flex justify-start items-center w-full px-2 py-3'>
         <button onClick={()=>{router.push("/")}} className=' w-[5vw] h-[5vh] cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
   {paymentDetails!==null &&  !loading && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.2,ease:"linear"}} className='w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] h-[70vh]  bg-gray-800 mt-10 rounded-[20px] flex flex-col items-center gap-5 px-2 py-3'>
        <div className='flex flex-row items-center w-full  gap-2  px-2 py-3 border-b-2 border-white'>
          <img src="/Images/correct.png" className='w-7.5 h-7.5 object-fill ' />
          <h1 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] xl:text-[1.5rem] font-bold font-sans text-green-400'>Payment Successful</h1>
        </div>
    <div className='flex flex-col  px-2 py-3 gap-2 rounded-xl bg-gray-50 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] h-[50vh] sm:h-[45vh] lg:h-[50vh]'>
      <div className='flex flex-row justify-between items-center border-b-2'>
            <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono text-blue-500'>Movie:<span className='text-black'> {paymentDetails.movie.name}</span></h1>
         <img src={paymentDetails.movie.coverImage.url} className='w-15 h-15 sm:w-20 sm:h-20 object-contain rounded-md'/>
          </div>
          <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono text-orange-500'>Order Id:<span className='text-black'> {paymentDetails.order_id}</span></h1>
          <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono text-orange-500'>Payment Id:<span className='text-black'> {paymentDetails.payment_id}</span></h1>
          <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono text-orange-500'>Seats:<span className='text-black'> {paymentDetails.seats.join(", ")}</span></h1>
          <div className='flex flex-col sm:flex-row gap-1 sm:gap-5 sm:items-center'>
            <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono font-normal text-green-600 '>Date:<span className='text-black'> {datetoString(paymentDetails?.dates?.forDate)}</span></h1>
            <h1 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-mono font-normal text-green-600 '>Time:<span className='text-black'> {paymentDetails.time}</span></h1>
            </div>
            <h1 className='font-sans text-[1rem] sm:text-[1.1rem] lg:text-[1.2rem] font-medium text-red-500 '>Amount Paid:<span className='text-black'> ₹{paymentDetails.amountPaid} </span></h1>
            <h1 className='text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] font-sans font-normal text-blue-500'>Payment Completed At: <span className='text-black'> {get12hrTime(paymentDetails.createdAt)}</span></h1>
          </div>
      </motion.div>}
      {loading && <PageLoader/>}
    </div>
  )
}
export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SuccessContent />
    </Suspense>
  );
}