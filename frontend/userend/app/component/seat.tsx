"use client";
import {useState,useEffect, SetStateAction, use} from 'react';
import { useSearchParams } from 'next/navigation';
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
interface Seatprops{
currentClickedTime:string,
currentClickedDay:string,
selectSeats:{seatNo:string,seatType:string,fare:number}[],
setSelectSeats:React.Dispatch<SetStateAction<{seatNo:string,seatType:string,fare:number}[]>>
}
interface seatI{
  seatNo:string,
  booked:string
}
function Seat({currentClickedTime,currentClickedDay,selectSeats,setSelectSeats} : Seatprops) {
  const MovieService_Url:string=process.env.NEXT_PUBLIC_MovieService_URL as string;
  const searchParams=useSearchParams();
  const movieId:string | null=searchParams.get("id")
  const [regularSeats,setRegularSeats]=useState<seatI[]>(Array.from({length:20},(_,i)=>({seatNo:`A${i+1}`,booked:"No"})));
  const [premiumSeats,setPremiumSeats]=useState<seatI[]>(Array.from({length:30},(_,i)=>({seatNo:`B${i+1}`,booked:"No"})));
   const [vipSeats,setVipSeats]=useState<seatI[]>(Array.from({length:12},(_,i)=>({seatNo:`C${i+1}`,booked:"No"})));
 
 
    useEffect(()=>{
     
      setSelectSeats([]);
      setRegularSeats(Array.from({length:20},(_,i)=>({seatNo:`A${i+1}`,booked:"No"})));
      setPremiumSeats(Array.from({length:30},(_,i)=>({seatNo:`B${i+1}`,booked:"No"})));
      setVipSeats(Array.from({length:12},(_,i)=>({seatNo:`C${i+1}`,booked:"No"})));
       const getBookedSeats=async ():Promise<void>=>{
       if (!movieId || !currentClickedDay || !currentClickedTime) return;
        const result=await fetch(`${MovieService_Url}/seatbook/getbookedseats`,{
          method:"POST",
          headers:{
            "Content-Type":"application/x-www-form-urlencoded",
             },
          body:new URLSearchParams({forDate:currentClickedDay,time:currentClickedTime,movieId:movieId})
        });
        const data=await result.json();
       if(data.success){
          
          setRegularSeats((prevSeats)=>{
          return prevSeats.map((seatType)=>{
            let updatedSeat={...seatType};
            data.results.map((seat:any)=>{
               if(seat._id==="Regular"){
             const findEle=   seat.seatNo.find((ele:any)=>ele===seatType.seatNo);

              if(findEle!==undefined)  updatedSeat.booked="Yes";
      
                return;
              }
            });
          
              return updatedSeat;
          })
          });
            setPremiumSeats((prevSeats)=>{
          return prevSeats.map((seatType)=>{
            let updatedSeat={...seatType};
            data.results.map((seat:any)=>{
               if(seat._id==="Premium"){
             const findEle= seat.seatNo.find((ele:any)=>ele===seatType.seatNo);
             if(findEle!==undefined)  updatedSeat.booked="Yes";
              return;
              }
            });
          
              return updatedSeat;
          })
          });
            setVipSeats((prevSeats)=>{
          return prevSeats.map((seatType)=>{
            let updatedSeat={...seatType};
            data.results.map((seat:any)=>{
               if(seat._id==="VIP"){
             const findEle=   seat.seatNo.find((ele:any)=>ele===seatType.seatNo);
          if(findEle!==undefined)  updatedSeat.booked="Yes";
              return;
              }
            });
          return updatedSeat;
          })
          });
        }
     }
       getBookedSeats();
    },[currentClickedDay,currentClickedTime]);
    
 const handleSelectSeat=(seatNo:string,seatType:string,fare:number):void=>{
  
 const checkSeat=selectSeats.find((seat:any)=>seat.seatNo===seatNo);
 if(checkSeat!==undefined){
  setSelectSeats((prev:any):any=>{
    return prev.filter((ele:any)=>ele.seatNo!==seatNo);
  });
  return;
 }
  let findSeat;
    if(seatType==="Regular"){
       findSeat=regularSeats.find((seat)=>seat.seatNo===seatNo);
     }
     else if(seatType==="Premium"){
       findSeat=premiumSeats.find((seat)=>seat.seatNo===seatNo);
     }
     else if(seatType==="Vip"){
        findSeat=vipSeats.find((seat)=>seat.seatNo===seatNo);
     }
  if(findSeat?.booked==="Yes") return;
 if(selectSeats.length>=5) {
    toast.error("Maximum 5 seats can be selected");
    return;
  }
  
  setSelectSeats((prev):any=>[...prev,{seatNo:seatNo,seatType:seatType,fare:fare}]);
 }
 const checkSelectSeat=(seatNo:string):boolean=>{
   const checkSeat=selectSeats.find((seat:any)=>seat.seatNo===seatNo);
   if(checkSeat!==undefined) return true;
   else return false
 }

 useEffect(()=>{
      const getTempBookedSeats=async ():Promise<void>=>{
        if(movieId===null) return;
        const results=await fetch(`${MovieService_Url}/seatbook/gettempbookedseat`,{
          method:"POST",
          headers:{
            "Content-Type":"application/x-www-form-urlencoded"
          },
          body:new URLSearchParams({movieId,time:currentClickedTime,forDate:currentClickedDay})
        });
        const data=await results.json();
        if(data.success){
          
   if(data.regularSeats.length>0)  setRegularSeats((prev)=>{
            return prev.map((seat)=>{
              let updatedSeat={...seat};
              const findSeat=data.regularSeats.find((val:string)=> seat.seatNo===val);
              if(findSeat) updatedSeat.booked="Yes";
              return updatedSeat;
            });
          });
   if(data.premiumSeats.length>0)    setPremiumSeats((prev)=>{
            return prev.map((seat)=>{
              let updatedSeat={...seat};
              const findSeat=data.premiumSeats.find((val:string)=> seat.seatNo===val);
              if(findSeat) updatedSeat.booked="Yes";
              return updatedSeat;
            });
          });
   if(data.vipSeats.length>0)   setVipSeats((prev)=>{
            return prev.map((seat)=>{
              let updatedSeat={...seat};
              const findSeat=data.vipSeats.find((val:string)=> seat.seatNo===val);
              if(findSeat) updatedSeat.booked="Yes";
              return updatedSeat;
            });
          });
        }

      }
      getTempBookedSeats();
 },[currentClickedDay,currentClickedTime])
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,ease:"easeOut"}} className='flex flex-col items-center gap-5 px-3 py-3 w-full h-[80vh] z-index sm:h-[88vh] md:h-[90vh]    '>
      <div className='flex justify-center items-center w-full bg-lime-200 border-2 rounded-xl'>
        <h1 className='text-[1.5rem] font-mono font-medium '>Select Seats</h1>
      </div>
      <div className='flex flex-col gap-3 w-full sm:w-[70%] lg:w-[60%] '>
        <h3 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-sans font-medium text-center '>Regular (Rs. 100)</h3>
        <hr/>
        <div className='flex flex-row justify-center gap-3 sm:gap-10'>
          <div className='grid grid-cols-5 grid-rows-2 gap-1 sm:gap-2'>
            {
              regularSeats.map((reg,index)=>{
                if(index<5 || (index>=10 && index<15)){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] ${reg.booked==="Yes" ? "bg-gray-500 text-white cursor-not-allowed": checkSelectSeat(reg.seatNo)===true ? "bg-green-300" : "bg-red-200 cursor-pointer "} text-[0.8rem] sm:text-[1.1rem] border-2 `} onClick={()=>{handleSelectSeat(reg.seatNo,"Regular",100)}}>{reg.seatNo}</button>
                )}
              })
            }
          </div>
             <div className='grid grid-cols-5 gap-1 sm:gap-2'>
            {
              regularSeats.map((reg,index)=>{
                if((index>=5 && index<10) || index>=15){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] border-2 text-[0.8rem] sm:text-[1.1rem] ${reg.booked==="Yes" ? "bg-gray-500 text-white cursor-not-allowed" :checkSelectSeat(reg.seatNo)===true ? "bg-green-300": "bg-red-200 cursor-pointer"}`} onClick={()=>{handleSelectSeat(reg.seatNo,"Regular",100)}}>{reg.seatNo}</button>
                )}
              })
            }
          </div>
        </div>
        </div>
         <div className='flex flex-col gap-3 w-full sm:w-[70%] lg:w-[60%] '>
        <h3 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-sans font-medium text-center '>Premium (Rs. 200)</h3>
        <hr/>
        <div className='flex flex-row justify-center gap-3 sm:gap-10'>
          <div className='grid grid-cols-5 gap-1 sm:gap-2'>
            {
              premiumSeats.map((pre,index)=>{
                if(index<5 || (index>=10 && index<15) || (index>=20 && index<25)){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] ${pre.booked==="Yes"? "bg-gray-500 text-white cursor-not-allowed":checkSelectSeat(pre.seatNo)===true?"bg-green-300" : "bg-blue-200 cursor-pointer"} text-[0.8rem] sm:text-[1.1rem] border-2 `} onClick={()=>{handleSelectSeat(pre.seatNo,"Premium",200)}}>{pre.seatNo}</button>
                )}
              })
            }
          </div>
             <div className='grid grid-cols-5 grid-rows-2 gap-1 sm:gap-2'>
            {
              premiumSeats.map((pre,index)=>{
                if((index>=5 && index<10) || (index>=15 && index<20) || index>=25){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] border-2 text-[0.8rem] sm:text-[1.1rem]   ${pre.booked==="Yes"? "bg-gray-500 text-white cursor-not-allowed":checkSelectSeat(pre.seatNo)===true?"bg-green-300" : "bg-blue-200 cursor-pointer"}  `} onClick={()=>{handleSelectSeat(pre.seatNo,"Premium",200)}} >{pre.seatNo}</button>
                )}
              })
            }
          </div>
        </div>
        </div>
         <div className='flex flex-col gap-3 w-full sm:w-[70%] lg:w-[60%] '>
        <h3 className='text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-sans font-medium text-center '>VIP (Rs. 350)</h3>
        <hr/>
        <div className='flex flex-row justify-center gap-3 sm:gap-10'>
          <div className='grid grid-cols-3 gap-1 sm:gap-2'>
            {
              vipSeats.map((vipp,index)=>{
                if(index<3 || (index>=6 && index<9)){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] ${vipp.booked==="Yes"? "bg-gray-500 text-white cursor-not-allowed":checkSelectSeat(vipp.seatNo)===true ? "bg-green-300" : "bg-yellow-200 cursor-pointer"} text-[0.8rem] sm:text-[1.1rem] border-2 `} onClick={()=>{handleSelectSeat(vipp.seatNo,"Vip",350)}}>{vipp.seatNo}</button>
                )}
              })
            }
          </div>
             <div className='grid grid-cols-3  gap-1 sm:gap-2'>
            {
              vipSeats.map((vipp,index)=>{
                if((index>=3 && index<6) || index>=9){
                return(
                  <button key={index+1} className={`w-[8vw] sm:w-[6vw] md:w-[5vw] lg:w-[4vw] xl:w-[3vw] h-[4vh] sm:h-[5vh] ${vipp.booked==="Yes"? "bg-gray-500 text-white cursor-not-allowed":checkSelectSeat(vipp.seatNo)===true ? "bg-green-300" : "bg-yellow-200 cursor-pointer"} text-[0.8rem] sm:text-[1.1rem] border-2 `} onClick={()=>{handleSelectSeat(vipp.seatNo,"Vip",350)}}>{vipp.seatNo}</button>
                )}
              })
            }
          </div>
        </div>
        </div>
    </motion.div>
  )
}

export default Seat