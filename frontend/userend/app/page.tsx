"use client";
import {useState} from "react";
import HomePage from "./pages/Home";
import Navbar from "./component/Navbar";
import NavbarMobile from "./component/NavbarMobile";
export default function Home() {
 const [search,setSearch]=useState<boolean>(false);
  return (
   <div className="flex flex-col gap-2 h-screen " >
   <Navbar setSearch={setSearch}/>
   <NavbarMobile search={search} setSearch={setSearch}/>
   <HomePage search={search} setSearch={setSearch}/>
   </div>
  );
}
