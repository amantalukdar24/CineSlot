function BookingsS(){
    return(
          <div className="flex flex-col">
            {[1,2,3,4,5].map((index)=>(
              <div key={index} className='flex flex-row items-center  w-full gap-5 border-2 px-2 py-3 rounded-md cursor-pointer hover:bg-gray-200 ' >
                 <div className='flex justify-center items-center'>
                  <div className='w-10 h-10 sm:w-12.5 sm:h-12.5 rounded-lg bg-neutral-500 animate-pulse'></div>
                 </div>
                <div className="flex flex-col gap-2 w-[50%]">
                  <div className='bg-neutral-500 animate-pulse rounded-xl w-[50%] h-[2vh] '></div>
                  <div className='bg-neutral-500 animate-pulse rounded-xl w-[50%] h-[2vh] '></div>
                  <div className='bg-neutral-500 animate-pulse rounded-xl w-[50%] h-[2vh] '></div>
                </div>
                <div className='flex justify-center items-center w-[40%] '>
                 <h1 className="w-[40%] h-[3vh] bg-neutral-500 animate-pulse rounded-xl"></h1>
                </div>
             
                
               </div>
              )) }
          </div>
    )
}
export default BookingsS;