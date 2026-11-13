const signUp=document.getElementById("signup-form");
const signIn=document.getElementById("signin-form");

const messageUp=document.getElementById("signup-message");
const messageIn=document.getElementById("signin-message");

signUp.addEventListener("submit",(event)=>{
    event.preventDefault();
    const newUser={
        name: document.getElementById("name-up").value,
        email: document.getElementById("email-up").value,
        password: document.getElementById("pass-up").value, 
    }

    fetch("/api/signup",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(newUser)
    })
    .then((response)=>response.json())
    .then((data)=>{
        messageUp.textContent=data.message;
        if(data.success){
            signUp.reset();
        }
    })
    .catch((error)=>{
        console.error("Sign-Up Error",error);
        messageUp.textContent="Sign Up Failed";
    })
})

signIn.addEventListener("submit",(event)=>{
    event.preventDefault();
    const existingUser={
        email: document.getElementById("email-in").value,
        password: document.getElementById("pass-in").value, 
    }

    fetch("/api/signin",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(existingUser)
    })
    .then((response)=>response.json())
    .then((data)=>{
        messageIn.textContent=data.message;
        if(data.success){
            localStorage.setItem("user_id", data.user.user_id);
            localStorage.setItem("user_name",data.user.user_name);
            window.location.href="index.html";    
        }
    })
    .catch((error)=>{
        console.error("Sign-In Error",error);
        messageIn.textContent="Sign In Failed";
    })
})
