"use client";
import {useState,useEffect,useCallback} from 'react'
import Addmovieform from '../component/Addmovieform';
import Editmovieform from '../component/Editmovieform';
import { Poppins } from 'next/font/google';
import MovieDiv from '../component/MovieDiv';
import {motion,AnimatePresence} from "framer-motion";
import { WakeUp } from "../services/movieservicewakeup";
interface currentMoviesI{
  _id:string,producedBy:string,
  name:string,description:string,coverImage:{url:string,publicId:string},dates:{start:Date,end:Date},staffs:{producer:string,director:string,actors:string[],},genres:string,lang:string,duration:string

}
export type {currentMoviesI};
const poppins=Poppins({
  subsets:["latin"],weight:"600"
})

function HomePage() {
  const url=process.env.NEXT_PUBLIC_AuthSer_URL;
  const [addForm,setAddForm]=useState<boolean>(false);
  const [currentMovies,setCurrentMovies]=useState<currentMoviesI[]>([]);
  const [completeMovies,setCompleteMovies]=useState<currentMoviesI[]>([]);
  const [editForm,setEditForm]=useState<boolean>(false);
  const [movieId,setMovieId]=useState<string>("");
  const getMovies=async (type:string):Promise<void>=>{
           if(addForm) return;
            if(!WakeUp()){
            return;
    }
   const result=await fetch(`${url}/movie/getmovies?get=${type}`,{
         method:"GET",
         headers:{
           "Content-Type":"application/json",
           "authorization":localStorage.getItem("token") as string,
         }

   });
   const data=await result.json();
 if(type==="current") setCurrentMovies(data.getMovies);
 if(type==="complete") setCompleteMovies(data.getMovies);
   
    }
  useEffect(()=>{
  
    getMovies("current");
    
  },[addForm])
  useEffect(()=>{
    getMovies("complete");
  },[])
  
  return (
    <div className=' flex flex-col w-full gap-5 items-center px-2 py-3'>
        <div className='flex flex-col w-full gap-4'>
          <div className='w-full flex flex-col sm:flex-row justify-between sm:items-center border-2 bg-gray-100 rounded-xl px-2 py-3  gap-3 sm:gap-0'>
           <h1 className={`${poppins.className} text-[1.1rem] lg:text-[1.3rem]  `}>Ongoing & Upcoming movies</h1>
           <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className='w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[15vw] h-[6vh] md:h-[5vh] lg:h-[5vh] xl:h-[3vw] bg-gray-900 rounded-xl text-white text-[1.1rem] md:text-[1.2rem] cursor-pointer' onClick={(e:any)=>{setTimeout(()=>{setAddForm(true)},180)}}>Add New Movie</motion.button>
         <AnimatePresence> {addForm && <Addmovieform setAddForm={setAddForm} />}</AnimatePresence> 
           <AnimatePresence>{editForm && <Editmovieform setEditForm={setEditForm} movieId={movieId}/>}</AnimatePresence>
          </div>
           <MovieDiv movies={currentMovies} type="current" setEditForm={setEditForm} setMovieId={setMovieId}/>
         
        </div>
        {completeMovies?.length>0 && <div className='flex flex-col w-full gap-4'>
           <div className='flex justify-start px-2 py-3 w-full border-2 rounded-xl bg-gray-100'>
            <h1 className={`${poppins.className} text-[1.1rem] md:text-[1.3rem]`}>Completed Movies</h1>
          </div>
          <MovieDiv movies={completeMovies} type="complete" setEditForm={setEditForm} setMovieId={setMovieId}/>
        </div>}
    </div>
  )
}

export default HomePage