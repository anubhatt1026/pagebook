// const { response } = require("express");
// const { title } = require("node:process");

// const { error } = require("node:console");
// const { validateHeaderValue } = require("node:http");

const addBook= document.getElementById("add-book");
const formMessage=document.getElementById("form-message");
const manageBook=document.getElementById("manage-book");
const submitBook=document.getElementById("submit-book");
const cancel=document.getElementById("cancel");

let editBookId = null;
function loadBooks(){
    fetch("/api/books").then((response)=>response.json())
        .then((books)=>{
            manageBook.textContent="";
            if(books.length===0){
                manageBook.textContent="No Books yet";
                return;
            }
            books.forEach((book)=>{
                const card= document.createElement("div");
                card.className="manage-book";

                const title=document.createElement("h3");
                title.textContent=book.title;

                const author=document.createElement("p");
                author.textContent=book.author;

                const genre=document.createElement("p");
                genre.textContent=book.genre || "No Genre";

                const editButton= document.createElement("button");
                editButton.textContent="edit";

                editButton.addEventListener("click", ()=>{
                    startEditing(book);
                })
                const removeButton=document.createElement("button");
                removeButton.textContent="remove";

                removeButton.addEventListener("click", ()=>{
                    removeBook(book.book_id, book.title);
                })
            card.appendChild(title);
            card.appendChild(author);
            card.appendChild(genre);
            card.appendChild(editButton);
            card.appendChild(removeButton);
            manageBook.append(card);

            })
        })

        .catch((error)=>{
            console.error("Error Found", error);
            manageBook.textContent="Error";
        })
}

function startEditing(book){
    editBookId=book.book_id;
    document.getElementById("Title").value=book.title;
    document.getElementById("Author").value=book.author;
    document.getElementById("Genre").value=book.genre || "";
    document.getElementById("Description").value=book.book_description || "";
    document.getElementById("Cover-img").value=book.cover_img || "";
    document.getElementById("link").value=book.links || "";
    submitBook.textContent="Update Book";
    cancel.hidden=false;
    formMessage.textContent="Editing: " + book.title;
}

function removeBook(bookId,title){
    const confirmed=confirm(`Remove "${title}" from the catalog ? This will also be removed from User's saved list `);          //$ acts as replacement
    if(!confirmed)
        return;
    fetch(`/api/books/${bookId}`,{
        method: "DELETE"
    })
    .then((response)=>response.json())
    .then((data)=>{
        formMessage.textContent=data.message;
        loadBooks();
    })
    .catch((error)=>{
        console.error("Error", error);
        return;
    })

}


//runs only when user clicks add book
addBook.addEventListener("submit", (event)=>{
    event.preventDefault();
    const book={
        title:document.getElementById("Title").value,
        author:document.getElementById("Author").value,
        genre:document.getElementById("Genre").value,
        book_description:document.getElementById("Description").value,
        cover_img:document.getElementById("Cover-img").value,
        links:document.getElementById("link").value,
    }
    const isEditing=editBookId!==null;
    const url=isEditing? `/api/books/${editBookId}` : "/api/books";
    const method=isEditing? "PUT" : "POST";    
    fetch(url,{
        method: method, headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(book)                                                                     //uses put or post method depending upon call
    })
    .then((response)=>response.json().then((data)=>({response,data})))
    .then(({response,data})=>{
        formMessage.textContent=data.message;
        if(response.ok){
            addBook.reset();
            editBookId=null;
            submitBook.textContent="Add Book";
            cancel.hidden=true;
            loadBooks();

        }
    })
    .catch((error)=>{
        console.error("Error", error);
    })
});

cancel.addEventListener("click", ()=>{
    addBook.reset();
    editBookId=null;
    submitBook.textContent="Add Book";
    cancel.hidden=true;
    formMessage.textContent="";
})
loadBooks();

