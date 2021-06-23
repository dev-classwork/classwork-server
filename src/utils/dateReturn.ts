export default function dateReturn(){
    var dateConsole = new Date();

    var day = ``;
    if(dateConsole.getDate() < 10){
        day = `0${dateConsole.getDate()}`;
    }else{
        day = `${dateConsole.getDate()}`;
    }

    var month = ``;
    if(dateConsole.getMonth() + 1 < 10){
        month = `0${dateConsole.getMonth() + 1}`;
    }else{
        month = `${dateConsole.getMonth() + 1}`;
    }

    var hours = ``;
    if(dateConsole.getHours() < 10){
        hours = `0${dateConsole.getHours()}`;
    }else{
        hours = `${dateConsole.getHours()}`;
    }

    var minutes = ``;
    if(dateConsole.getMinutes() < 10){
        minutes = `0${dateConsole.getMinutes()}`;
    }else{
        minutes = `${dateConsole.getMinutes()}`;
    }

    var seconds = ``;
    if(dateConsole.getSeconds() < 10){
        seconds = `0${dateConsole.getSeconds()}`;
    }else{
        seconds = `${dateConsole.getSeconds()}`;
    }

    var dateReturn = `${day}/${month}/${dateConsole.getFullYear()} [${hours}:${minutes}:${seconds}] - `;
    return dateReturn;
}