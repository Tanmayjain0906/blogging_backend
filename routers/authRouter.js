const express = require("express");


//constants
const authRouter = express.Router();


// file imports
const {registerController, loginController, logoutController} = require("../controllers/authController");
const isAuth = require("../middlewares/isAuthMiddleware");



authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.get("/logout", isAuth, logoutController);

module.exports = authRouter;