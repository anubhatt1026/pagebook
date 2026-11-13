const savedId=document.getElementById("saved-book-list");
const userId=localStorage.getItem("user_id");

if(!userId){
    savedId.textContent="Please Sign In";
}
else{
    loadSaved();
}

//async await 
async function loadSaved(){
    try {
        const response=await fetch(`/api/saved/${userId}`);
        const books=await response.json();
        if(!response.ok){
            savedId.textContent="Could not load books";
            return;
        }
        savedId.textContent="";
        if(books.length===0){
            savedId.textContent="Book not found";
            return;
        }
        books.forEach((book)=>{
    
                const card=document.createElement("div");
                card.className = "display";
    
                const title=document.createElement("h3");
                title.textContent=book.title;
    
                const author=document.createElement("p");
                author.textContent=book.author;
    
                const remove=document.createElement("button");
                remove.textContent="Remove";
                remove.type="button";
    
         remove.addEventListener("click", async()=>{
                    const delete_saved=await fetch(`/api/saved/${userId}/${book.book_id}`,{
                        method: "DELETE"
                    });
                    const result=await delete_saved.json();
                    if(!delete_saved.ok){
                        alert(result.message || "Failed to Remove" );
                    }
                    card.remove();
                })
            card.append(title,author,remove);
            savedId.appendChild(card);
        })
    } catch (error) {
        console.error("Failed to load Saves", error);
        savedId.textContent="Failed to Load";
    }
}