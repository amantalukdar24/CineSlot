"use client";
import React, { useEffect } from 'react'
import Link from 'next/link';
import { useState } from 'react';
import { AuthUser } from '../services/auth';
function Navbar() {
  const [auth,setAuth]=useState<boolean>(false);
  useEffect(()=>{
     setAuth(AuthUser());
  },[auth])
   const handleLogout=():void=>{
      localStorage.removeItem("token");
      setAuth(false);
   }
  return (
    <div className='w-full flex flex-row justify-between gap-2 lg:gap-4 px-4 py-2 border-b-2 rounded-xl shadow-2xl  shadow-black'>

      <div className='flex flex-row   sm:w-[50%]'>
    <div className='flex flex-row justify-center items-center sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.7rem]  '>
        <span className='font-[cursive] tracking-[0.1rem] text-blue-500'>Cine</span>
        <span className='font-[fantasy] tracking-[0.2rem] text-gray-500  '>Slot</span>
    </div>
    <div className='flex flex-row justify-start items-center text-[1.2rem] font-[cursive] '>
     <h4>-For Staffs</h4>
    </div>
    </div>
    
      <div className='flex flex-row justify-center items-center'>
   {!auth &&  <Link href="/signin" ><button className='sm:w-[8vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] h-[5vh] bg-[black] cursor-pointer font-sans text-white sm:text-[0.8rem] md:text-[1rem] lg:text-[1.2rem] rounded-xl '>Sign in</button></Link> }
   {auth && <div className='px-4 sm:px-10'><Link href="/account"><img src="/Images/user.png" alt="Failed to Load" className='w-7.5 h-7.5 rounded-md cursor-pointer' /></Link></div> }
      </div>
    </div>
 
   
  )
}

export default Navbar