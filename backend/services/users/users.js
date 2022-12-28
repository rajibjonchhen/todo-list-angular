import express from "express";
import createError from "http-errors";
import UserModel from "./user-schema.js";
import { JWTAuthMW } from "../authentication/jwtAuthMW.js";
import { sendConfirmationEmail } from "../authentication/nodemailer.js";
import { authenticateUser } from "../authentication/tools.js";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { getTempId, TempLinkVerification } from "../authentication/tempLinkTool.js";
import {fetchBookById, fetchBookWithAuthor } from "../helpers/helper.js";

const usersRouter = express.Router();

//**************** post user *********************/
usersRouter.post("/register", async (req, res, next) => {
  try {
    const reqUser = await UserModel.find({ email: req.body.email });
    if (reqUser.length > 0) {
      next(createError(401, "user already exists"));
    } else {
        const tempId = uuid()
      const newUser = new UserModel({...req.body, tempId});
      const user = await newUser.save();
      const jwtId  = await getTempId(tempId)
      if (user) {
        sendConfirmationEmail({ toUser: newUser, hash: await jwtId});
        res.send({
          message:
            "You have been registered successfully. Please check your email to confirm your account",userId:user._id
        });
      } else {
        next(
          createError(400, "bad request missing field could not create user")
        );
      }
    }
  } catch (error) {
    console.log("sfsd",error);
    next(createError(error));
  }
});

//********************** sign in users ************************/
usersRouter.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const reqUser = await UserModel.checkCredentials(email, password);

    if (reqUser) {
        const user = await UserModel.findById(reqUser._id);
        if (reqUser.userVerification === "verified") {
            const token = await authenticateUser(user);
            res.send({ user, token });
        } else {
            res.send({
            message:
                " Account has not been verified yet. Please check your email and confirm to continue",
            userId: reqUser._id,
            });
        }
    } else {
      next(
        createError(401, { error: "User not found invalid email or password" })
      );
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//**************** resend email verification ******************/
usersRouter.get("/resend/:userId", async (req, res, next) => {
  try {
    const tempId = uuid()
    const userId = req.params.userId;
    const user = await UserModel.findByIdAndUpdate(userId, {tempId}, {new:true});
    const jwtId  = await getTempId(tempId)
    if(user){
      if (user.userVerification !== "verified") {
        sendConfirmationEmail({ toUser: user, hash: await jwtId});
        res.send({ message: "Verification email has been resend." });
      } else {
        res.send({ message: "User already verified. Please login to enter" });
      }
    } else {
      next(createError(401, { error: "User not found" }));
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//********************** get my info ************************/
usersRouter.get("/me", JWTAuthMW, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      res.send({ user });
    } else {
      next(createError(401, { error: "User not found" }));
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//********************** get all users ************************/
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send({ users });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//******************* handle favourite books *********************/
usersRouter.put("/favouriteBooks", JWTAuthMW, async (req, res, next) => {
  try {
    const bookId = req.body.bookId;
    const reqUser = await UserModel.findById(req.user._id);
    const isLiked = reqUser.favouriteBooks.find(
      (bookId) => bookId === req.body.bookId
    );
    const update = isLiked
      ? {
          $pull: { favouriteBooks: bookId },
          $push: { previouslyLikedBooks: bookId },
        }
      : {
          $push: { favouriteBooks: bookId },
          $pull: { previouslyLikedBooks: bookId },
        };

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true }
    );

    res.send({ user: updatedUser });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//********************** edit a users ************************/
usersRouter.put("/:userId", JWTAuthMW, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.send({ user });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//************************* verify a users ***************************/
usersRouter.put("/confirmation/:jwtId", async (req, res, next) => {
  try {
    const jwtId = req.params.jwtId;
     const tempId = await TempLinkVerification(jwtId)

     const reqUser = await UserModel.find({tempId})
    const user = await UserModel.findByIdAndUpdate(
        reqUser,
      { userVerification: "verified" },
      { new: true }
    );
    const token = await authenticateUser(user);
    res.send({ user,token });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//********************** get all favourite books ************************/
usersRouter.get("/favouriteBooks", JWTAuthMW, async (req, res, next) => {
  try {

    const userId = req.body.user;
    const {favouriteBooks} = await (UserModel.findById(req.user._id))

    const books = await Promise.all(favouriteBooks.map(async id => await fetchBookById(id)))

    const booksWithAuthor = await Promise.all(books?.map(async book => await fetchBookWithAuthor(book)))

    res.send({ books: booksWithAuthor });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//********************** delete a user ************************/
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findByIdAndDelete(userId);
    res.send({ user, message: "user deleted" });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

export default usersRouter;
