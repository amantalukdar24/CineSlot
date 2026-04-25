"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function CheckAuth(){
    const router=useRouter();
    useEffect(()=>{
         if(!localStorage.getItem("token")) router.push("/signin");
    },[])
    return(
        <></>
    )
}