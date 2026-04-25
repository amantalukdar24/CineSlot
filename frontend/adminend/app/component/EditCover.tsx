"use client";
import React,{useState,useRef} from "react";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion";
import Spinner from "./Spinner";
interface EditCoverI{
    movieId:string,
    setEditCover:React.Dispatch<React.SetStateAction<boolean>>
}
function EditCover({movieId,setEditCover}:EditCoverI){
    const url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const inputRef=useRef<any>(null);
    const [coverImage,setCoverImage]=useState<File | null>(null);
    const [loading,setLoading]=useState<boolean>(false);
      const handleChangleCI=(e:any)=>{
        if(typeof e.target.files[0]===null) return;
        setCoverImage(e.target.files[0]);
        
    }
    const handleSubmit=async ():Promise<void>=>{
        if(loading) return;
        if(coverImage===null) {
            toast.error("Select Image");
            return;
        }
        setLoading(true);
        const formData=new FormData();
        formData.append("movieId",movieId);
        formData.append("coverImage",coverImage)
        const result=await fetch(`${url}/movie/editcover`,{
            method:"PATCH",
            headers:{
                "authorization":localStorage.getItem("token") as string,
            },
            body:formData
        });
        const data=await result.json();
        if(data.success){
            toast.success(data.mssg);
            setEditCover(false);
        }
        else{
            toast.error(data.mssg)
        }

      setLoading(false);
    }
    return(
        <motion.div initial={{opacity:0,scale:0.8,y:-50}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.8,y:50}} transition={{duration:0.3,ease:"easeInOut"}}  className="absolute top-1/2 left-1/2 transform translate-[-50%] bg-gray-800 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] py-5 rounded-2xl flex flex-col gap-5 items-center">
        <div className='flex flex-row w-full justify-start items-center mt-2 pl-2 '>
          <button className='text-[1.8rem] text-white font-mono w-[5vw] h-[5vh] cursor-pointer' onClick={()=>{setEditCover(false)}} >{`<`}</button>
        </div>
         <div className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]  h-[12vh] xl:h-[10vh] rounded-xl border-dashed border-4 border-blue-500 bg-white flex flex-col justify-center items-center'>
                <input type="file"   ref={inputRef} accept=".jpeg, .jpg" className='hidden' onChange={(e)=>{handleChangleCI(e)}}/>
                <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className="w-[50vw] sm:w-[30vw] md:w-[25vw] lg:w-[20vw] h-[5vh] rounded-xl bg-amber-400 cursor-pointer" onClick={()=>{inputRef.current?.click();}}>Upload Cover Image</motion.button>
                {coverImage!==null && <h5  className=' sm:text-[1rem] xl:text-[1.1rem] font-mono text-black'>{coverImage.name}</h5>}
            </div>
    <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}}  className={`w-[30vw] md:w-[20vw] lg:w-[15vw] h-[5vh] font-mono ${loading? "bg-blue-200": "bg-blue-500"} text-white cursor-pointer text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] rounded-2xl flex justify-center items-center`} onClick={()=>{handleSubmit()}}>{!loading? "Submit" : <Spinner/>}</motion.button>
        </motion.div>
    )
}
export default EditCover