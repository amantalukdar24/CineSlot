"use client";
import React from 'react';
import {useState,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from '../component/SearchBox';
import {motion,AnimatePresence} from "framer-motion"
import HomeS from '../component/skeletons/Home';
interface MoviesI{
  _id:string,producedBy:string,
  name:string,description:string,coverImage:{url:string,publicId:string},dates:{start:Date,end:Date},staffs:{producer:string,director:string,actors:string[],},genres:string,lang:string,duration:string,

}
export type {MoviesI};
interface SearchI{
  search:boolean,
  setSearch:React.Dispatch<React.SetStateAction<boolean>>;
}
const container={
  hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:0.15,ease:"linear"}}
}
const item={
  hidden:{opacity:0,x:20},
  visible:{opacity:1,x:0}
}
function HomePage({search,setSearch}:SearchI) {
  const urlMovieService:string=process.env.NEXT_PUBLIC_MovieService_URL as string;
  const [movies,setMovies]=useState<MoviesI[] | null>(null);
  const [loading,setLoading]=useState<boolean>(false);
  const router=useRouter();
  useEffect(()=>{
     const getMovies=async ():Promise<void>=>{
          if(loading) return;
          setLoading(true);
          const result=await fetch(`${urlMovieService}/movie/getmovies?get=current`,{
            method:"GET",
            headers:{
              "Content-Type":"application/json"
            }
          });
          const data=await result.json();
          if(data.success) setMovies(data.getMovies);
          setLoading(false);
     }
     getMovies();
  },[])
  
  return (
   <div className='flex flex-col gap-2 sm:mt-2 '>
    <AnimatePresence>{search  && <SearchBox setSearch={setSearch} movies={movies ?? []}/>}</AnimatePresence>
   <div className='flex flex-col gap-4 px-4 pt-2 sm:pt-10 pb-3   '>
    <h1 className='text-[1.3rem] sm:text-[1.4rem] md:text-[1.6rem] lg:text-[1.8rem] font-sans text-gray-900 font-semibold bg-gray-200  rounded-xl px-3'>Movies</h1>
    
    <motion.div key={movies?.length} variants={container as any} initial="hidden" animate="visible" className='flex flex-row gap-5 shrink-0 flex-wrap w-full   overflow-auto justify-between md:justify-start max-h-[80vh] px-2 py-3'>
      {
        movies!==null && !loading && movies.length>0 &&
        movies.map((movie)=>(
        <motion.div variants={item}  whileHover={{scale:1.03}} transition={{duration:0.15,ease:"easeIn"}} key={movie._id} className='flex flex-col items-center gap-2 w-[40vw] sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] pb-4 bg-gray-50 border-2 rounded-xl hover:drop-shadow-lg hover:drop-shadow-blue-600'>
          <img src={movie.coverImage.url}  alt="Failed to Load Cover Image" className='w-full h-[15vh] object-fill rounded-tr-xl rounded-tl-xl' />
          <h1 className='text-[1.2rem] sm:text-[1.5rem] lg:text-[1.7rem] font-sans font-medium text-black text-center'>{movie.name}</h1>
          <div className='flex flex-col gap-1 items-center text-[0.6rem] sm:text-[0.9rem] lg:text-[1rem] font-sans font-medium '>
          <p className='overflow-auto'>{movie.genres}</p>
          <p>{movie.lang}</p>
          </div>
          
          <motion.button whileTap={{scale:0.8}} transition={{ease:"easeIn"}} className='w-[30vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[5vh] bg-blue-500  rounded-2xl text-white font-sans font-medium cursor-pointer text-[1rem] md:text-[1.2rem]' onClick={()=>{setTimeout(()=>{router.push(`/movie?id=${movie._id}`)},300)}}>Book Tickets</motion.button>
          </motion.div>
         
        ))
      }
      {
        loading && <HomeS/>
      }
      {
       movies!==null && movies?.length===0 && !loading &&
       <div className='absolute top-1/2 left-1/2 transform translate-[-50%] flex flex-col justify-center items-center bg-black w-[80vw] sm:w-[60vw] md:w-[50vw] xl:w-[30vw] h-[20vh] rounded-xl'> 
          <img src="/Images/flim.png" alt="Failed to load" className='w-15 h-15 sm:w-25 sm:h-25 rounded-md'/>
          <p className='text-[1rem] sm:text-[1.1rem] md:text-[1.3rem] font-serif font-semibold text-white'>Movies are coming soon</p>
       </div>
      }
    </motion.div>
   
   </div>

   </div>
  )
}

export default HomePage