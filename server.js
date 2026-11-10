//loads express library for the website and mysql2 library so nodejs can connect to db

const express= require("express");
const mysql=require("mysql2");

const app= express();
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
    const sql= `insert into books(title, author, genre, book_description, cover_img , links) values(?,?,?,?,?,?)`    //? means any value
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
    const sql1=`delete from saved_books where book_id = ?`;
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


db.connect((err)=>{
    if (err){
        console.log("Database failed to Connect", err.message);
    }
    console.log("Database connected unfortunately");
    app.listen(3000,()=>{
        console.log("Server Running at http://localhost:3000");
    })
})




