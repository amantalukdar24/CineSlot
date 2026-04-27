"use client";
import {useState,useEffect,Suspense} from "react";
import {toast} from "react-hot-toast";
import {useRouter,useSearchParams} from "next/navigation";
import { Poppins,Google_Sans_Code } from "next/font/google";
import MoreInfo from "./components/moreinfo";
import PageLoader from "../component/PageLoader";
import { motion,AnimatePresence } from "framer-motion";
import { WakeUp } from "../services/movieservicewakeup";
const poppins=Poppins({
    subsets:["latin"],weight:"400"
})
const sanscode=Google_Sans_Code({
    subsets:["latin"],weight:"300"
})
function ShowsContent(){
    const router=useRouter();
    const searchparams=useSearchParams();
    const AuthService:string=process.env.NEXT_PUBLIC_AuthSer_URL as string;
    const [bookingsDetails,setBookingsDetails]=useState<any>([]);
    const movieId:string|null=searchparams.get("movieId");
    const forDate:string|null=searchparams.get("forDate");
    const time:string|null=searchparams.get("time");
    const [skip,setSkip]=useState<number>(1);
    const [showMoreInfo,setShowMoreInfo]=useState<boolean>(false);
    const [moreDetails,setMoreDetails]=useState<{bookedUser:string,fare:number,bookedAt:Date}|null>(null);
    const [totalBookings,setTotalBookings]=useState<number>(0);
    const [collections,setCollections]=useState<any>([]);
    const [loading,setLoading]=useState<boolean>(false);
    const getBookingDetails=async ():Promise<void>=>{
        if(loading) return;
        if(!movieId || !forDate || !time) {
            toast.error("Invaild Request");
            router.push("/");
            return;
        }
        setLoading(true);
         if(!WakeUp()){
            setLoading(false);
            toast("Opps! Try Again",{icon:"😮‍💨", style:{color:"orangered",backgroundColor:"black"}});
            return;
    }
        const result=await fetch(`${AuthService}/bookings/showbookings?movieId=${movieId}&forDate=${forDate}&time=${time}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":localStorage.getItem("token") as string,
            }
        });
        const data=await result.json();
        if(data.success){
            setBookingsDetails(data.details);
            setCollections(data.totalBookings);
            let total=0;
            data.totalBookings.forEach((ele:any)=>{
                total+=ele.totalBookings
            });
             setTotalBookings(total);
        }
         setLoading(false);
    }
    useEffect(()=>{
    getBookingDetails();
    },[]);
   const changeMoreDetails=(ele:any):void=>{
      setMoreDetails({bookedUser:ele.bookedUser,fare:ele.fare,bookedAt:ele.createdAt});
   }

    return(
        <div className="flex flex-col gap-2 px-2 py-3 w-full">
        <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push(`/movie?id=${movieId}`)}} className='px-4 py-2 flex justify-center items-center cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
      {!loading && <>
      {collections.length>0 && <div className={`w-full px-2 py-3 ${poppins.className} text-[0.8rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] border-4 rounded-xl flex flex-col gap-2`}>
        {
            collections.map((ele:any,index:any)=>{
                return(
                    <div key={index} className="border-b-2 last:border-b-0 p-2">Collection from {ele._id}- ₹{ele.totalBooked}</div>
                )
            })
        }
      </div>}
      <div className="flex flex-col gap-3 px-2 py-3 ">
        <h1 className={`${poppins.className} text-[1.5rem]`}>Booking Details</h1>
        <div className="flex flex-col gap-2 border-4 rounded-lg px-2 py-3">
          <div className={`${poppins.className} text-[0.5rem] sm:text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] xl:text-[1.1rem] flex flex-row items-center gap-2 `}>
            <div className="w-[10%]  border-r-2 flex justify-center">Sl No.</div>
            <div className="w-[10%] border-r-2 flex justify-center">Seat No</div>
            <div className="w-[10%] border-r-2 flex justify-center">Type</div>
            <div className="w-[30%] border-r-2 flex justify-center">Order_id</div>
             <div className="w-[30%] border-r-2 flex justify-center">Payment_id</div>
           <div className="w-[10%]  flex justify-center">More</div>
             
          </div>
          <div className="flex flex-col items-center w-full border-t-2">
            
            {
             bookingsDetails.length>0 &&   bookingsDetails.slice(skip*10-10,skip*10).map((bookings:any,index:any)=>(
            <div key={index} className={`${sanscode.className} text-[0.4rem] sm:text-[0.5rem] md:text-[0.7rem] lg:text-[0.8rem] xl:text-[1rem] flex flex-row items-center gap-2 w-full border-b-2 last:border-0 `}>
            <div className="w-[10%]  border-r-2 flex justify-center overflow-auto">{index+1}</div>
            <div className="w-[10%] border-r-2 flex justify-center overflow-auto">{bookings.seatNo}</div>
            <div className="w-[10%] border-r-2 flex justify-center overflow-auto">{bookings.seatType}</div>
            <div className="w-[30%] border-r-2 flex justify-center overflow-auto">{bookings.order_id}</div>
             <div className="w-[30%] border-r-2 flex justify-center overflow-auto">{bookings.payment_id}</div>
           <div className="w-[10%]  flex justify-center overflow-auto"><img src="Images/eye.png" alt="Failed to Load" className="w-3 h-3 sm:w-5 sm:h-5 cursor-pointer" onClick={()=>{changeMoreDetails(bookings); setShowMoreInfo(true)}} /></div>
            
          </div>
                ))
            }
            {
                bookingsDetails.length===0 && <div className={`${sanscode.className} py-3 text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] xl:text-[1.5rem]`}><span className=" text-transparent bg-clip-text bg-linear-to-br from-orange-700 to-orange-400 ">Zero Bookings</span><span>😒</span></div>
            }

          </div>
        </div>
        <div className="flex  flex-row justify-between px-2 py-3 w-full">
     <div >  {skip>1 && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} onClick={()=>{setSkip((prev)=>{if(prev-1<=1) return 1; return prev-1;})}}  className='w-[25vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] xl:w-[8vw] h-[5vh] bg-blue-500 text-white font-sans font-medium text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] rounded-xl cursor-pointer'>Prev</motion.button>}</div> 
      <div>   {skip*10<totalBookings && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} onClick={()=>{setSkip((prev)=>prev+1)}}  className='w-[25vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] xl:w-[8vw] h-[5vh] bg-blue-500 text-white font-sans font-medium text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] rounded-xl cursor-pointer '>Next</motion.button>}</div>
        </div>
      </div>
    <AnimatePresence>  {showMoreInfo && moreDetails!==null && <MoreInfo moreDetails={moreDetails} setShowMoreInfo={setShowMoreInfo}/>}</AnimatePresence>
      </>}
      {
        loading && <PageLoader/>
      }
        </div>
    )
}
export default function Page() {
    return (
        <Suspense fallback={<PageLoader/>}>
            <ShowsContent />
        </Suspense>
    )
}