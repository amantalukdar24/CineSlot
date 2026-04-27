"use client"
import {useState,useEffect,useRef} from 'react'
import { useRouter } from 'next/navigation'
import {toast} from "react-hot-toast";
import { Poppins,Inter } from 'next/font/google';
import { datetoString } from '../services/date';
import {motion} from "framer-motion";
import BookingsS from '../component/skeletons/Bookings';
import { AuthUser } from '../services/auth';
const poppins=Poppins({
  subsets:["latin"],
  weight:"600"
})
const inter=Inter({
  subsets:["latin"],weight:"400"
})
const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.15,ease:"easeIn"}}
}
const item={
  hidden:{opacity:0,y:30},
  visible:{opacity:1,y:0,transition:{duration:0.4}}
}
function Page() {
    const AuthServiceUrl=process.env.NEXT_PUBLIC_AuthSer_URL;
    const router=useRouter();
    const [bookings,setBookings]=useState<any>([]);
    const [totalBookings,setTotalBookings]=useState<number>(0);
    const [skip,setSkip]=useState<number>(0);
   const bookingRef=useRef<any>([]);
    const [loading,setLoading]=useState<boolean>(false);

      const getBookings=async ():Promise<void>=>{
         if(!AuthUser()){
           router.push("/signin");
           return;
         }
          if(loading) return;
          setLoading(true);
           const results=await fetch(`${AuthServiceUrl}/bookings/userbooking?skip=${skip}`,{
           method:"GET",
           headers:{
            "Content-Type":"application/json",
            "authorization":localStorage.getItem("token") as string,
           }
           });
           const data=await results.json();
           if(data.success){
         if(data.allBookings.length>0)  {
          setBookings(data.allBookings);
          setTotalBookings(data.totalBookings);
        
         }
       
           }
           else{
            toast.error(data.mssg)
           }
           setLoading(false);
      }
    useEffect(()=>{
      if(!localStorage.getItem("token")){
         toast.error("Sign-in to access");
         router.push("/signin")
      }
    
    getBookings();
    },[skip])
    const handleNext=()=>{
      setSkip((prev)=>prev+5);
     
    }    
    const handlePrev=()=>{
       setSkip((prev)=>{
        if(prev-5<=0) return 0;
        else return prev-5;
       })
    }
    
    const showBookingBtn=(index:any)=>{
         bookingRef.current[index].style.display="flex";
    }
   const removeBookingBtn=(index:any)=>{
     bookingRef.current[index].style.display="none";
   }
  return (
    <div className='flex flex-col items-center gap-2 px-2 py-2 h-screen '>
    <div className='flex justify-start items-center w-full '>
         <button  onClick={()=>{router.push("/")}} className='p-2 flex justify-center  items-center  cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
    </div>
    <div   className='w-screen sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[45vw] 2xl:w-[45vw] flex flex-col  gap-3 lg:gap-5 px-4 py-3'>
       <h1 className={`${poppins.className} text-[1.5rem] sm:text-[1.6rem] md:text-[1.7rem] lg:text-[1.8rem]`}>Bookings</h1>
    
       <motion.div variants={container as any} key={bookings?.length} initial="hidden" animate="visible"  className='w-full  border-2 rounded-xl bg-gray-50 px-2 py-3 flex flex-col gap-2 '>
        {
       bookings.length>0 && !loading &&  bookings.map((booking:any,index:any)=>{
            return (
               <motion.div variants={item}   key={index} id={index}  className='flex flex-row items-center  w-full gap-5 border-2 px-2 py-3 rounded-md cursor-pointer hover:bg-gray-200 ' onMouseEnter={()=>{showBookingBtn(index)}} onMouseLeave={()=>{removeBookingBtn(index)}} onClick={()=>{router.push(`/bookings/order?movieId=${booking.movie._id}&pid=${booking._id.payment_id}`)}}>
                 <div className='flex justify-center items-center'>
                  <img src={booking.movie.coverImage.url} className='w-10 h-10 sm:w-12.5 sm:h-12.5 rounded-lg'/>
                 </div>
                <div className={`flex flex-col gap-2 ${inter.className} text-[0.6rem] sm:text-[0.9rem] md:text-[1rem]`}>
                  <h2 className='text-blue-500'>Order id: {booking._id.order_id}</h2>
                  <h2 className='text-red-500'>Movie: {booking.movie.name}</h2>
                  <h2 className='text-green-600'>Show Date: {datetoString(booking.dates.forDate)}</h2>
                </div>
                <div className='flex justify-center items-center '>
                 <h1 className={`${inter.className} text-[0.7rem]  sm:text-[0.9rem] md:text-[1rem] lg:text-[1.2rem] text-gray-700`}>Paid: ₹{booking.amountPaid}</h1>
                </div>
               <div ref={(el:any)=>bookingRef.current[index]=el} className='hidden justify-center items-center ml-10'>
                  <button className='px-3 py-2  text-[1.8rem]  text-black cursor-pointer' >{`>`}</button>
                </div>
                
               </motion.div>
            )
          })
        }
        {
          bookings.length===0&& !loading && <motion.div initial={{opacity:0,y:20,scale:0.8}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.3,ease:"easeIn"}} className='flex justify-center items-center py-20  text-[1.1rem] sm:text-[1.3rem]'><h1 className={`${poppins.className} bg-clip-text text-transparent bg-linear-to-r from-red-800 to-red-500`}>No Booking placed</h1><span>😔</span></motion.div>
        }
        {
          loading && <BookingsS/>
        }

       </motion.div>
       <div className='flex flex-row  items-center w-full'>
        <div className='w-[50%] flex justify-start items-center'>
      {skip>0 && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  onClick={()=>{setTimeout(()=>{handlePrev()},180)}} className='w-[25vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] xl:w-[8vw] h-[5vh] bg-blue-500 text-white font-sans font-medium text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] rounded-xl cursor-pointer'>Prev</motion.button>}
      </div>
      <div className='w-[50%] flex justify-end items-center'>
       {skip+5<totalBookings  && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  onClick={()=>{setTimeout(()=>{handleNext()},180)}} className='w-[25vw] sm:w-[20vw] md:w-[16vw] lg:w-[12vw] xl:w-[8vw] h-[5vh] bg-blue-500 text-white font-sans font-medium text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] rounded-xl cursor-pointer'>Next</motion.button>}
        </div>
       </div>
    </div>
    </div>
  )
}

export default Page