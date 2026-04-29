"use client";
import React from 'react'
import Image from 'next/image'
import {  useRouter } from 'next/navigation';
import { useState,useRef,useEffect } from 'react';
import {toast,Toaster} from "react-hot-toast"
import { AuthUser } from '../services/auth';
import {motion} from "framer-motion";
import Spinner from '../component/Spinner';
function Signin() {
  const url=process.env.NEXT_PUBLIC_AuthSer_URL;
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [step,setStep]=useState(1);
  const [otp,setOtp]=useState(new Array(4).fill(""));
  const [timer,setTimer]=useState(30);
 const [loading,setLoading]=useState<boolean>(false);
  const inputRef=useRef<(HTMLInputElement | null)[]>([]);
  useEffect(()=>{
  if(AuthUser()) router.push("/");
  },[])
  useEffect(()=>{
    inputRef.current[0]?.focus();
  },[step]);
  const handleChangeMail=(e:any)=>{
    setEmail(e.target.value);
  }
  const handleChangeOtp=(e:any,index:number)=>{
     const val = e.target.value;

  
  if (!/^[0-9]?$/.test(val)) return;

  const copyField = [...otp];
  copyField[index] = val;
  setOtp(copyField);

  if (val && index < 3) {
    inputRef.current[index + 1]?.focus();
  }
  }
  const getOtp=async ()=>{
    
    if(email==="") return;
 if(step===1) setStep(step+1);
    setTimer(30);
    const result=await fetch(`${url}/user/getotp`,{
      method:"POST",headers:{
        "Content-Type":"application/x-www-form-urlencoded",
},
 body:new URLSearchParams({email,mode:"signin"})
    });
    const data=await result.json();
    
    if(data.success){
     
      toast.success(data.mssg);
    }
    else{
      setStep(1);
       toast.error(data.mssg);
    }
    
  }
  const handleSubmit=async ()=>{
    if(loading) return;
    setLoading(true);
    const finalOtp=otp.join("");
    if(email==="") {
      toast.error("Enter the valid email");
      setLoading(false);
      return;
    }
    if(finalOtp.length<4) {
      toast.error("Fill the otp box");
      setLoading(false);
      return;
    }
  
    const result=await fetch(`${url}/user/signin`,{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
},
    body:new URLSearchParams({email,finalOtp})
    });
    const data=await result.json();
    if(data.success){
      localStorage.setItem("token",data.token);
      toast.success(data.mssg);
      router.push("/");
    }
    else{
           toast.error(data.mssg);
    }
    setLoading(false);
  }
