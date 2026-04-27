"use client";
import { useSearchParams,useRouter } from 'next/navigation';
import {currentMoviesI} from "../pages/Home"
import {useState,useEffect, Suspense} from 'react';
import {toast} from 'react-hot-toast';
import Addtimeform from './addtimeform';
import SelectShow from './selectShow';
import {datetoString} from "../services/date";
import EditCover from '../component/EditCover';
import { minutesToHoursAndMinutes } from '../services/date';
import {motion,AnimatePresence} from "framer-motion";
import PageLoader from '../component/PageLoader';
import { WakeUp } from '../services/movieservicewakeup';
const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.2,ease:"linear"}}
}
const items={
   hidden:{opacity:0,x:-30},
  visible:{opacity:1,x:0}
}
function MovieContent() {
    const url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const searchParams = useSearchParams();
    const id:string|null=searchParams.get("id");
    const router=useRouter();
 const [movie,setMovie]=useState<currentMoviesI | null>(null);
 const [viewMore,setViewMore]=useState<boolean>(false);
 const [showAddtime,setShowAddtime]=useState<boolean>(false);
 const [showTimes,setShowTimes]=useState<any>([]);
 const [forDateId,setForDateId]=useState<string>("");
 const [times,setTimes]=useState<string[]|null>(null);
 const [showTimesComp,setShowTimesComp]=useState<boolean>(false);
 const [editCover,setEditCover]=useState<boolean>(false);
 const [loading,setLoading]=useState<boolean>(false);
    useEffect(()=>{
      if(editCover) return;
      if(loading) return;
      setLoading(true);
      if(!WakeUp()){
          setLoading(false);
         toast("Opps! Try Again",{icon:"😮‍💨", style:{color:"orangered",backgroundColor:"black"}});
         return;
    }
          const getMovie=async ():Promise<void>=>{
            const result=await fetch(`${url}/movie/getmovie?id=${id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":localStorage.getItem("token") as string
                }
            });
            const data=await result.json();
            if(data.success) setMovie(data.movie);
           else{
            router.push("/");
            toast.error(data.mssg)
      
           }
           
           setLoading(false);
          }
          getMovie();
        
    },[editCover]);
useEffect(()=>{
 const getShowTimes=async ():Promise<void>=>{
    if(showAddtime || movie===null) return;
     if(!WakeUp()){
      return;
    }
  const result=await fetch(`${url}/show/getshowtime`,{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token") as string
    },
    body:new URLSearchParams({movieId:movie._id})
  });
  
  const data=await result.json();
  if(data.success) {
  setShowTimes(data.showsTimeData);
  }
  
 }

 getShowTimes();
},[movie,showAddtime])

  return (
    <div className=' relative flex flex-col gap-4 w-full  px-2 py-3'>
       <div className='flex justify-between items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='px-4 py-2 flex justify-center items-center cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
        {movie!==null && !loading && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className='w-[35vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[5vh] text-[1rem] md:text-[1.2rem] font-mono bg-black text-white rounded-xl cursor-pointer' onClick={()=>{setTimeout(()=>{setEditCover(true)},180)}}>Edit Cover</motion.button>}
      </div>
    <AnimatePresence>  {editCover && <EditCover movieId={movie?._id as string} setEditCover={setEditCover} />}</AnimatePresence>
    {!loading && movie!==null && <>
    <img src={movie?.coverImage.url} alt={`${movie?.name} image`} className='w-full h-[10vh] sm:h-[15vh] md:h-[20vh] object-fill rounded-xl'/>
    <motion.div variants={container as any} initial="hidden" animate="visible" className='flex flex-col gap-4'>
    <motion.div variants={items} className='flex justify-center bg-gray-200 border-2 rounded-xl items-center'><h1  className='text-[1.4rem] sm:text-[1.7rem] lg:text-[2rem]  font-[Arial] font-bold tracking-[0.1vw] px-2 text-center text-gray-700'>{movie?.name}</h1></motion.div>
    <motion.div variants={items} className='flex flex-col sm:flex-row gap-1 sm:gap-5 w-full items-start sm:items-center text-[0.9rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans font-medium px-2 py-3 bg-gray-200 rounded-xl border-2'>
      <h3 className=' font-medium'>{movie?.genres}</h3>
      <h3 className='hidden sm:flex'>|</h3>
      <h3 >{movie?.lang}</h3>
      <h3 className='hidden sm:flex'>|</h3>
      <h3>{minutesToHoursAndMinutes(movie?.duration as string)}</h3>
    </motion.div>
    <motion.div variants={items} className='flex flex-col gap-3 px-4 py-2 bg-gray-200 border-2 rounded-xl  '>
      <div className='flex flex-col gap-1' >
      <h2 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] font-[Arial] text-gray-800 font-bold '>About</h2>
      <p className={`${viewMore? "line-clamp-0":"line-clamp-3" } text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-sans `}>{movie?.description}</p>
     <h3 onClick={()=>{setViewMore(!viewMore)}} className='cursor-pointer text-[1rem] font-serif text-green-800'>View {`${viewMore? "Less":"More"}`} </h3>
       </div>
       <div className='flex flex-col gap-1 '>
      <h2 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] font-[Arial] text-gray-800 font-bold'>Actors</h2>
      <p className='text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-sans'>{movie?.staffs.actors}</p>
</div>
<div className='flex flex-col gap-1'>
  <h2 className="text-[1rem] lg:text-[1.2rem] font-[Arial] text-gray-800 font-bold">Produced By:{movie?.staffs.producer}</h2>
    <h2 className="text-[1rem] lg:text-[1.2rem] font-[Arial] text-gray-800 font-bold">Directed By:{movie?.staffs.director}</h2>
</div>
    </motion.div>
    <motion.div variants={items} className='flex flex-col gap-1 bg-gray-200 border-2 rounded-xl'>
      <div className='flex flex-row justify-between px-3 py-4'>
        <h1 className='text-[1.2rem] sm:text-[1.3rem] md:text-[1.5rem] font-[Arial] '>Show Timings</h1>
        <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className='w-[30vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[5vh] bg-black text-white text-[1rem] sm:text-[1.1rem] md:text-[1.3rem] font-mono rounded-xl cursor-pointer' onClick={()=>{setTimeout(()=>{setShowAddtime(!showAddtime)},180)}}>Add Timing</motion.button>
    <AnimatePresence>  { showAddtime && movie!==null && <Addtimeform setShowAddTime={setShowAddtime} movie={movie}/>}</AnimatePresence> 
      </div>
     <div className='flex flex-row items-center justify-center gap-2 px-4 py-2 shrink-0 flex-wrap overflow-auto '> 
      {
        showTimes.length>0 && 
        showTimes.map((ele:any)=>{
          return(
            <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  key={ele._id} className='w-[35vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] h-[5vh] text-[1rem] md:text-[1.2rem] bg-white font-sans rounded-xl cursor-pointer' onClick={()=>{setTimeout(()=>{setTimes(ele.times); setShowTimesComp(true); setForDateId(ele._id)},180)}}>{datetoString(ele?.forDate)}</motion.button>
          )
        })
      }{
        showTimes.length===0 && <div className='font-sans text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-semibold '>No Shows Timings are added</div>
      }
   <AnimatePresence> {showTimesComp  && times!==null && <SelectShow times={times} setShowTimesComp={setShowTimesComp} movieId={id as string} forDate={forDateId}  />}</AnimatePresence> 
      </div>
    </motion.div>
    </motion.div>
    </>
}
{
  loading && <PageLoader/> 
}
    </div>
  )
}
export default function page() {
  return (
    <Suspense fallback={<PageLoader/>}>
      <MovieContent />
    </Suspense>
  )
}