"use client";
import React, {  useEffect} from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { AuthUser } from '../services/auth';
import { usePathname,useRouter } from 'next/navigation';
import {motion} from "framer-motion";
interface NavbarI{
  setSearch:React.Dispatch<React.SetStateAction<boolean>>;
}
const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.2,ease:"linear"}}
}
const item={
  hidden:{opacity:0,x:-30},
  visible:{opacity:1,x:0}
}
function Navbar({setSearch}:NavbarI) {
  const pathname=usePathname();
  const router=useRouter();
 const [loggedIn,setLoggedIn]=useState<boolean>(false);
 const [showMenu,setShowMenu]=useState<boolean>(false);
 const hidePathname=pathname==="/movie" || pathname==="/movie/ticket" || pathname==="/payment" || pathname==="/payment/success" || pathname==="/about-us" || pathname==="/contact-us" || pathname==="/bookings" || pathname==="/bookings/order" || pathname==="/terms";
 

 useEffect(()=>{
 if(AuthUser()) setLoggedIn(true);
 else setLoggedIn(false)
 },[])
 

  return (
    <div className={`hidden sticky  w-full ${!hidePathname ? "sm:flex sm:flex-row  justify-start" : "hidden" } pl-4 pr-4 pt-2 pb-2 border-b-2 rounded-xl shadow-2xl  shadow-black`}>

      <div className='flex flex-row  w-[50%] '>
    <div className='flex flex-row justify-center items-center sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.7rem]  '>
        <span className='font-[cursive] tracking-[0.1rem] text-blue-500'>Cine</span>
        <span className='font-[fantasy] tracking-[0.2rem] text-gray-500  '>Slot</span>
    </div>
    <div className='relative flex flex-row justify-center items-center sm:w-[35vw] md:w-[30vw] lg:w-[30vw] '>
    <Image src="/Images/search.png"  alt=""  width={0} height={0}  className='absolute left-[3vw] md:left-[3vw] w-5 h-5 lg:w-7.5 lg:h-7.5 '/>
     <input type="text" placeholder='Search for movies.' readOnly className=' sm:w-[30vw] md:w-[25vw] lg:w-[25vw] h-[5vh] outline-2 outline-black rounded-2xl pt-4 pb-4 pl-8 lg:pl-12 pr-4 font-[mono] text-[1rem] lg:text-[1.1rem]'
     onClick={()=>{setSearch(true)}}
     />
    </div>
    </div>
    <div className='flex flex-row sm:w-[60%] md:w-[40%] lg:w-[30%]  '>
      <motion.div variants={container as any} initial="hidden" animate="visible" className='w-full flex flex-row justify-between items-center gap-3 md:gap-5 sm:text-[1rem] md:text-[1.2rem] lg:text-[1.3rem] font-sans font-medium'>
     <Link href="/"> <motion.h1 variants={item} className={`${pathname==="/" ? "text-rose-500": ""} cursor-pointer`}>Home</motion.h1></Link> 
     <Link href="/about-us">  <motion.h1 variants={item} className={`${pathname==="/about-us" ? "text-rose-500": ""} cursor-pointer`}>About Us</motion.h1></Link>
      <Link href="/contact-us"><motion.h1 variants={item} className={`${pathname==="/contact-us" ? "text-rose-500": ""} cursor-pointer`}>Contact Us</motion.h1></Link> 
      </motion.div>
     
    
    </div>
     {!loggedIn && <div className='flex flex-row justify-center items-center ml-[5vw] md:ml-[10vw]'>
      <Link href="/signin" ><button className='sm:w-[8vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] h-[5vh] bg-[black] cursor-pointer font-sans text-white sm:text-[0.8rem] md:text-[1rem] lg:text-[1.2rem] rounded-xl '>Sign in</button></Link> 
      </div>}
    {loggedIn && <div className='relative flex justify-center items-center ml-[10vw]'>
        <button onClick={()=>{setShowMenu(!showMenu)}} className='cursor-pointer  '><img src="/Images/menu.png" className='w-7.5 h-7.5'/></button>
       {showMenu && <motion.div variants={container as any} initial="hidden" animate="visible"  className='absolute top-13 right-1 sm:w-[25vw]  lg:w-[20vw] xl:w-[15vw] h-[15vh] border-2 bg-gray-50  rounded-md px-2 py-3 flex flex-col items-center justify-center gap-2'>
       <motion.div variants={item}  className='sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] font-mono font-medium  sm:w-[20vw] lg:w-[15vw] xl:w-[10vw]  text-gray-600 cursor-pointer hover:text-blue-500 flex flex-row justify-center items-center gap-2 ' onClick={()=>{router.push("/bookings"); setShowMenu(false)}}><img src="/Images/ticketicon.png" alt="Failed to load" className='w-7.5 h-7.5 rounded-md'/> Bookings</motion.div>
        <motion.div variants={item}  className='sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] font-mono font-medium sm:w-[20vw] lg:w-[15vw] xl:w-[10vw] text-gray-600 cursor-pointer hover:text-blue-500 flex flex-row justify-center items-center gap-2 ' onClick={()=>{router.push("/account"); setShowMenu(false)}}><img src="/Images/account.png" alt="Failed to load" className='w-7.5 h-7.5 rounded-md'/> Account</motion.div>
       

        </motion.div>}
     </div>}
    </div>
  )
}

export default Navbar