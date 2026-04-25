"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Poppins, Montserrat } from 'next/font/google';
import {motion} from "framer-motion";
const poppins=Poppins({
  subsets:["latin"],
  weight:"600",
});
const montserrat = Montserrat({ subsets: ['latin'], weight: ['500'], });
const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.2,ease:"linear"}}
}
const item={
  hidden:{opacity:0,y:-30},
  visible:{opacity:1,y:0}
}
function page() {
  const router=useRouter();

  return (
    <motion.div variants={container as any} initial="hidden" animate="visible" className='flex flex-col justify-center items-center w-full px-2 py-3 gap-5'>
       <div className='flex justify-start items-center w-full '>
         <button onClick={()=>{router.push("/")}} className='p-2 flex justify-center  items-center  cursor-pointer '><img src="/Images/backarrow.png" className='7.5 h-7.5'/></button>
      </div>
      <motion.div variants={item} className='flex flex-col gap-2 w-full px-5 py-3 bg-blue-200 rounded-xl'>
      <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]  `}>About CineSlot</h1>
      <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>Welcome to CineSlot, your simple, fast, and smart way to book movie tickets online.
We created CineSlot to remove the frustration of standing in long queues, checking multiple apps, and worrying about seat availability at the last moment. Our platform lets you discover movies, select seats, and confirm bookings within seconds — all from the comfort of your home.</p>
      </motion.div>
      <motion.div variants={item} className='flex flex-col gap-2 w-full px-5 py-3 bg-yellow-200 rounded-xl'>
      <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]  `}>Our Mission</h1>
      <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>Our mission is to make movie ticket booking effortless and accessible for everyone.
We believe watching movies should start with excitement, not stress. CineSlot helps you plan your movie experience in advance so you can focus only on enjoying the show.</p>
      </motion.div>
      <motion.div variants={item} className="flex flex-col gap-2 w-full px-5 py-3 bg-green-200 rounded-xl">
      <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]`}>Why Choose CineSlot? </h1>
      <ul className={`${montserrat.className} list-disc px-5 py-3 text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem] `}>
        <li>Fast and smooth booking experience</li>
        <li>Clean and user-friendly interface</li>
        <li>Live seat availability system</li>
        <li>Secure authentication and booking</li>
        
      </ul>
      </motion.div>
       <motion.div variants={item} className='flex flex-col gap-2 w-full px-5 py-3 bg-orange-200 rounded-xl'>
      <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem] `}>Our Vision</h1>
      <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>We aim to become a reliable digital companion for every movie lover — helping people plan outings, save time, and enjoy cinema without hassle.</p>
      </motion.div>
      <motion.div variants={item} className='flex flex-col gap-2 w-full px-5 py-3 bg-rose-200 rounded-xl'>
      <h1 className={`${poppins.className} text-[1.3rem] sm:text-[1.4rem] lg:text-[1.5rem]  `}>Build With Passion ❤️</h1>
      <p className={`${montserrat.className} text-[0.9rem] sm:text-[1rem] lg:text-[1.2rem]`}>CineSlot is developed as a modern full-stack web platform using contemporary web technologies to ensure performance, security, and scalability.
Our goal is to continuously improve the experience by adding smarter recommendations, faster bookings, and better theatre integrations.</p>
      </motion.div>
    </motion.div>
  )
}

export default page