useEffect(() => {
  if (timer <= 0) return;

  const timerInterval = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(timerInterval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timerInterval);
}, [timer]);

  
  return (
    <motion.div initial={{y:30,opacity:0,scale:0.8}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.3,ease:"easeIn"}} className='flex flex-row w-full h-screen justify-center items-center '>
      <Toaster position="top-center" reverseOrder={true}
  gutter={8} toastOptions={{duration:5000,    style: {
      background: '#363636',
      color: '#fff',
    },}} />
      <div className='w-[80vw]   sm:w-[70vw] md:w-[60vw] lg:w-[50vw]   xl:w-[40vw]   lg:h-[60vh] flex flex-col  border-2 rounded-[40px] sm:rounded-[50px] shadow-[0.8px_8px_25px] shadow-blue-500  bg-gray-700 p-4'>
       <div className='w-full flex flex-row items-center'>
    <button className='text-[1.3rem] md:text-[1.5rem] lg:text-[1.7rem] xl:text-[1.8rem] w-[3vw] h-[6vh] cursor-pointer font-mono text-white' onClick={()=>{step==1 ? router.push("/"): setStep(step-1)}} >{`<`}</button>
       <h1 className='w-full text-[1.5rem] md:text-[1.7rem] lg:text-[1.9rem]  xl:text-[2rem] font-mono text-[#ada5a5] text-center'>Sign in</h1>
       </div>
   { step===1 &&   <div>
       <div className='relative  flex flex-row mt-10 lg:mt-15 xl:mt-20 justify-center items-center'>

        <input type="email" placeholder='jhondoe@gmail.com' value={email} onChange={handleChangeMail} required className='pl-10 sm:pl-12 lg:pl-13 xl:pl-15 text-[0.8rem] sm:text-[1rem] lg:text-[1.1rem] xl:text-[1.2rem] font-serif outline-2 rounded-xl w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] bg-white'/>
        <Image src="/Images/email.png" alt="email icon" width={0} height={0} className='absolute left-[2vw] sm:left-[3vw] md:left-[3.5vw] lg:left-[4vw] xl:left-[4.2vw] w-7.5 h-7.5  ' />

       </div>
       <div className='flex flex-row justify-center items-center mt-15 xl:mt-30'>
        <motion.button whileTap={{scale:0.9}} transition={{duration:0.15,ease:"easeIn"}} type="submit" onClick={()=>{getOtp()}} className='w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-[5vh] bg-blue-300 text-[1rem] lg:text-[1.1rem] xl:text-[1.3rem] font-[Arial] cursor-pointer rounded-xl'>Continue</motion.button></div></div>}
        {
          step===2 && <div>
            <div className='flex flex-col gap-2 mt-10 md:mt-8 xl:mt-15'>
              <h1 className='text-[1rem] sm:text-[1.2rem] xl:text-[1.5rem] font-mono text-gray-200 '>Enter your 4 digit OTP.</h1>
              <div className='flex flex-row justify-center mt-5 sm:mt-6 xl:mt-10 gap-5 sm:gap-8 xl:gap-10'>
                {
                  otp.map((value,index)=>{
                    return(
                    <input key={index} required maxLength={1} ref={(currentInput: HTMLInputElement | null):any=>(inputRef.current[index]=currentInput)} onChange={(e)=>{handleChangeOtp(e,index)}} 
                         onKeyDown={(e) => {
    if (e.key === "Backspace") {
      let copyField = [...otp];
      copyField[index] = "";
      setOtp(copyField);
      if (index > 0) inputRef.current[index - 1]?.focus();
    }
  }}
                    type="number" value={value}  className='w-[12vw] sm:w-[8vw]  xl:w-[5vw] h-[6vh] text-center text-[1.2rem] font-sans bg-white rounded-lg outline-2 focus:outline-4 focus:outline-blue-400 '/>
                    )
})
                }
              </div>
              <div className='flex flex-row justify-center text-[0.8rem]  md:text-[0.9rem] lg:text-[1rem] mt-5  lg:mt-10 gap-2'> 
                <h5 className='  text-white'>Didn't receive an otp?</h5>
                {timer>0 && <h5 className=' text-green-400'>{`${timer<10 ? `0${timer}s`: `${timer}s`}`}</h5>}
                {timer<=0 && <h5 className=' text-red-400 cursor-pointer' onClick={()=>{getOtp(); setTimer(30);}}>Resend</h5>}
              </div>
              <div className='flex flex-row justify-center items-center mt-5 lg:mt-10'>
                <motion.button whileTap={{scale:0.9}} transition={{duration:0.15,ease:"easeIn"}} className={`w-[40vw] sm:w-[30vw] md:w-[25vw]  lg:w-[20vw] h-[5vh] rounded-xl text-[1rem] sm:text-[1.2rem] lg:text-[1.3rem] xl:text-[1.5rem] font-mono text-gray-800 cursor-pointer ${loading? "bg-blue-200":"bg-blue-400"} flex justify-center items-center`} onClick={()=>{handleSubmit()}}>{!loading? "Submit" : <Spinner/>}</motion.button>
              </div>
            </div>
            </div>
        }
     {step===1 &&    <div className='flex flex-row justify-center items-center gap-1 xl:gap-2 text-[0.8rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.3rem] xl:text-[1.4rem] mt-10'>
          <h2 className='text-white'>Don't have account?</h2>
          <span className='text-green-300 cursor-pointer' onClick={()=>{router.push("/signup")}}>Register Now</span>
        </div>}
      </div>

    </motion.div>
  )
}

export default Signin