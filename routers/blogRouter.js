const express = require("express");
const { createBlogController, getBlogController, getMyBlogController, editMyBlogController, deleteMyBlogController } = require("../controllers/blogController");
const isAuth = require("../middlewares/isAuthMiddleware");
const blogRouter = express.Router();

blogRouter.post("/create-blog", isAuth, createBlogController);
blogRouter.get("/get-blogs",isAuth, getBlogController);
blogRouter.get("/get-myBlogs", isAuth, getMyBlogController);
blogRouter.post("/edit-blog", isAuth, editMyBlogController);
blogRouter.post("/delete-blog", isAuth, deleteMyBlogController);

module.exports = blogRouter;