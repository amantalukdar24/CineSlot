"use client";
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Poppins,Montserrat } from 'next/font/google';
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
const poppins=Poppins({
    subsets:["latin"],
    weight:"600",
  });
  const montserrat =Montserrat({ subsets: ['latin'], weight: ['500'], });
 const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.3,ease:"easeIn"}}
}
const item={
  hidden:{opacity:0,y:20},
  visible:{opacity:1,y:0}
}
function Page() {
    const router=useRouter();
    const AuthService_Url=process.env.NEXT_PUBLIC_AuthSer_URL;
    const [user,setUser]=useState<{Name:string,Email:string,Landmark:string,City:string,Pincode:string} | null>(null)
    useEffect(()=>{
        const getAccount=async ():Promise<void>=>{
            const result=await fetch(`${AuthService_Url}/admin/getaccount`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":localStorage.getItem("token") as string,
                }
            });
            const data=await result.json();
            if(data.success){
                 setUser({Name:data.user.name,Email:data.user.email,Landmark:data.user.address.landmark,City:data.user.address.city,Pincode:data.user.address.pincode});
            }
            else{
                toast.error(data.mssg);
                router.push("/");
            }
        }
        getAccount();
    },[])
   const handleLogout=():void=>{
    setTimeout(()=>{
          localStorage.removeItem("token");
         router.push("/");
   },200)
   }
    return(
    <div className='flex flex-col gap-5 items-center h-screen px-2 py-3'>
    <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='p-2 flex justify-center  items-center  cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5, ease:"linear"}} className='w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] flex flex-col gap-2 border-2 rounded-md px-2 py-3'>
       <div className='flex justify-center items-center border-b-2 px-2 py-3'>
        <h1 className={`${poppins.className} text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] tracking-wide`}>Account Details</h1>
       </div>
       {user!==null && <motion.div variants={container as any} initial="hidden" animate="visible" className='flex flex-col px-2 py-3  gap-2'>
    {
        Object.entries(user).map(([key,value])=>{
           return(
            <motion.div key={key} variants={item}  className='text-[0.7rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem]'><span className={`${poppins.className}`}>{key}: </span><span className={`${montserrat.className} `}>{value}</span></motion.div>
           )
        })
    }
   </motion.div>
    }
    <div className='flex justify-center items-center w-full px-2 py-3'>
           <motion.button  whileTap={{scale:0.9}}  transition={{duration:0.15, ease:"easeIn"}} className='w-[30vw] sm:w-[25vw] md:w-[19vw] lg:w-[14vw] xl:w-[7vw] h-[5vh] bg-orange-400   font-mono rounded-md cursor-pointer text-[1rem] sm:text-[1.1rem] md:text-[1.2rem]' onClick={()=>{handleLogout()}}>Logout</motion.button>
    </div>
        </motion.div>
  
  
    </div>
  )
}

export default Page