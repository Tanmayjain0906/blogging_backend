const express = require("express");
require("dotenv").config();
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//constant
const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
   uri: process.env.MONGO_URI,
   collection: "sessions",
})

//file import
const db = require("./db");
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");
const isAuth = require("./middlewares/isAuthMiddleware");
const followRouter = require("./routers/followRouter");
const cleanUpBin = require("./cron");

//middlewares
app.use(express.json());
app.use(session({
   secret: process.env.SECRET_KEY,
   store: store,
   saveUninitialized: false,
   resave: false,
}))

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/follow", isAuth, followRouter);


app.listen(PORT, () => {
   console.log(`Server start running on PORT:${PORT}`);
   cleanUpBin();
})
