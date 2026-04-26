import React,{useEffect, useState} from 'react'
import { useRouter,usePathname } from 'next/navigation';
import {motion} from "framer-motion";

interface NavBarMobileI{
    search:boolean,
  setSearch:React.Dispatch<React.SetStateAction<boolean>>
}
const container={
  hidden:{opacity:0},
  visible:{opacity:1,transition:{staggerChildren:0.2,ease:"linear"}}
}
const list={
  hidden:{opacity:0,y:30},
  visible:{opacity:1,y:0}
}
function NavbarMobile({search,setSearch}:NavBarMobileI) {
    const router=useRouter();
    const pathname=usePathname();
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);
}, []);
    const menu:{name:string,link:string,icon:string}[]=[{
        name:"Home",link:"/",icon:"/Images/home.png"
        },
    {name:"Search",link:"#",icon:"/Images/search.png"},
    {name:"Order",link:token!==null ? "/bookings" : "/signin",icon:"/Images/ticketicon.png"},
    {name:"Account",link:token===null?"/signin" : "/account",icon:"/Images/account.png"}
    ];
    const handleAction=(name:string,link:string):void=>{
        if(name==="Search"){
            setSearch(true);
            return;
        }
        if(name==='Home'){
          setSearch(false);
        }
      router.push(link);
    }

      const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      
      const scrollHeight = document.documentElement.scrollHeight;
      
      const clientHeight = document.documentElement.clientHeight;
     
      const scrollTop = document.documentElement.scrollTop;

      
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.1,ease:"linear"}} className={`w-[98%] px-2 py-3 mx-1  my-0.5 bg-white border-2 rounded-xl  sm:hidden bottom-0 fixed ${isBottom? "hidden":""}`}>
          <motion.div variants={container as any} initial="hidden" animate="visible"   className='flex flex-row justify-evenly items-center'>
               {
                 menu.map((item)=>(
                    <motion.div variants={list}  key={item.name} className=" flex flex-col gap-2 items-center" onClick={()=>{handleAction(item.name,item.link)}}>
                        <img src={item.icon} className='w-5 h-5 rounded-md'/>
                        <span className={`${item.link === pathname && !search ? "text-rose-500 font-medium" : item.name==="Search" && search ? "text-rose-500 font-medium" : " font-normal"  } font-serif text-[0.8rem] `}>{item.name}</span>
                    </motion.div> 
                 ))
               }
          </motion.div>
    </motion.div>
  )
}

export default NavbarMobile