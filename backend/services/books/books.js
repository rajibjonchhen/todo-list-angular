import express from "express"
import createError from "http-errors"
import { JWTAuthMW } from "../authentication/jwtAuthMW.js"
import BookModel from "./book-schema.js"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

const booksRouter = express.Router()

const cloudinaryCoverUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "codex",
    },
  }),
}).array("covers");


// ********************** get all my books **********************
booksRouter.get("/",JWTAuthMW, async(req, res, next) => {
  try {
    const userId = req.user
      const books = await BookModel.find({userId})
      res.send({books})
  } catch (error) {
    next(createError(error))
  }
})

// ********************** get my book with id **********************
booksRouter.get("/:bookId", async(req, res, next) => {
  try {
    const bookId = req.params.bookId
      const book = await BookModel.findById(bookId)
      if(book){
        res.send({book})
      }else{
        next(createError(404, {message:`book with ${bookId} not found`}))
      }
  } catch (error) {
    next(createError(error))
  }
})

// ********************** post a new book **********************

booksRouter.post("/",JWTAuthMW, async(req, res, next) => {
  try {
    const authors = []
    const authorsName = req.body.authors.name.split(',')
    authorsName.forEach(element => {
      authors.push({name:element})
    });
    const category = []
    const categories = req.body.category.split(',')
    categories.forEach(element => {
      category.push(element)
    })
      const newBook = new BookModel({...req.body, category, authors, userId:req.user._id})
      const savedBook  = await newBook.save()
      if(savedBook){
        res.send({book:savedBook})
      }else{
        next(createError(401, {message:`book with cannot be added missing field`}))
      }
  } catch (error) {
    console.log(error)
    next(createError(error))
  }
})

// ********************** post a img to a book **********************

booksRouter.post("/:bookId", JWTAuthMW, cloudinaryCoverUploader, async(req, res, next) => {
  const bookId = req.params.bookId
  const reqBook = await  BookModel.findById(bookId)
  if(req.user._id.toString() === reqBook.userId.toString()){
     const images = await req.files.map(file => {
       console.log(file.path)
       return file.path
     })
     console.log("going to update with image",bookId, images)
     const updatedBook = await  BookModel.findByIdAndUpdate(bookId, {covers:[...reqBook.covers,...images]}, {new: true})
     console.log("updated", updatedBook)
    res.status(201).send({book:updatedBook})
  }else{
    next(createError(401, {message:`Your are not authorised to upload cover to this book`}))
  }
} )


// ********************** edit a book **********************

booksRouter.put("/:bookId", async(req, res, next) => {
  try {
    const bookId = req.params.bookId
      const book = await BookModel.findByIdAndUpdate(bookId, req.body, {new:true})
      if(book){
        res.send({book})
      }else{
        next(createError(404, {message:`book with ${bookId} not found`}))
      }
  } catch (error) {
    next(createError(error))
  }
})

booksRouter.delete("/:bookId",JWTAuthMW, async(req, res, next) => {
  try {
    const bookId = req.params.bookId
    const book = await BookModel.findByIdAndDelete(bookId)

    if(book){
        res.send({message : `book with id ${book._id} deleted`})
      }else{
        next(createError(404, {message:`book with ${bookId} not found`}))
      }
  } catch (error) {
    console.log(error)
    next(createError(error))
  }
})


export default booksRouter
