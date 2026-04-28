import React,{useState,useEffect} from 'react'
import {currentMoviesI} from "../pages/Home"
import { convertTimeto12 } from '../services/date'
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
import Spinner from '../component/Spinner';
import { WakeUp } from '../services/movieservicewakeup';
interface PropsI{
  setShowAddTime:React.Dispatch<React.SetStateAction<boolean>>,
  movie:currentMoviesI
}
function Addtimeform({setShowAddTime,movie}:PropsI) {
  const url=process.env.NEXT_PUBLIC_AuthSer_URL;
const startDate=new Date()<=new Date(movie?.dates.start) ? new Date(movie?.dates.start).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
const endDate= new Date(movie?.dates.end).toISOString().split("T")[0];
const [forDate,setForDate]=useState<string>("");
const [times,setTimes]=useState<string[]>([]);
const [currentTime,setCurrentTime]=useState<string>("");
const [loading,setLoading]=useState<boolean>(false);
const handleAddTime=():void=>{
  if(currentTime.length<=0) return;
   const dummyTimes=Array.from(new Set([...times,convertTimeto12(currentTime)]));
   setTimes(dummyTimes);
   setCurrentTime("");
}
const handleRemovetime=(time:string):void=>{
   const dummyTimes=times.filter((ele)=>{
    return ele!==time;
   });
   setTimes(dummyTimes)
}
const handleSubmit=async ()=>{
  if(loading) return;
  if(forDate.length===0 || times.length<=0) return;
  const sendData={
     forDate:forDate,
     times:JSON.stringify(times),
     movieId:movie._id

  };
  setLoading(true);
   if(!(await WakeUp())){
      setLoading(false);
      toast("Opps! Try Again",{icon:"😮‍💨", style:{color:"orangered",backgroundColor:"black"}});
      return;
    }
  const result=await fetch(`${url}/show/create`,{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token") as string
    },
    body:new URLSearchParams(sendData)
  });
  const data=await result.json();
  if(data.success){
    toast.success(data.mssg);
    setShowAddTime(false);
  }
  else{
    toast.error(data.mssg)
  }
  setLoading(false);
}
  return (
    <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}  className='absolute top-1/2 left-1/2 transform translate-[-50%] w-[80vw]  sm:w-[70vw] md:w-[60vw] lg:w-[50vw]   xl:w-[40vw] h-[65vh] rounded-xl bg-gray-700 flex flex-col  gap-2'>
     <div className='flex justify-start mt-5'>
        <button className='w-[5vw] h-[5vh] text-[2rem] text-white font-sans cursor-pointer' onClick={()=>{setShowAddTime(false)}}>{`<`}</button>
     </div>
     <div className='flex flex-col w-full items-center p-2 gap-2 '>
      <h1 className='text-[1.5rem]  font-sans text-white '>Select Date</h1>
      <input value={forDate} min={startDate} max={endDate} type="date" className='p-2 w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] bg-white border-2 rounded-xl text-[1.2rem] font-sans' onChange={(e)=>{setForDate(e.target.value)}}/>
      </div>
       <div className='flex flex-col items-center w-full p-2 gap-2 '>
      <h1 className='text-[1.5rem]  font-sans text-white ' >Add Show Times</h1>
      <div className='flex flex-row w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] justify-between items-center'>
      <input value={currentTime}  type="time" className='p-2 w-[50vw] sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[20vw] h-[5vh] bg-white border-2 rounded-xl text-[1.2rem] font-sans' onChange={(e)=>{setCurrentTime(e.target.value);}}/>
      <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className='text-[1.2rem] w-[10vh] h-[5vh] bg-blue-500 rounded-xl text-white cursor-pointer' onClick={()=>{handleAddTime();}}>Add</motion.button>
      </div>
    {times.length>0 && <div className='flex flex-row gap-3 flex-wrap w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] max-h-[15vh] overflow-auto'>
       {
         times.map((ele,index)=>{
          return(
            <div key={index} className='flex flex-row text-[1rem] md:text-[1.2rem] justify-between items-center w-[25vw] sm:w-[20vw]  md:w-[15vw] lg:w-[10vw] xl:w-[8vw] xl:h-[5vh] p-2 bg-white rounded-xl text-black'>
              <h1>{ele}</h1>
              <button  onClick={()=>{handleRemovetime(ele)}}>X</button>
              </div>
          )
         })
      }
     </div>}
       <div className='flex justify-center items-center mt-10 '>
                <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} onClick={()=>{handleSubmit()}} className={`w-[30vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] h-[5vh] ${loading? "bg-blue-200": "bg-blue-500"} text-white font-mono text-[1.3rem] lg:text-[1.5rem] rounded-2xl cursor-pointer flex justify-center items-center`}>{!loading ? "Submit" : <Spinner/> }</motion.button>
       </div>
      </div>
       
    </motion.div>
  )
}

export default Addtimeform