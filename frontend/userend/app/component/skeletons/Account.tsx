function AccountS(){
    return(
        <div className="flex flex-col gap-2 px-2 py-3 w-full">
           {
            [1,2].map((number)=>(
                <div key={number} className="w-[70%] h-[2vh] rounded-xl bg-neutral-500 animate-pulse"></div>
            ))
           }
        </div>
    )
}
export default AccountS;