"use client";
import {useState,useEffect,Suspense} from 'react';
import {toast} from "react-hot-toast";
import { useRouter,useSearchParams } from 'next/navigation';
import { MoviesI } from '../pages/Home';
import { minutesToHoursAndMinutes } from '../services/date';
import {motion} from "framer-motion";
import PageLoader from '../component/skeletons/PageLoader';

const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.2,ease:"linear"}}
}
const items={
   hidden:{opacity:0,x:-30},
  visible:{opacity:1,x:0}
}
function MovieContent() {
    const MovieServiceUrl:string=process.env.NEXT_PUBLIC_MovieService_URL as string;
    const [movie,setMovie]=useState<MoviesI | null>(null);
    const [viewMore,setViewMore]=useState<boolean>(false);
    const [loading,setLoading]=useState<boolean>(false);
    const searchparams=useSearchParams();
    const router=useRouter();
    const id:string|null=searchparams.get("id");
    useEffect(()=>{
        if(id===null) {
            router.push("/");
            toast.error("No movie Found");
            return;
        }
     const getMovie=async ():Promise<void>=>{
      if(loading) return;
      setLoading(true);
      const result=await fetch(`${MovieServiceUrl}/movie/getmovie?id=${id}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },

      });
      const data=await result.json();
     
      if(data.success) setMovie(data.movie);
      else {
        router.push("/");
        toast.error("No movie Found");
        
      }
      setLoading(false);
     }
     getMovie();
    },[])
    
  return (
 <div  className='flex flex-col items-center px-2 py-3  gap-5 w-full h-screen'>
  
   <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='px-4 py-2 flex justify-center items-center cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
     {!loading && movie!==null && <div className='flex flex-col items-center w-full gap-5'>
    <img src={movie?.coverImage.url} alt='Failed to load cover image' className='w-full h-[20vh] sm:h-[25vh] rounded-xl object-fill '/>
    <motion.div variants={container as any} initial="hidden" animate="visible" className='flex flex-col gap-5 '>
    <motion.div variants={items} className='flex flex-row  justify-between items-center px-2 py-3  rounded-xl  border-2 bg-gray-200 w-full  '>
     <h1 className='text-[1.4rem] sm:text-[1.6rem] lg:text-[1.8rem] font-serif font-bold'>{movie?.name}</h1>
     <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] w-[35vw] sm:w-[30vw] md:w-[25vw] lg:w-[20vw] xl:w-[15vw] 2xl:w-[10vw] h-[6vh] bg-[lightcoral]   rounded-2xl cursor-pointer font-mono'
      onClick={()=>{setTimeout(()=>{router.push(`/movie/ticket?id=${movie?._id}`)},300)}}>Book Ticket</motion.button>
    </motion.div>
    <motion.div variants={items} className='flex flex-col sm:flex-row gap-1 sm:gap-5 w-full items-start sm:items-center text-[0.9rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans font-medium px-2 py-3 bg-gray-200 rounded-xl border-2'>
      <h3 className=' font-medium'>{movie?.genres}</h3>
      <h3 className='hidden sm:flex'>|</h3>
      <h3 >{movie?.lang}</h3>
      <h3 className='hidden sm:flex'>|</h3>
      <h3>{minutesToHoursAndMinutes(movie?.duration as string)}</h3>
    </motion.div>
    <motion.div variants={items} className='flex flex-col gap-4 px-4 py-2 w-full border-2 bg-gray-200 rounded-xl '>
     <h2 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] font-sans font-semibold'>About the movie</h2>
     <p className={`text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-serif ${!viewMore? "line-clamp-3" :"line-clamp-none"}`}>{movie?.description}</p>
     <h3 className='text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-mono text-orange-500 cursor-grab' onClick={()=>{setViewMore(!viewMore)}}>View {`${!viewMore? "More" : "Less"}`}</h3>
    </motion.div>
    <motion.div variants={items} className='flex flex-col gap-4 px-4 py-2 border-2 bg-gray-50 rounded-xl w-full  '>
     <h2 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] font-sans font-semibold'>Actors</h2>
     <p className="text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-serif">{movie?.staffs.actors}</p>
     <div className='flex flex-col gap-2'>
     <h3 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] text-mono font-medium'>Produced By: {movie?.staffs.producer}</h3>
     <h3 className='text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] text-mono font-medium'>Directed By: {movie?.staffs.director}</h3>
     </div>
    </motion.div>
    </motion.div>
   </div>}
   {loading && <PageLoader/>}
 </div>
)
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MovieContent />
    </Suspense>
  );
}