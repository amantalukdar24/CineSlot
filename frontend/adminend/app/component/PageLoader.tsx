import Spinner from "./Spinner";
import { Poppins } from "next/font/google";
const poppins=Poppins({
   subsets:["latin"],weight:"500"
});
function PageLoader(){
    return(
        <div className=" w-full h-screen flex flex-col gap-5 justify-center items-center  ">
          <Spinner/>
          <p className={`${poppins.className} text-[1.3rem] animate-pulse`}>Please Wait...</p>
        </div>
    )
}
export default PageLoader;