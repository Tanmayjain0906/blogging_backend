const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");


const clenUpBin = () => {
    cron.schedule('* * 0 * * *', async() => {
        try {
            const deletedBlogs = await blogSchema.find({isDeleted: true});
            
            if(deletedBlogs.length !== 0)
            {
                let deletedBlogsIds = [];

                deletedBlogs.map((blog) => {
                    const diff = (Date.now() -blog.deletionDateTime)/(1000*60*60*24);
                    console.log(diff);
                    if(diff>30)
                    {
                        deletedBlogsIds.push(blog._id);
                    }
                })

                console.log(deletedBlogsIds);

                if(deletedBlogsIds.length !== 0)
                {
                    await blogSchema.findOneAndDelete({_id: {$in : deletedBlogsIds}});

                    console.log("Blog Deleted Successfully");
                }
            }
        } catch (error) {
            console.log(error);
        }
      });
}

module.exports = clenUpBin;