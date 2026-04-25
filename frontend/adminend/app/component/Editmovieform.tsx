"use client";
import React,{useState,useEffect} from 'react'
import { toast} from 'react-hot-toast';
import { useRouter} from "next/navigation";
import {motion} from "framer-motion";
import Spinner from './Spinner';
interface setProps{
    setEditForm: React.Dispatch<React.SetStateAction<boolean>>;
    movieId:string,
}
type formState={
    name:string,description:string,producer:string,director:string,actors:string,genres:string,lang:string,duration:string,start:string,end:string
}
function Editmovieform({setEditForm,movieId}:setProps) {
    const url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const router=useRouter();
    const minDate=new Date().toISOString().split("T")[0];
    const [input,setInput]=useState<formState>({
        name:"",description:"",producer:"",director:"",actors:"",genres:"",lang:"",duration:"",start:"",end:""
    });
   const [loading,setLoading]=useState<boolean>(false);
    const [step,setStep]=useState<number>(1);
const handleChangeForm=(e:any)=>{
        setInput((prev:any)=>{
         return(
                {...prev,[e.target.name]:e.target.value}
            )

        })
    }
        useEffect(()=>{
              const getMovie=async ():Promise<void>=>{
                const result=await fetch(`${url}/movie/getmovie?id=${movieId}`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        "authorization":localStorage.getItem("token") as string
                    }
                });
                const data=await result.json();
               if(data.success) {
                    setInput({name:data.movie.name,description:data.movie.description,director:data.movie.staffs.director,producer:data.movie.staffs.producer,actors:data.movie.staffs.actors,genres:data.movie.genres,lang:data.movie.lang,duration:data.movie.duration,start:new Date(data.movie.dates.start).toISOString().split("T")[0],end:new Date(data.movie.dates.end).toISOString().split("T")[0]} as formState)
                }
               else{
                router.push("/");
                toast.error(data.mssg)
          
               }
               
               
              }
              getMovie();
            
        },[]);
    
    const checkInputsStep1=():boolean=>{
        if(input.name==="" || input.description==="" || input.producer==="" || input.director==="" || input.actors==="" ){
            if(input.name===""){
             toast.error("Movie Name Field is empty"); 
             return false;
            }
            if(input.description===""){
                 toast.error("Description Field is empty");
                 return false;
            }
            if(input.producer===""){
                 toast.error("Producer Name Field is empty");
                 return false;
            }
            if(input.director===""){
            toast.error("Directors Name Field is empty");
            return false;
            }
            if(input.actors==="") {
                toast.error("Actors Names Field are empty");
                return false;
            }
           
            
        }
        return true;

    }
    const checkInputsStep2=():boolean=>{
        if(input.start==="" || input.end==="" || input.lang==="" || input.duration===""){
            if(input.lang===""){
                toast.error("Movie Language can't be empty");
                return false;
            }
            if(input.duration===""){
                toast.error("Duration filed is empty");
                return false;
            }
            
            if(input.start==="") {
                toast.error("Start Date Field is empty");
                return false;
            }
            if(input.end==="") {
                toast.error("End Date Field is empty");
                return false;
            }
          
        }
        return true;
    }
    const handleSubmit=async ()=>{
        if(loading) return;
        if(!checkInputsStep1()) return;
        if( !checkInputsStep2()) return;
        setLoading(true);
        const staffs=JSON.stringify({
            producer:input.producer,
            director:input.director,
            actors:input.actors
        });
        const dates=JSON.stringify({
            start:input.start,
            end:input.end,
        });
      
        const result=await fetch(`${url}/movie/edit`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "authorization":localStorage.getItem("token") as string,
            },
            body:new URLSearchParams({name:input.name,description:input.description,staffs,genres:input.genres,lang:input.lang,duration:input.duration,dates,movieId})
        });
        const data=await result.json();
        if(data.success){
            toast.success(data.mssg);
            setEditForm(false);
        }
        else{
             toast.error(data.mssg);
        }
        setLoading(false);
    }
 const handelBackBtn=():void=>{
    if(step===1) setEditForm(false);
    else if(step==2) setStep(1);
 }
  return (
    <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}  className='absolute top-1/2 left-1/2 transform translate-[-50%] bg-gray-800 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] h-[70vh]  md:h-[70vh] lg:h-[70vh] xl:h-[75vh] rounded-2xl flex flex-col items-center '>
        <div className='flex flex-row w-full justify-start items-center mt-2 pl-2 '>
          <button className='text-[1.8rem] text-white font-mono w-[5vw] h-[5vh] cursor-pointer' onClick={()=>{handelBackBtn()}} >{`<`}</button>
        </div>
        <div className='flex flex-col gap-4 items-center mt-5 md:mt-7 lg:mt-8 xl:mt-10 text-[0.9rem]  md:text-[1rem] xl:text-[1.1rem] font-serif '>
        {step==1 &&  <> <input type="text" name="name" value={input.name} placeholder='Enter your movie name' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] outline-black p-4 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
            <textarea name="description" value={input.description} placeholder='Describe about the movie' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[10vh] outline-black pl-4 pr-4 pt-2 pb-2 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
            <input type="text" name="producer" value={input.producer} placeholder='Enter the Producer Name' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] outline-black p-4 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
            <input type="text" name="director" value={input.director} placeholder='Enter your Director Name' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] outline-black p-4 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
            <textarea name="actors" value={input.actors} placeholder='Enter all actors, actress and other artists names. Format: Akshay Kumar, Johnny Lever' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[10vh] outline-black pl-4 pr-4 pt-2 pb-2 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
 </> 
  }
         {step===2 && <>  
          <input type="text" name="duration" value={input.duration} placeholder='Enter duration in minutes ex- 180 ' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] outline-black p-4 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
         <input type="text" name="lang" value={input.lang} placeholder='Movie Language ex- English, Bengali, Hindi etc.. ' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] outline-black p-4 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
          <textarea name="genres" value={input.genres} placeholder='Enter Genres! ex- Action, Drama, Romantic ...' className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[10vh] outline-black pl-4 pr-4 pt-2 pb-2 rounded-xl bg-white' onChange={(e)=>{handleChangeForm(e)}}/>
         
            <div className='flex flex-row w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]'>
                <div className='flex flex-col justify-start gap-2 w-full'>
                     <h2 className='text-[1rem] lg:text-[1.1rem] xl:text-[1.2rem] font-sans text-white '>Start Date</h2>
                    <input type="date" name="start" value={input.start} min={minDate} className='w-[34vw] sm:w-[29vw] md:w-[24vw] lg:w-[19vw] xl:w-[14vw] h-[5vh] p-2 font-sans bg-white rounded-xl' onChange={(e)=>{handleChangeForm(e)}}/>
                </div>
                 <div className='flex flex-col justify-start gap-2'>
                     <h2 className='text-[1rem] lg:text-[1.1rem] xl:text-[1.2rem] font-sans text-white '>End Date</h2>
                    <input type="date" name="end" value={input.end} min={minDate}   className='w-[34vw] sm:w-[29vw] md:w-[24vw] lg:w-[19vw] xl:w-[14vw] h-[5vh] p-2 font-sans bg-white rounded-xl' onChange={(e)=>{handleChangeForm(e)}}/>
                </div>
            </div></> }
        </div>
      {step===1 &&  <div className='flex flex-row justify-center items-centerw-full mt-8 md:mt-10  xl:mt-15'>
            <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} className='w-[30vw] md:w-[20vw] lg:w-[15vw] h-[5vh] font-mono bg-blue-500 text-white cursor-pointer text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] rounded-2xl' onClick={()=>{setTimeout(()=>{if(checkInputsStep1()) setStep(2);},180)}}>Next</motion.button>
        </div>}
       {step===2 && <div className='flex flex-row justify-center items-centerw-full mt-10  md:mt-10 lg:mt-8  xl:mt-10'>
            <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} className={`w-[30vw] md:w-[20vw] lg:w-[15vw] h-[5vh] font-mono ${loading? "bg-blue-200" : "bg-blue-500"} text-white cursor-pointer text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] rounded-2xl flex justify-center items-center`} onClick={()=>{handleSubmit()}}>{!loading ? "Submit" : <Spinner/>}</motion.button>
        </div>} 
    </motion.div>
  )
}

export default Editmovieform