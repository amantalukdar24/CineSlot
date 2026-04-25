"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Footer() {
    const pathname=usePathname();
    const hidePathname=pathname==="/movie" || pathname==="/movie/ticket" || pathname==="/payment" || pathname==="/payment/success" || pathname==="/about-us" || pathname==="/contact-us" || pathname==="/bookings" || pathname==="/bookings/order" || pathname==="/terms" || pathname==="/account";
  return (
    <div className={`w-full bg-gray-800  md:h-[25vh] lg:h-[20vh] px-2 py-3 ${!hidePathname?"flex flex-row items-center justify-evenly":"hidden"}`}>
       <div className="flex flex-col gap-3 p-1 sm:px-2 sm:py-3 bg-gray-50 rounded-md">
        <div className='flex flex-row justify-center items-center text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.5rem]   '>
        <span className='font-[cursive] tracking-[0.1rem] text-blue-500'>Cine</span>
        <span className='font-[fantasy] tracking-[0.2rem] text-gray-500 '>Slot</span>
    </div>
    <h1 className="font-sans text-[0.7rem] sm:text-[1rem] md:text-[1.2rem]">@2026 All Rights Resereved</h1>
       </div>
       <div className="flex flex-col gap-2 text-white rounded-md p-1 sm:px-2 sm:py-3">
        <h1 className="text-[0.9rem] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] font-sans font-semibold ">Links</h1>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 list-none font-serif text-[0.5rem] sm:text-[0.9rem] md:text-[1rem] ">
          <Link href="/"><li className="hover:text-blue-500">Home</li></Link>
         <Link href="/about-us"> <li className="hover:text-blue-500">About Us</li></Link>
         <Link href="/contact-us"><li className="hover:text-blue-500">Contact Us</li></Link> 
         <Link href="/terms"> <li className="hover:text-blue-500">Terms & Conditions</li></Link>
        </div>
       </div>
       <div className="flex flex-col gap-2 p-1 sm:px-5 sm:py-3 rounded-md ">
         <h1 className="text-[0.9rem] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] font-sans font-semibold text-white">Connect Us</h1>
         <div className="flex flex-row justify-evenly items-center gap-2 sm:gap-5">
        <Link target="blank" href="https://www.linkedin.com/in/aman-talukdar-611391184/" ><img src="/Images/linkedin.png" alt="Failed to load" className="w-5 h-5 sm:w-7.5 sm:h-7.5 rounded-md"/></Link>  
         <Link target="blank" href="https://www.github.com/amantalukdar24"> <img src="/Images/github.png" alt="Failed to load" className="w-5 h-5 sm:w-7.5 sm:h-7.5 rounded-md"/></Link> 
         </div>
       </div>
    </div>
  )
}

export default Footer