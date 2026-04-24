const month:string[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

const datetoString=(date:Date):string=>{
    
 const dateArray:string[]|undefined=new Date(date)?.toISOString()?.split("T")[0]?.split("-");
 if(dateArray===undefined) return "";
const index:number=Number(dateArray[1]);
     const dateString:string=`${month[index-1]}'${dateArray[2]} ${dateArray[0]}`;
     return dateString;
}
export {datetoString};