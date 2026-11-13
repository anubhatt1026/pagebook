//loads express library for the website and mysql2 library so nodejs can connect to db

const express= require("express");
const mysql=require("mysql2");

const app= express();                                                   //app to use the functions of express
const db=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "page_Book12@",
    database: "pagebook",
    port: "3307"
});

app.use(express.json());
app.use(express.static(__dirname));     //helps browser to open files in folder
//fetches data
app.get("/api/books", (req,res)=>{
    db.query("select * from books", (err,results)=>{        //tells mysql to send all data
        if (err){                                           //if error, show to browser
            res.status(500).send("Book Not Found");
            return;
        }
        res.json(results);                                  //if no error, send all rows data to browser in json format
    })
})

//.post posts data from db
app.post("/api/books", (req,res)=>{                         //only this app.post makes a route to add books
    const {
        title,
        author,
        genre,
        desc,
        img,
        link
    } = req.body;
    const sql= `insert into books(title, author, genre, book_description, cover_img , links) values (?,?,?,?,?,?)`    //? means any value
    const values= [title,author,genre,desc,img,link];
    db.query(sql,values,(err,results)=>{
        if (err){
            res.status(500).json({message:"Book cannot be added"});                                                 //500-599 server-side error and 400-499 client-side error
            return;
        }
        res.status(201).json({message:"Booked added", bookId: results.insertId});                                                              //200-299 means correcct response 
    })
})
//put used to update
app.put("/api/books/:id", (req,res)=>{
    const bookId=req.params.id;
    const {
        title,
        author,
        genre,
        desc,
        img,
        link
    } = req.body;
    const sql=`update books set title = ?, author = ?, genre = ?, book_description = ?, cover_img = ?, links = ? where book_id = ?`;
    const values= [title,author,genre,desc,img,link, bookId];
    db.query(sql,values,(err)=>{
        if(err){
            res.status(500).json({message:"Update Failed"});
            return;
        }
        res.json({message:"Update Sucessful"});
    })
});

app.delete("/api/books/:id", (req,res)=>{
    const bookId=req.params.id;
    const sql1=`delete from saved_books where book_id = ?`;                             //deleting from users saved if the bok is deleted from server
    db.query(sql1,[bookId],(err1)=>{
        if(err1){
            res.status(500).json({message:"Delete Failed"});
            return;
        }
        const sql2=`delete from books where book_id= ?`;
        db.query(sql2,[bookId],(err2,results)=>{
            if(err2){
                res.status(500).json({message:"Delete Failed"});
                return;
            }
            if (results.affectedRows===0){
                res.status(400).json({message:"Book not Available"});
                return;
            }
            res.status(200).json({message:"Book deleted successfully"});
        })
    })
});

app.post("/api/signup",(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    if(!name || !email || !password){
        return res.status(400).json({success: false, message:"Please fill the required fields"});
    }
    const sql="insert into users (user_name, email, pass_word) values (?,?,?)";
    db.query(sql,[name,email,password],(err,results)=>{
        if(err){
            if(err.code==="ER_DUP_ENTRY"){
                alert("Email already in use");
            }
            return res.status(500).json({succes:false, message:"Could not create account"});
        }
        return res.status(200).json({success:true, message:"Account created successfully"});
    })
})

app.post("/api/signin",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    if(!email || !password){
        return res.status(400).json({success: false, message:"Please fill the required fields"});
    }
    const sql="select user_id, user_name, email, pass_word from users where email=?";
    db.query(sql,[email],(err,results)=>{
        if(err){
            return res.status(500).json({success:false, message:"Could not Sign In"});
        }
        if(results.length===0 || results[0].pass_word != password){
            return res.status(400).json({message:"Incorrect Email ID or Password"});
        }
        res.status(200).json({success:true, message:"Sign In successful",user: {user_id: results[0].user_id, user_name: results[0].user_name, email: results[0].email}});
    })
})


db.connect((err)=>{
    if (err){
        console.log("Database failed to Connect", err.message);
    }
    console.log("Database connected successfully");
    app.listen(3000,()=>{
        console.log("Server Running at http://localhost:3000");
    })
})

app.get("/api/saved/:user_id",(req,res)=>{
    const userId=req.params.user_id;
    const sql=`select books.* from saved_books join books on saved_books.book_id = books.book_id where saved_books.user_id=?`;

    db.query(sql,[userId],(err,results)=>{
        if(err){
            return res.status(500).json({success:false, message:"Could not fetch Book"});
        }
        res.json(results);
    })
})


app.post("/api/saved_books", (req,res)=>{
    const {user_id, book_id}=req.body;
    if(!book_id){
            return res.status(400).json({success:false, message:"Book Not Found"});
        }
        const sql="insert into saved_books (user_id,book_id) values (?,?)";
        db.query(sql,[user_id,book_id],(err)=>{
            if(err){
                console.log("Save book database error:", err);  //error check
                if(err.code==="ER_DUP_ENTRY"){
                return res.status(409).json({message:"Already Saved"});                                                       //409 error for duplicate entries
                }
                return res.status(500).json({message:"Could not save book"});
            }
            return res.status(201).json({message:"Book is Saved"});
        })
})

app.delete("/api/saved/:user_id/:book_id", (req,res)=>{
    const {user_id,book_id}=req.params;
    const sql=`delete from saved_books where user_id=? and book_id=?`;

    db.query(sql,[user_id,book_id],(err,results)=>{
        if(err){
            return res.status(500).json({message:"Delete Failed"});
        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"Saved Book not found"});
        }
        return res.status(201).json({message:"Book deleted successfully"});
    })
});


