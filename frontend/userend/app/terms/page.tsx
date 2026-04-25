"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Poppins,Montserrat } from 'next/font/google';
import {motion} from "framer-motion";
const poppins=Poppins({
    subsets:["latin"],
    weight:"600",
  });
  const montserrat =Montserrat({ subsets: ['latin'], weight: ['500'], });
  const container={
    hidden:{opacity:0,y:30},
    visible:{opacity:1,y:0,transition:{staggerChildren:0.2,ease:"linear"}}
  }
  const item={
    hidden:{opacity:0,y:20},
    visible:{opacity:1,y:0}
  }
function Page() {
    const router=useRouter();
    const terms:{title:string,desc:string}[]=[{
        title:"1. Booking Confirmation",desc:"Tickets are confirmed only after successful payment. Please check movie name, date, time, and seat details before payment."
    },{title:"2. Payments",desc:"All payments are processed securely. Convenience fees and taxes may apply."},{
        title:"3. Cancellation & Refund",desc:"Tickets once booked may not be cancelled unless allowed by the cinema. Refunds (if applicable) will be processed to the original payment method."
    },{
        title:"4. User Responsibility",desc:"You are responsible for maintaining your account details and keeping your login information secure."
    },{title:"5. Misuse of Platform",desc:"Any fraudulent activity, misuse, or attempt to harm the platform may result in account suspension."},{title:"6. Changes to Terms",desc:"CineSlot may update these terms at any time."}]
  return (
    <div className='flex flex-col gap-5 items-center h-screen px-2 py-3'>
    <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='p-2 flex justify-center  items-center  cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
    <motion.div variants={container as any} initial="hidden" animate="visible" className='w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] flex flex-col gap-2 border-2 rounded-md px-2 py-3'>
       <div className='flex justify-center items-center border-b-2 px-2 py-3'>
        <h1 className={`${poppins.className} text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem]`}>Terms & Conditions</h1>
       </div>
       {terms.map((ele,index)=>{
        return(
      <motion.div variants={item} key={index} className='flex flex-col px-2 '>
      <h3  className={`${montserrat.className} text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem]`}>{ele.title}</h3>
      <p className="font-sans  text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] lg::text-[1.1rem]">{ele.desc}</p>
    </motion.div>
        )
       })
   }
    </motion.div>
   
    </div>
  )
}

export default Page