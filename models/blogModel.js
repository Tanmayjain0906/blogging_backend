const { lIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");
const ObjectId = require("mongodb").ObjectId;


const createBlog = ({ title, textBody, userId }) => {

    return new Promise(async (resolve, reject) => {
        try {
            const blogObj = new blogSchema({
                title,
                textBody,
                creationDateTime: Date.now(),
                userId,
            })

            const blogDb = await blogObj.save();
            resolve(blogDb);

        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
}

const getBlogs = (SKIP) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blogs = await blogSchema.aggregate([
                {
                    $match: {isDeleted: {$eq: false}}
                },
                {
                    $sort: { creationDateTime: -1 },
                },
                {
                    $skip: SKIP,
                },
                {
                    $limit: lIMIT,
                }
            ]);
            resolve(blogs);
        } catch (error) {
            reject(error);
        }
    })
}

const getMyBlogs = ({ SKIP, userId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const myBlogs = blogSchema.aggregate([
                {
                    $match: { userId: userId, isDeleted: {$eq: false} },
                },
                {
                    $sort: { creationDateTime: -1 },
                },
                {
                    $skip: SKIP,
                },
                {
                    $limit: lIMIT,
                }
            ])

            resolve(myBlogs);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const getBlog = async (blogId) => {
    return new Promise(async (resolve, reject) => {
        if (!blogId) reject("Missing BlogId.");
        if (!ObjectId.isValid(blogId)) reject("Incorrect format of BlogId");
        try {
            const blog = await blogSchema.findOne({ _id: blogId });

            if (!blog) {
                reject("Blog Not Found");
            }
            resolve(blog);
        } catch (error) {
            reject(error);
        }
    })
}

const editBlog = ({blogId, title, textBody}) => {
    return new Promise(async (resolve, reject) => {
        if (!blogId) reject("Missing BlogId.");
        if (!ObjectId.isValid(blogId)) reject("Incorrect format of BlogId");
        try {
            const blog = await blogSchema.findOneAndUpdate({_id: blogId}, {title: title, textBody: textBody});

            resolve(blog);
        } catch (error) {
            reject(error);
        }
    })
}

const deleteBlog = (blogId) => {
    return new Promise(async(resolve,reject) => {
        if (!blogId) reject("Missing BlogId.");
        if (!ObjectId.isValid(blogId)) reject("Incorrect format of BlogId");

        try {
            // const blog = await blogSchema.findByIdAndDelete(blogId);
            const blog = await blogSchema.findOneAndUpdate({_id: blogId}, {isDeleted: true, deletionDateTime: Date.now()});

            resolve(blog);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { createBlog, getBlogs, getMyBlogs, getBlog, editBlog, deleteBlog };