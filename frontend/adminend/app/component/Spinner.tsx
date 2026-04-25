import React from 'react'

function Spinner() {
  return (
    <div  className="flex justify-center items-center w-8 h-8 border-[3px] border-blue-500 border-b-transparent border-solid  animate-spin   rounded-[50px]  ">
      <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent border-solid   rounded-[50px]  animate-spin "></div>
    </div>
  )
}

export default Spinner