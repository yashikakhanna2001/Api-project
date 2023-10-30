require("dotenv").config();
const express=require("express");
const mongoose= require("mongoose");
var bodyParser=require("body-parser");
//database
const database=require("./database");
//Initialize
const booky=express();

booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());
mongoose.connect("mongodb+srv://yashika:<yash>@cluster0.e0dltm3.mongodb.net/booky?retryWrites=true&w=majority",
{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,


}
).then(() =>console.log("connection eastablished"));
/*
Route                    /
description              get all books
access                   public
parameter                none
method                   get*/


booky.get("/",(req,res)=>
{
return res.json({books: database.books});



});
/*
Route                    /Is
description              get specific book on isbn
access                   public
parameter                isbn
method                   get*/

booky.get("/is/:isbn" ,(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=>book.ISBN===req.params.isbn
    );
    if(getSpecificBook.length===0){
        return res.json({error:`No book found this isbn of ${req.params.isbn}`} );
    
    }
      return res.json({book:getSpecificBook});
    
    });
/*
Route                    /c
description              get specific book on category
access                   public
parameter                category
method                   get*/

booky.get("/c/:category",(req,res)=> 
{
    const getSpecificBook=database.books.filter(
        (book)=>book.category.includes(req.params.category) );
        if(getSpecificBook.length===0){
            return res.json({error: `no book found for the category ${req.params.category}`});
        }
    return res.json({book:getSpecificBook});

});
/*
Route                    /l
description              get specific book on language
access                   public
parameter                language
method                   get*/
booky.get("/l/:language",(req,res)=>
{
const getSpecificBook=database.books.filter((
    book)=>book.language===req.params.language);
    if (getSpecificBook.length===0){
        return res.json({error:`no book for the language ${req.params.language}`});
    }
return res.json({book:getSpecificBook});
});


/*
Route                    /authors
description              get all authors
access                   public
parameter                none
method                   get*/
booky.get("/author",(req,res)=>
{
    return res.json({authors:database.author});
});
/*
Route                    /authors/s.author
description              get all specific authors
access                   public
parameter                isbn
method                   get*/


booky.get("/author/s.author/:isbn" ,(req,res)=>{
    const getSpecificauthor=database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
    );
    if(getSpecificauthor.length===0){
        return res.json({error:`No book found this isbn of ${req.params.isbn}`} );
    
    }
      return res.json({author:getSpecificauthor});
    
    });
    /*
Route                    /authors/book
description              get all authors based on book
access                   public
parameter                isbn
method                   get*/

booky.get("/author/book/:isbn",(req,res)=>
{
    const getSpecificauthor=database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
    );
    if(getSpecificauthor.length===0){
        return res.json({error:`No book found this isbn of ${req.params.isbn}`} );
    
    }
    return res.json({author:getSpecificauthor});
    }
);
 /*
Route                    /publication
description              get all publication
access                   public
parameter                none
method                   get*/
booky.get("/publication",(req,res)=>
{
    return res.json({publication:database.publication});
});
/*
Route                    /publication/s.publication
description              get all specific publication 
access                   public
parameter                isbn
method                   get*/
booky.get("/publication/s.publication/:isbn",(req,res)=>
{
    const getSpecificPublication=database.publication.filter(
        (publication)=>publication.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length===0){
        return res.json({error:`No book found this isbn of ${req.params.isbn}`} );
    
    }
      return res.json({publication:getSpecificPublication});
    
});
/*
Route                    /publication/book
description              get all publication based on book
access                   public
parameter                isbn
method                   get*/

booky.get("/publication/book/:isbn",(req,res)=>
{
    const getPublicationBook=database.publication.filter(
        (publication)=>publication.books.includes(req.params.isbn)
    );
    if(getPublicationBook.length===0){
        return res.json({error:`No book found this isbn of ${req.params.isbn}`} );
    
    }
      return res.json({publication:getPublicationBook});
});
/*
Route                    /book/new
description              add new book
access                   public
parameter               none
method                   post*/
booky.post("/book/new",(req,res)=>
{
    const newBook=req.body;
    database.books.push(newBook);
    return res.json({updatedBooks:database.books});
});

/*
Route                    /author/new
description              add new authors
access                   public
parameter               none
method                   post*/
booky.post("/author/new",(req,res)=>
{
    const newAuthor=req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthors:database.author});
});

/*
Route                    /publication/new
description              add new publication
access                   public
parameter               none
method                   post*/

booky.post("/publication/new",(req,res)=>
{
    const newPublication=req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublication:database.publication});
});
/*
Route                    /publication/update/book/
description              update or add new publicaton
access                   public
parameter               isbn
method                   put*/

booky.put("/publication/update/book/:isbn",(req,res) =>
    {

        //update the publication database
        database.publication.forEach((pub) => {
            if (pub.id===req.body.pubId){
                return pub.books.push(req.params.isbn)
            }
            
        });
        //update the publication books database
        database.books.forEach((book)=>
        {
            if(book.ISBN===req.params.isbn);
            book.publications=req.body.pubId;
            return;
        });
        return res.json({
            books:database.books,
            publications:database.publication,
            message:"sucessfully updated publication"

        });
    });
   
    //Delete//
    /*
Route                    /book/delete/
description              delete the book
access                   public
parameter               isbn
method                   delete*/
booky.delete("/book/delete/:isbn",(req,res)=>
{
  //whichever book doesnot match with isbn,send to updatedBookDatabase array
  //rest will be filtered out

const updatedBookDatabase = database.books.filter(
(book)=> book.ISBN !==req.params.isbn
)
database.books=updatedBookDatabase;
return res.json({books:database.books});
});

  /*
Route                    /book/delete/author
description              delete an author from a book and vice versa
access                   public
parameter               isbn,authorId
method                   delete*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
//update the book database
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
const newAuthorList= book.author.filter(
   ( eachAuthor)=>eachAuthor !== parseInt(req.params.authorId)

);
book.author=newAuthorList;
return;

}
});

//update the author database
database.author.forEach((eachAuthor)=>{
    if (eachAuthor.id=== parseInt(req.params.authorId))
{
    const newBookList = eachAuthor.books.filter(
        (book)=> book!== req.params.isbn
    );
    eachAuthor.books=newBookList;
    return;
}}
)
return res.json({
    book:database.books,
    author:database.author,
    message:"author was deleted!!!"
});
});

booky.listen (3000,()=>

{console.log("Server is up and running on port 3000");
}
);
