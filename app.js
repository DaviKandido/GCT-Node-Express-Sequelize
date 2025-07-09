const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static("uploads"));

app.use((req, res, next)=>{
    console.log(`${new Date().toLocaleString()} | Requisição: ${req.method} ${req.url}`);
    next();
})

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const imageRouter = require("./routes/images");
const testRouter = require("./routes/test");

app.use("/associations", testRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);
app.use("/images", imageRouter);

module.exports = app


