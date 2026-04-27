"use client";
import {useState,useEffect,Suspense} from 'react'
import { useSearchParams,useRouter } from 'next/navigation'
import {toast,Toaster} from "react-hot-toast";
import {datetoString } from '../services/date';
import {motion} from "framer-motion";
import Spinner from '../component/Spinner';
import PaymentS from '../component/skeletons/Payment';
import { AuthUser } from '../services/auth';
import { WakeUp } from '../services/paymentservicewake';
function PaymentContent() {
  const AuthService_Url=process.env.NEXT_PUBLIC_AuthSer_URL as string;
  const searchParams=useSearchParams();
  const router=useRouter();
  const movieId:string | null=searchParams.get("movieId");
  const forDate:string | null =searchParams.get("forDate");
  const time:string | null =searchParams.get("time");
  const seats:string[] | null=JSON.parse(searchParams.get("seats") as string);
  const [showTime,setShowTime]=useState<any>(null);
  const [timer,setTimer]=useState<number>(300);
  const [loading,setLoading]=useState<boolean>(false);
  const [contentLoading,setContentLoading]=useState<boolean>(false);
   useEffect(()=>{
     if(!AuthUser) router.push("/signin");
    },[])
 const handleRemoveSeats=async ():Promise<void>=>{
    if(!movieId || !forDate || !time || !seats) return;
    const result=await fetch(`${AuthService_Url}/seatbook/removeseats`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        "authorization":localStorage.getItem("token") as string
      },
      body:new URLSearchParams({movieId,forDate,time,seats:JSON.stringify(seats)})
    });
    const data=await result.json();
   
    if(!data.success){
      
     router.push(`/movie/ticket?id=${movieId}`);
    toast.error("Something Went Wrong! Please Try again");
    }
    else{
      router.push(`/movie/ticket?id=${movieId}`);

    }
  }
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  const handleBackBtn=():void=>{
    
    handleRemoveSeats();
    window.history.pushState(null, "", window.location.href);
  }
  window.addEventListener("popstate",handleBackBtn);
  return ()=>{
    window.removeEventListener("popstate",handleBackBtn);
  }
}, []);
const loadScript=(src:string)=>{
  return new Promise((resolve)=>{
    const script=document.createElement("script");
    script.src=src;
    script.onload=()=>{
      resolve(true)
    };
    script.onerror=()=>{
      resolve(false);
    };
    document.body.appendChild(script);

  })
}
const onPayment=async ():Promise<void>=>{
    if(!movieId || !forDate || !time || !seats) return;
    if(loading) return;
    setLoading(true);
    if(!WakeUp()){
      setLoading(false);
      toast("Opps! Try Again",{icon:"😮‍💨", style:{color:"orangered",backgroundColor:"black"}});
      return;
    }
   const res1=await fetch(`${AuthService_Url}/payment/createorder`,{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded",
      "authorization":localStorage.getItem("token") as string
    },
    body:new URLSearchParams({selectedSeats:JSON.stringify(seats)})
   });
   const data1=await res1.json();
   if(data1.success){
    const paymentObject=new (window as any).Razorpay({
      key:process.env.NEXT_PUBLIC_Razorpay_Key as string,
      order_id:data1.order.id,
      ...data1,
      handler:async function (response:any){
      const  order_id=response.razorpay_order_id;
      const payment_id=response.razorpay_payment_id;
      const signature=response.razorpay_signature;
      const res2=await fetch(`${AuthService_Url}/payment/verifypayment`,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded",
          "authorization":localStorage.getItem("token") as string
        },
        body:new URLSearchParams({order_id,payment_id,signature,forDate,movieId,time,selectedSeats:JSON.stringify(seats)})
      });
      const data2=await res2.json();
      
      if(data2.success) {
       toast.success("Payment Successful");
       router.push(`/payment/success?movieId=${movieId}&pid=${payment_id}`);

      }
       else toast.error("Payment Unsuccessful")
      }
      

    });
    paymentObject.open()
   }
   else toast.error("Payment Unsuccessful")
   setLoading(false);
}
useEffect(()=>{
loadScript("https://checkout.razorpay.com/v1/checkout.js");
},[])
 useEffect(()=>{
    if(!localStorage.getItem("token")) router.push("/signin");
    if(!movieId || !forDate || !time || (!seats || seats.length===0) ) {
      toast.error("Invalid Request");
      router.push("/");
      return;
    }
   const checkValidQuery=async ():Promise<void>=>{
    if(contentLoading) return;
    setContentLoading(true);
       const result=await fetch(`${AuthService_Url}/payment/checkpaymentquery`,{
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded",
          "authorization":localStorage.getItem("token") as string,
},
     body:new URLSearchParams({forDate,movieId,time,selectedSeats:JSON.stringify(seats)})
       });
       const data=await result.json();
       if(!data.success){
        toast.error(data.mssg);
        handleRemoveSeats();
       
       }
       setShowTime(data.findShowTime);
       setContentLoading(false);
   }
   checkValidQuery();
  },[])
