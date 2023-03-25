export const formatDate = (date)=> {
 var year = date.getFullYear();    //  返回的是年份
 var month = date.getMonth() + 1;  //  返回的月份上个月的月份，记得+1才是当月
 var dates = date.getDate();  
 if(month<10)month="0"+month;
 if(date<10)date="0"+date;
 var time=year + "-" + month + "-" + dates
 return time
}
