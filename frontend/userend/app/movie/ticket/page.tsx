"use client";
import {useEffect,useState,Suspense} from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import {toast,Toaster} from "react-hot-toast"
import { getDay,getDate,getMonthYear } from '@/app/services/date';
import Seat from '@/app/component/seat';
import {motion,AnimatePresence} from "framer-motion";
import Spinner from '@/app/component/Spinner';
import PageLoader from '@/app/component/skeletons/PageLoader';
import { AuthUser } from '@/app/services/auth';
interface showsTimesI{
  _id:string,
  forDate:Date,
  times:string[]
}
function TicketContent() {
  const MovieService_Url:string=process.env.NEXT_PUBLIC_MovieService_URL as string;
  const AuthService_Url:string=process.env.NEXT_PUBLIC_AuthSer_URL as string;
  const searchparams=useSearchParams();
  const router=useRouter();
  const [showsTimes,setShowsTimes]=useState<showsTimesI[] | null>(null);
  const [currentClickedDay,setCurrentClickedDay]=useState<string>("");
  const [currentClickedTime,setCurrentClickedTime]=useState<string>("");
  const [timings,setTimings]=useState<string[]>([])
  const [movieName,setMovieName]=useState<string>("");
  const [pay,setPay]=useState<number>(0);
   const [selectSeats,setSelectSeats]=useState<{seatNo:string,seatType:string,fare:number}[]>([]);
   const [checkSeat,setCheckSeat]=useState<boolean>(false);
   const [showCheckSeatMsg,setShowCheckSeatMsg]=useState<boolean>(false);
   const [loading,setLoading]=useState<boolean>(false);
     const id=searchparams.get("id");
     useEffect(()=>{
      if(!AuthUser()) router.push("/signin");
     },[])
  useEffect(()=>{
    if(!id) {
      toast.error("No Movies Found");
      router.push("/");
    }
  const getShowTimes=async ():Promise<void>=>{
  if(loading) return;
  setLoading(true);
 const result=await fetch(`${MovieService_Url}/show/getshowtimeclient?id=${id}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
      }
    });
    const data=await result.json();
    if(data.success){
      setShowsTimes(data.showsTimeData);
      setMovieName(data.movieName);
    }
   else {
    router.push("/");
    toast.error(data.mssg);
   }
  setLoading(false);
  }
  getShowTimes();
  },[]);
  
  const handleChangetiming=(id:string):void=>{
    
     setCurrentClickedDay(id);
     
    }
 useEffect(() => {
  if (!currentClickedDay) return;
const selected = showsTimes?.find(ele => ele._id === currentClickedDay);
  if (selected) {
    setTimings(selected.times);
    setCurrentClickedTime(selected.times[0])
  }
}, [currentClickedDay]);

  useEffect(()=>{
  if(showsTimes===null) return;
  if(showsTimes.length>0){

   handleChangetiming(showsTimes[0]._id);
   if(showsTimes[0].times.length>0){
    setCurrentClickedTime(showsTimes[0].times[0]);
   }
  }
  
  },[showsTimes])
  useEffect(()=>{
    let total=0;
    selectSeats.forEach((seat)=>{
      total+=seat.fare;
    });
    setPay(total);
  },[selectSeats])
 const handleCheckSeat=async ():Promise<void>=>{
  if(id===null) return;
  if(!localStorage.getItem("token")) return;
  const seats:string[]=selectSeats.map((ele)=>ele.seatNo);
  const result=await fetch(`${AuthService_Url}/seatbook/checkseat`,{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token") as string

    },
    body:new URLSearchParams({movieId:id,forDate:currentClickedDay,time:currentClickedTime,seats:JSON.stringify(seats)})
  });
  const data=await result.json();
  if(data.success){
    setCheckSeat(false);
    const seats=selectSeats.map((seat)=>seat.seatNo);
    router.push(`/payment?movieId=${id}&forDate=${currentClickedDay}&time=${currentClickedTime.split(" ")[0]}+${currentClickedTime.split(" ")[1]}&seats=${JSON.stringify(seats)}`);
  }
  else{
    setShowCheckSeatMsg(false);

}
 }
 const activateCheckSeat=():void=>{
  if(!localStorage.getItem("token")) router.push("/signin");
  if(checkSeat) return;
    setCheckSeat(true);
    setShowCheckSeatMsg(true);
    setTimeout(()=>{
      handleCheckSeat();
    },2000);
    
 }
   return (
    <div className=' flex flex-col items-center px-2 py-3  gap-2 '>
      <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push(`/movie?id=${id}`)}} className='p-2 cursor-pointer'><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
      {!loading && <div className='flex flex-col items-center gap-2'>
     {movieName.length>0 &&<div className='flex items-center w-[99vw] sm:mt-5 px-4 py-2 bg-gray-900 text-orange-600 border-2 border-black rounded-xl '>
      <h1 className='text-[1.3rem] sm:text-[1.4rem] md:text-[1.5rem] lg:text-[1.6rem] xl:text-[1.7rem] font-mono font-bold'>{movieName}</h1>
     </div>}
   {showsTimes!==null&& showsTimes?.length!==0  &&  <div className='flex flex-row p-2 gap-4 w-full border-2 bg-gray-300 rounded-2xl shrink-0 flex-wrap'>
      {
        
        showsTimes.map((ele)=>{
           return(
          <button key={ele._id} onClick={()=>{handleChangetiming(ele._id);}} className={`w-[19vw] sm:w-[14vw] md:w-[12vw] lg:w-[9vw] xl:w-[8vw] 2xl:w-[7vw] h-[12vh] ${currentClickedDay===ele._id ? "opacity-60" : "opacity-100"} `}> <div className='flex flex-col items-center  w-full border-2 h-full rounded-2xl cursor-pointer'>
              <div className='w-full flex justify-center items-center bg-orange-400 h-[4vh] rounded-t-xl '><h2 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-mono font-medium  text-white'>{getDay(ele.forDate)}</h2></div>
             <div className='w-full flex justify-center items-center bg-gray-50 h-[4vh]'>  <h1 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-sans font-bold text-gray-600 '>{getDate(ele.forDate)}</h1></div>
             <div className='w-full flex justify-center items-center bg-blue-400 h-[4vh]  rounded-b-xl'>  <h2 className='text-[0.7rem] sm:text-[0.9rem] md:text-[1rem] font-mono font-medium text-white'>{getMonthYear(ele.forDate)}</h2></div>
            </div></button> 
           )
        })
      }
     </div>}
    {timings.length>0 && <div className='w-full flex flex-row gap-2 py-3 px-2 bg-gray-200 border-2 rounded-xl shrink-0 flex-wrap'>
          {
            timings.map((ele,index)=>{
              return (
                <button key={index} onClick={()=>{setCurrentClickedTime(ele);}} className={`w-[25vw]  sm:w-[14vw] md:w-[12vw] lg:w-[10vw] xl:w-[8vw] h-[5vh] rounded-[20px]  text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] border-2  ${currentClickedTime===ele? "text-white bg-gray-800":" bg-white text-black"}  font-medium font-sans cursor-pointer`}>{ele}</button>
              )
            })
          }
     </div>
     }
     {
      (currentClickedDay.length>0 && currentClickedTime?.length>0) &&
      <Seat currentClickedTime={currentClickedTime} currentClickedDay={currentClickedDay} selectSeats={selectSeats} setSelectSeats={setSelectSeats} />
     }
   
     {
      selectSeats.length>0 &&
      <div className=' bottom-0 fixed flex flex-row justify-evenly items-center bg-black border-2 w-full h-[10vh] px-5'>
        <div className='flex flex-col items-center border-2 rounded-xl h-[7vh] sm:h-[8vh] md:h-[9vh] bg-white px-3'>
          <h1 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans font-medium text-gray-700'>Selected Seats</h1>
          <p className='text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-serif '>{selectSeats.length}</p>
        </div>
        <div className='flex justify-center items-center'>
          <motion.button whileTap={{scale:0.9}} transition={{duration:0.15,ease:"easeIn"}} className={`text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] font-sans rounded-xl w-[28vw] sm:w-[20vw] md:w-[15vw] lg:w-[10vw] xl:w-[10vw] h-[6vh] cursor-pointer flex justify-center items-center ${checkSeat? "bg-green-200":"bg-green-300"}`} onClick={()=>{ setTimeout(()=>{activateCheckSeat()},200)}}>{!checkSeat ? `Pay ₹${pay}` : <Spinner/> }</motion.button>
        </div>
      </div>
     }
     </div>}
     {
      loading && <PageLoader/>
     }
   <AnimatePresence> {checkSeat  && <motion.div initial={{scale:0.8,opacity:0,y:-30}} exit={{scale:0.8,opacity:0,y:-30}} animate={{scale:1,opacity:1,y:0}} transition={{duration:0.15,ease:"linear"}} className='absolute top-1/2 left-1/2  translate-[-50%] w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[30vh] bg-gray-800 rounded-xl border-2 flex justify-center items-center'>
         {showCheckSeatMsg &&
           <p className='text-[0.8rem] sm:text-[1.1rem] md:text-[1.2rem] font-mono font-bold text-green-300 '>Wait! confirming your seats<motion.span initial={{width:[50],opacity:0}} animate={{width:[100],opacity:1}} transition={{duration:0.15, repeat:Infinity}}>....</motion.span></p>
         }
         {
          !showCheckSeatMsg && <div className='flex flex-col w-full p-2  gap-2 items-center'>
            <p className='text-[0.8rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans font-bold text-red-400 '>Something went wrong with our server</p>
            <motion.button whileTap={{scale:0.9}} transition={{duration:0.15,ease:"easeIn"}} onClick={()=>{location.reload(); setShowCheckSeatMsg(false); setCheckSeat(false);}} className='w-[30vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[5vh] text=[1rem] sm:text-[1.1rem] md:text-[1.2rem] rounded-2xl cursor-pointer font-mono bg-blue-500 text-white font-medium'>Refresh</motion.button>
          </div>
         }
     </motion.div>}</AnimatePresence> 
     {
      (showsTimes?.length===0 || showsTimes===null) && !loading && <div className='absolute top-1/2 left-1/2 transform translate-[-50%] flex flex-col justify-center items-center gap-2 bg-black px-5 py-3 border-2 rounded-lg'>
       <img src="/Images/flim.png" alt="Failed to load" className='w-15 h-15 sm:w-25 sm:h-25 rounded-md'/>  
        <h1 className='text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans text-white font-medium tracking-[2px]'>Comming Soon</h1>
      </div>
     }
     <Toaster position="top-center" reverseOrder={true}
  gutter={8} toastOptions={{duration:5000}} />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TicketContent />
    </Suspense>
  );
}