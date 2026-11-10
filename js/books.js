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

            card.appendChild(title);
            card.appendChild(author);
            card.appendChild(genre);
            card.appendChild(desc);

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