
export const WakeUp=async ():Promise<any>=>{
     const result=await fetch(`${process.env.NEXT_PUBLIC_PaymentService_URL}/`,{
        method:"GET",headers:{
            "Content-Type":"application/json"
        }
     });
     const data=await result.json();
     if(data.success){
        return true;
     }
     else return false;
}