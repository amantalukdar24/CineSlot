function HomeS(){
    return(
        <div className="w-full flex flex-row gap-4 shrink-0 flex-wrap h-full">
            {
                [1,2,3].map((ele:any)=>{
                    return(
                        <div key={ele} className='flex flex-col   items-center gap-2 w-[40vw] sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] pb-4  rounded-xl animate-pulse'>
                            <div className='w-full h-[15vh] object-fill rounded-tr-xl rounded-tl-xl animate-pulse bg-neutral-300'></div>
                            <div className='w-[30%] h-[2vh] bg-neutral-300 animate-pulse rounded-xl'></div>
                           <div className='flex flex-col gap-1 items-center w-full   '>
                               <div className='w-[50%] h-[2vh] bg-neutral-300 animate-pulse rounded-xl'></div>
                               <div className='w-[30%] h-[2vh] bg-neutral-300 animate-pulse rounded-xl'></div>
          </div>
                    <div className=' w-[30vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] xl:w-[10vw] h-[5vh] bg-neutral-300 animate-pulse  rounded-2xl '></div>
                        </div>
                    )
                })
            } 
        </div>
    )
}
export default HomeS