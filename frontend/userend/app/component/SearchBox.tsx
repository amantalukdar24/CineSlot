"use client";
import React,{useState,useEffect} from "react";
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
import { MoviesI } from "../pages/Home";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
interface SearchBoxI{
    movies:MoviesI[],
    setSearch:React.Dispatch<React.SetStateAction<boolean>>
}
const poppins=Poppins({
  subsets:["latin"],
  weight:"600",
});
const container={
  hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:0.15,ease:"linear"}}
}
const item={
  hidden:{opacity:0,y:20},
  visible:{opacity:1,y:0}
}
export default function SearchBox({movies,setSearch}:SearchBoxI){
  const router=useRouter();
    const [filterMovies,setFilterMovies]=useState<MoviesI[]>([]);
    const [searchInput,setSearchInput]=useState<string>("");
    useEffect(()=>{
      if(searchInput.length===0) {
        setFilterMovies([]);
        return;
      };
      const filteredMovies=movies.filter((movie)=>movie.name.toLowerCase().includes(searchInput.toLowerCase()));
      setFilterMovies(filteredMovies);
    },[searchInput])
    return(

        <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}} className="absolute  transform top-1/2 left-1/2 translate-[-50%] z-5 w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] h-[60vh]  bg-gray-800 rounded-2xl  flex flex-col gap-2 px-2 py-3">
           <div className="flex justify-start items-center px-2 py-3">
                <button className="text-[1.3rem] md:text-[1.5rem] lg:text-[1.7rem] xl:text-[1.8rem] w-[3vw] h-[6vh] cursor-pointer font-mono text-white" onClick={()=>{setSearch(false)}}>{`<`}</button>
         </div>
         <div className="relative flex justify-center items-center px-2 py-3 w-full">
          <input type="text" value={searchInput} placeholder="Search Movies" className="w-full h-[5vh] bg-white font-mono rounded-lg px-10 py-2" onChange={(e)=>{setSearchInput(e.target.value)}}/>
          <img src="/Images/search.png" className="w-5 h-5 absolute left-4"/>
         </div>
         <motion.div variants={container as any} initial="hidden" animate="visible" key={filterMovies?.length} className="flex flex-col gap-2 px-2 py-3 h-[30vh] overflow-auto ">
                {
                    filterMovies.map((movie:MoviesI)=>{
                      return(
                        <motion.div variants={item} key={movie._id} className="flex flex-row items-center gap-5 bg-white rounded-xl px-2 py-3 cursor-pointer" onClick={()=>{router.push(`/movie?id=${movie._id}`)}}>
                         <img src={movie.coverImage.url} alt="Failed to Load" className="w-10 h-10 rounded-md"/>
                         <h1 className={`${poppins.className} text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] font-black`}>{movie.name}</h1>
                         
                        </motion.div>
                      )
                    })
                }
         </motion.div>
         </motion.div>
         
    )
}