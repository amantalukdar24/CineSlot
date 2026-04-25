import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { sortTimes } from '../services/date';
import {motion} from "framer-motion";
interface PropsI{
    times:string[],
    setShowTimesComp:React.Dispatch<React.SetStateAction<boolean>>,
    movieId:string,
    forDate:string,

}
function SelectShow({times,setShowTimesComp,movieId,forDate}:PropsI) {
    const router=useRouter();
    const [sortedTimes,setSortedTimes]=useState<string[]>([...sortTimes(times)]);
    
  return (
    <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}  className='absolute top-1/2 left-1/2 transform translate-[-50%] w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] min-h-[40vh]  bg-gray-800 rounded-2xl flex flex-col gap-2  '>
        <div className='flex flex-row justify-start p-4 w-full'>
            <button className='text-[1.5rem] font-sans text-white cursor-pointer' onClick={()=>{setShowTimesComp(false)}}>{`<`}</button>
            <h1 className='w-full text-[1.5rem] text-white font-serif text-center '>Select Time</h1>
        </div>
        <div className='grid grid-cols-3 gap-2 p-2 h-[25vh] overflow-auto'>
        {
            sortedTimes?.map((ele,index)=>{
                return (
                    <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  key={index} className='w-[25vw] sm:w-[20vw] md:w-[15vw] lg:w-[10vw] h-[5vh] text-[1rem] sm:text-[1.2rem] bg-white text-black font-mono rounded-xl cursor-grab hover:bg-blue-500 hover:text-white' onClick={()=>{setTimeout(()=>{router.push(`/shows?movieId=${movieId}&forDate=${forDate}&time=${ele.split(" ")[0]}+${ele.split(" ")[1]}`)},180)}}>{ele}</motion.button>
                )
            })
        }
        </div>
    </motion.div>
  )
}

export default SelectShow