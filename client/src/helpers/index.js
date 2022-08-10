export const getMonth = (num) => {
    const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
 
    return months[num - 1];
 };

 export const getChatTime = (date,time) => {

    const now = new Date();

    const todayDate = now.getDate();
    const todayYear = now.getFullYear();

    const isSameDay = todayDate === Number(date[8] + date[9]) ? true : false;
    const isSameYear = todayYear === Number(date.slice(0,4)) ? true : false;

    switch(isSameDay,isSameYear){
        case isSameDay :
             return time.slice(0,5)
        break;
        case isSameYear :
            return date.slice(5,10)
        break;
        default :
             return date
    }
 }