"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { currentMoviesI } from "../pages/Home";
import { datetoString } from "../services/date";
import {motion} from "framer-motion";
interface MovieDivI{
    movies:currentMoviesI[],
    type:string,
    setEditForm:React.Dispatch<React.SetStateAction<boolean>>,
    setMovieId:React.Dispatch<React.SetStateAction<string>>
}
function MovieDiv({movies,type,setEditForm,setMovieId}:MovieDivI){
    const router=useRouter();
    return(
           <div className='flex flex-row justify-evenly sm:justify-start gap-2  flex-wrap shrink-0  mt-5 sm:mt-0 w-full'>
         {
          movies?.map((ele)=>(
            
            <div key={ele._id} className='flex flex-col w-[40vw] sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[20vw] pb-4 border-2 bg-white rounded-2xl'>
              <img src={ele.coverImage.url}  alt={`${ele.name} image`} className='w-full h-28 object-fill rounded-tr-2xl rounded-tl-2xl'/>
              <h1 className='text-[1.3rem] sm:text-[1.5rem] md:text-[1.8rem] font-[Arial] text-center  '>{ele.name}</h1>
         <div className='flex flex-col justify-evenly px-2'> <h4 className='text-[0.6rem] sm:text-[1.1rem] font-sans text-green-600'>{`Start: ${datetoString(ele.dates.start)}`}</h4>
         <h4 className='text-[0.6rem] sm:text-[1.1rem] text-red-500 font-sans '>{`End: ${datetoString(ele.dates.end)}`}</h4>
         </div>
         <div className='flex flex-col justify-center items-center mt-5 gap-2'>
          <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} className='w-[20vw] sm:w-[15vw] md:w-[10vw] h-[5vh] text-[1.1rem] sm:text-[1.2rem] cursor-grab font-sans bg-blue-500 hover:bg-black text-white rounded-3xl' onClick={()=>{setTimeout(()=>{router.push(`/movie?id=${ele._id}`)},180)}}>View</motion.button>
          {type==="current" && <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className='w-[20vw] sm:w-[15vw] md:w-[10vw] h-[5vh] text-[1.1rem] sm:text-[1.2rem] cursor-grab font-sans bg-yellow-600 hover:bg-black text-white rounded-3xl' onClick={()=>{setTimeout(()=>{setEditForm(true); setMovieId(ele._id);},180)}}>Edit</motion.button>}
         </div>
         
            </div>
  ))
         }
          </div>
    )
}
export default MovieDiv;