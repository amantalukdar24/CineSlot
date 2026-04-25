const month:string[]=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const datetoString=(date:Date):string=>{
     const dateArray:string[]=new Date(date).toISOString().split("T")[0].split("-");
     const index:number=Number(dateArray[1]);
     const dateString:string=`${month[index-1]}'${dateArray[2]} ${dateArray[0]}`;
     return dateString;
}
const convertTimeto12=(timeStr:string):string=>{
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
const sortTimes=(times:string[]):string[]=>{
     return times.sort((a, b) => {
     const toMinutes = (time:string):number =>
 { 
     const [hours, minutesPart] = time.split(":"); 
     const [minutes, meridian] = minutesPart.split(" "); 
     let parseHours:number = parseInt(hours, 10); 
    let parseMinutes:number = parseInt(minutes, 10); 
     if (meridian.toLowerCase() === "pm" && parseHours !== 12) 
     { 
          parseHours += 12; 
     }
      if (meridian.toLowerCase() === "am" && parseHours === 12)
     { 
          parseHours = 0; 
     } 
     return parseHours * 60 + parseMinutes; 
}; 
return toMinutes(a) - toMinutes(b);
 });
}
const minutesToHoursAndMinutes= (minutes:string):string =>
{ 
     const hours = Math.floor(Number(minutes) / 60); 
     const remainingMinutes = Number(minutes) % 60;
      return `${hours}h ${remainingMinutes}m`; 
}
export  {datetoString,convertTimeto12,sortTimes,minutesToHoursAndMinutes};