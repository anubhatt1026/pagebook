const logOut=document.getElementById("log-out");
if(logOut){
    logOut.addEventListener("click", ()=>{
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        window.location.href="login.html";
    })
}