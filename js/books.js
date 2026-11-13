//const { response } = require("express");
//const { error } = require("node:console");

const bookList=document.getElementById("book-list");
const searchForm=document.querySelector(".search-bar");
const search=document.getElementById("search");
let allBook= [];
function displayBook(books){
    bookList.textContent="";
    if(books.length===0){
        bookList.textContent="Result Not Found";
        return;
    }
    books.forEach((book)=>{
            const card=document.createElement("div");
            card.className = "display";

            const title=document.createElement("h3");
            title.textContent=book.title;

            const author=document.createElement("p");
            author.textContent=book.author;

            const genre=document.createElement("p");
            genre.textContent="Genre : " + (book.genre || "No Genre specified");

            const desc=document.createElement("p");
            desc.textContent= book.book_description || "No Description";
            
            if(book.cover_img){
                const cover=document.createElement("img");
                cover.src=book.cover_img;
                cover.alt=`cover of ${book.title}`;
                cover.width=120;
                card.appendChild(cover);
            }

            if(book.links){
                const linkBook=document.createElement("a");
                linkBook.href=book.links;
                linkBook.textContent="open";
                linkBook.target="_blank";
                linkBook.rel="noopener noreferrer";
                card.appendChild(linkBook);
            }


            const saved=document.createElement("button");
            saved.textContent = "Save";  
            saved.type="button";

            saved.addEventListener("click", async()=>{
                const userId=localStorage.getItem("user_id");

                if(!userId){
                    alert("Please Sign In");
                    window.location.href="login.html";
                    return;
                }
               try {
                 const response=await fetch("/api/saved_books",{
                     method: "POST", 
                     headers:{"Content-Type":"application/json"},
                     body: JSON.stringify({user_id:Number(userId),book_id:book.book_id})
                 })
                 const data=await response.json();
                 if(!response.ok){
                     alert(data.message);
                     return;
                 }
                 alert("Book saved successfully");
               } 
               catch (error) {
                    console.error("Save Error", error);
                    alert("Could not save book");
               }
            })

            
            card.appendChild(title);
            card.appendChild(author);
            card.appendChild(genre);
            card.appendChild(desc);
            card.appendChild(saved);
            bookList.append(card);

    })
}
fetch("/api/books")
    .then((response)=>response.json())              //the response in json format is getting converted to javascript format
    .then((books)=>{
        allBook=books;
        displayBook(allBook);
    })


    .catch((error)=>{
        console.error("Loading Error", error);
        bookList.textContent="Could not load books";
    })

function searchBook(){
    const searchText=search.value.toLowerCase();
    const match= allBook.filter((book)=>{
        const bookDetail= `${book.title} ${book.author} ${book.genre || "No Genre yet" }`.toLowerCase();
        return bookDetail.includes(searchText);
    });
    displayBook(match);
}

search.addEventListener("input", searchBook);
searchForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    searchBook();
})