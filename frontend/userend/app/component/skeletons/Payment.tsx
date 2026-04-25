function PaymentS(){
    return(
         <div  className='flex flex-col gap-3 px-2 py-3  items-center  border-2 rounded-md w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] h-[32vh] sm:h-[35vh] bg-gray-800'>
       <div className='flex flex-row items-center w-full justify-between px-3 py-2 bg-gray-700 rounded-md'>
        <div className='w-[30%] h-[4vh] bg-neutral-500 animate-pulse rounded-xl'></div>
        <div className='w-17.5 h-15 sm:w-25 sm:h-20 rounded-xl object-fill bg-neutral-500 animate-pulse'></div>
       </div>
      <div className='w-full flex flex-row gap-5 items-center bg-gray-600 rounded-md px-2 py-3'>
         <div className='w-[30%] h-[3vh] bg-neutral-500 rounded-xl animate-pulse'></div>
         <div className='w-[30%] h-[3vh] bg-neutral-500 rounded-xl animate-pulse'></div>
        </div>
        <div className='flex flex-row items-center gap-2 px-2 py-3 w-full bg-gray-700 rounded-md'>
          <div className='w-[30%] h-[3vh] bg-neutral-500 rounded-xl animate-pulse'></div>
          <div className='w-[30%] h-[3vh] bg-neutral-500 rounded-xl animate-pulse'></div>
         
          </div>
          
      </div>
    )
}
export default PaymentS;