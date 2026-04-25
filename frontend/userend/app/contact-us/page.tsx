"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import { Poppins,Montserrat } from 'next/font/google';
import {motion} from "framer-motion";

 const poppins=Poppins({
    subsets:["latin"],
    weight:"600",
  });
  const montserrat =Montserrat({ subsets: ['latin'], weight: ['500'], });
function page() {
  const router=useRouter();
 
  return (
    <div   className='flex flex-col gap-2 px-2 py-3 h-screen'>
     <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='p-2 flex justify-center  items-center  cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:"easeIn"}} className='flex flex-col gap-2 px-2 py-3 bg-linear-to-r from-orange-200 to-orange-100 rounded-xl border-2'>
         <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]`}>Contact Us</h1>
         <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>At CineSlot, your experience matters to us. Whether you have a question about your booking, need help with payments, or want to share feedback, our team is here to assist you.</p>
         <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]`}>Get in Touch</h1>
         <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>Email: support@cineslot.com</p>
         <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]`}>Support Hours</h1>
         <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>10:00 AM – 8:00 PM (IST)</p>
         <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]`}>We Value Your Feedback</h1>
         <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>Your suggestions help us improve CineSlot and deliver a better movie booking experience every day.</p>
      </motion.div>
      
    </div>
  )
}

export default page