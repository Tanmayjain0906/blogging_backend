const { createBlog, getBlogs, getMyBlogs, getBlog, editBlog, deleteBlog } = require("../models/blogModel");
const blogDataValidation = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  try {
    await blogDataValidation({ title, textBody });
  }
  catch (err) {
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: err,
    })
  }

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      data: error,
    })
  }
}

const getBlogController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogs = await getBlogs(SKIP);

    if (blogs.length === 0) {
      return res.send({
        status: 204,
        message: "No blog Found",
      })
    }

    return res.send({
      status: 200,
      message: "Read Success",
      data: blogs,
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
}

const getMyBlogController = async (req, res) => {
  const userId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0
  try {
    const myBlogs = await getMyBlogs({ SKIP, userId });

    if (myBlogs.length === 0) {
      return res.send({
        status: 204,
        message: "No blog Found",
      })
    }

    return res.send({
      status: 200,
      message: "Read Success",
      data: myBlogs,
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
}

const editMyBlogController = async (req, res) => {
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: error,
    })
  }

  try {
    const myBlog = await getBlog(blogId);

    if (!userId.equals(myBlog.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to edit someone blog",
      })
    }

    const blog = await editBlog({ blogId, title, textBody });

    return res.send({
      status: 200,
      message: "Edit successfull",
      data: blog,
    })

  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }

}

const deleteMyBlogController = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.session.user.userId;
  try {
    const blog = await getBlog(blogId);

    if (!userId.equals(blog.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to delete someone blog",
      })
    }

    const blogDb = await deleteBlog(blogId);

    return res.send({
      status: 200,
      message: "Blog delete Successfully",
      data: blogDb,
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = { createBlogController, getBlogController, getMyBlogController, editMyBlogController, deleteMyBlogController };