const getPrice=(seatType:string):{count:number,price:number}=>{
  if(seatType==="Regular"){
    let price=0;
    let count=0;
    seats?.forEach((seat:string)=>{
      if(seat.startsWith("A")) {
        count++;
        price+=100;
      }
    });
    return {count,price};
  }
  else if(seatType==="Premium"){
    let price=0;
    let count=0;
    seats?.forEach((seat:string)=>{
      if(seat.startsWith("B")){
        count++;
        price+=200;
      }
    });
    return {count,price};
  }
   else if(seatType==="Vip"){
    let price=0;
    let count=0;
    seats?.forEach((seat:string)=>{
      if(seat.startsWith("C")) {
        count++;
        price+=350;
      }
    });
    return {count,price};
  }
  else return {count:0,price:0};
}
function convertSeconds(seconds:number):string {
  
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;
  return `${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

useEffect(()=>{
   const interval=setInterval(()=>{
     setTimer((prev:number):number=>{
      if(timer<=0){
        clearInterval(interval);
        handleRemoveSeats();
        return 0;
}
    return prev-1;
     })
   },1000)
   return ()=>clearInterval(interval)
},[timer])

  return (
<div className='flex flex-col w-full gap-5 px-2 py-5 h-screen bg-gray-700'>
  <Toaster position="top-center" reverseOrder={true}
  gutter={8} toastOptions={{duration:5000}} />
      <div className='flex flex-row justify-start items-center w-full px-2 py-3 bg-white  rounded-md'>
         <button onClick={()=>{handleRemoveSeats()}} className='  w-[5vw] h-[5vh] cursor-pointer'><img src="/Images/backarrow.png" className='7.5 h-7.5 color '/></button>
         <div className='w-full flex justify-center items-center'>
          <h1 className='text-green-400 text-[0.9rem] sm:text-[1.1rem] lg:text-[1.2rem]'>Complete Your Booking within:<span className='text-yellow-500'> {convertSeconds(timer)} </span></h1>
         </div>
      </div>
     
      <motion.div initial={{scale:0.8,y:20}} animate={{scale:1,y:0}} transition={{duration:0.5,ease:"easeIn"}}  className='w-full flex flex-col items-center lg:items-start lg:flex-row gap-5 lg:gap-0  justify-evenly mt-10 lg:mt-20'>
     {showTime!==null && !contentLoading && showTime!==undefined && <div  className='flex flex-col gap-3 px-2 py-3  items-center  border-2 rounded-md w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] h-[32vh] sm:h-[35vh] bg-gray-800'>
       <div className='flex flex-row items-center w-full justify-between px-3 py-2 bg-gray-700 rounded-md'>
        <h1 className=' text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.5rem] text-white font-bold font-sans '>{showTime?.movieId?.name}</h1>
        <img src={showTime?.movieId?.coverImage?.url} className='w-17.5 h-15 sm:w-25 sm:h-20 rounded-xl object-fill'/>
       </div>
      <div className='w-full flex flex-row gap-5 items-center bg-gray-700 rounded-md px-2 py-3'>
         <h3 className='text-[0.7rem] sm:text-[1rem] font-sans  text-green-400'>Date: {datetoString(showTime?.forDate)}</h3>
         <h3 className='text-[0.7rem] sm:text-[1rem] font-sans  text-yellow-400'>Show Time: {time}</h3>
        </div>
        <div className='flex flex-row items-center gap-2 px-2 py-3 w-full bg-gray-700 rounded-md'>
          <h1 className='text-[0.9rem] sm:text-[1.1rem] md:text-[1.2rem]  font-sans text-blue-500 '>Seats Selected:</h1>
          <p className='text-[0.9rem] sm:text-[1.1rem] md:text-[1.2rem] font-sans text-white '>{seats?.join(", ")}</p>
         
          </div>
          
      </div>
    }
    {
      showTime===null && contentLoading && <PaymentS/>
    }
    <div  className='flex flex-col gap-3 w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] h-[35h] '>
     <h1 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] text-yellow-500 font-serif font-bold'>Payment Summary</h1>
     <div className='flex flex-col gap-2 border-2 px-2 py-3 bg-gray-100 h-[15vh] rounded-md '>
     <div className='flex flex-row justify-between text-[0.9rem] sm:text-[1rem] font-sans  '>
       <p >Regular Seats ({getPrice("Regular").count})</p>
       <p >₹{getPrice("Regular").price}</p>
     </div>
     <div className='flex flex-row justify-between text-[0.9rem] sm:text-[1rem] font-sans '>
       <p >Premium Seats ({getPrice("Premium").count})</p>
       <p >₹{getPrice("Premium").price}</p>
     </div>
      <div className='flex flex-row justify-between text-[0.9rem] sm:text-[1rem] font-sans  '>
       <p >Vip Seats ({getPrice("Vip").count})</p>
       <p >₹{getPrice("Vip").price}</p>
     </div>
     </div>
     <div className='flex flex-row w-full justify-between items-center px-2 py-3 bg-gray-800 rounded-md'>
       <h1 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-mono font-bold text-green-500'>Total</h1>
       <motion.button whileTap={{scale:0.8}} transition={{duration:0.15,ease:"easeIn"}} onClick={()=>{onPayment()}} className={`w-[25vw] sm:w-[20vw] md:w-[15vw] lg:w-[10vw] h-[5vh] text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-mono ${loading? "bg-blue-200":"bg-blue-500"} rounded-md text-white cursor-pointer flex justify-center items-center`}>{!loading? `Pay ₹${getPrice("Regular").price+getPrice("Premium").price+getPrice("Vip").price}` : <Spinner/>}</motion.button>
     </div>
    </div>
      </motion.div>
      
    </div>

  )
}
export default function Page() {
  return (
    <Suspense fallback={<PaymentS />}>
      <PaymentContent />
    </Suspense>
  );
}