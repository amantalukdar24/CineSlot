const month:string[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
const day:string[]=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const datetoString=(date:Date):string=>{
     const dateArray:string[]=new Date(date).toISOString().split("T")[0].split("-");
     const index:number=Number(dateArray[1]);
     const dateString:string=`${month[index-1]}'${dateArray[2]} ${dateArray[0]}`;
     return dateString;
}
const convertTimeto12=(timeStr:string ):string=>{
     const timeArray:string[]=timeStr.split(":");
     
     if(Number(timeArray[0])>=12) {
          if(Number(timeArray[0])===12) return `${Number(timeArray[0])}:${timeArray[1]} pm`
          return `${Number(timeArray[0])-12}:${timeArray[1]} pm`
     }
     else if(Number(timeArray[0])===0){
        return `12:${timeArray[1]} am`;
     }
     else{
           return `${timeArray[0]}:${timeArray[1]} am`;
     }
}
const getDay=(date:Date):string=>{
  return day[new Date(date).getDay()];
}
const getDate=(date:Date):string=>{
     const datee:Date=new Date(date);
     return `${datee.getDate()}`;
}
const getMonthYear=(date:Date):string=>{
     const datee:Date=new Date(date);
  return `${month[datee.getMonth()]}, ${datee.getFullYear()}`;
}

const get12hrTime=(date:Date):string=>{
      const hr:number=new Date(date).getHours() >12 ? new Date(date).getHours()-12 : new Date(date).getHours();
      const min:string=new Date(date).getMinutes() <10 ? `0${new Date(date).getMinutes()}` : `${new Date(date).getMinutes()}` ;
      const meridiem:string=new Date(date).getHours()>=12 ? "pm" : "am";
      const time:string=hr===0 ? `12:${min} ${meridiem}` : `${hr}:${min} ${meridiem}`;
      return time;
      
}
const minutesToHoursAndMinutes= (minutes:string):string =>
{ 
     const hours = Math.floor(Number(minutes) / 60); 
     const remainingMinutes = Number(minutes) % 60;
      return `${hours}h ${remainingMinutes}m`; 
}
export  {datetoString,convertTimeto12,getDay,getDate,getMonthYear,get12hrTime,minutesToHoursAndMinutes};