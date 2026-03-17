import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
  try {
    console.log("🔥 Incoming Body:", req.body);
    const { title, subtitle, description, category } = req.body;
    const file = req.file; // expecting thumbnail file
    
    if (!title || !category) {
      return res.status(400).json({ message: "Blog title and category is required" });
    }

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content);
      thumbnail = uploadRes.secure_url;
    }

    const blog = await Blog.create({
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail, // ✅ added properly
    });

    res.status(201).json({
      success: true,
      blog,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to create blog",
      error: error.message,
    });
  }
};


export const updateBlog = async(req,res) =>{
    try {
        const blogId = req.params.blogId
        const{title,subtitle,description,category}=req.body;
        const file = req.file;

        let blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                message:"Blog not found"});

        }
        let thumbnail ;
        if(file){
            const fileUri=getDataUri(file)
            thumbnail=await cloudinary.uploader.upload(fileUri)
        }
        const updateData={title,subtitle,description,category,author:req.id,thumbnail:thumbnail?.secure_url}
        blog=await Blog.findByIdAndUpdate(blogId,updateData,{new:true})
        res.status(200).json({
            success:true,
            
            message:"Blog updated successfully",
            blog,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update blog"
        })
    }
}

export const getOwnBlogs= async(req,res) =>{
    try {
      const userId= req.id;
      if(!userId){
        return res.status(400).json({
            message:"User Id is required",
        })

      } 
      const blogs=await Blog.find({author:userId}) .populate({
        path:'author',
        select:'firstName lastName photoUrl',
         model: 'user' 

      })
      if(!blogs){
        return res.status(404).json({
            message:"no blogs found",
            blogs:[],
            success:false
        })
      }

      console.log("backed: ", blogs)
      res.status(200).json({
        blogs,
        success:true,
      })
    } catch (error) {
        console.log("error: ", error)
        return res.status(500).json({
            message:"Failed to get blogs",
            error:error.message
        })
    }
}

export const deleteBlog=async (req,res)=>{
    try {
      const blogId = req.params.id;
      const authorId=req.id
      const blog = await Blog.findById(blogId);
      if(!blog){
        return res.status(404).json({
            success:false,
            message:"Blog not found",
        })
      }
      if(blog.author.toString() !== authorId){
        return res.status(403).json({
            success:false,
            message:"You are not the author of this blog",
        })
      }
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({
        success:true,
        message:"Blog deleted successfully",
      })

    } catch (error) {
        return res.status(500).json({success:false,message:"error deleting Blog",error:error.message})
    }
}
export const getPublishedBlog=async (_,res)=>{
    try {
        const blogs= await Blog.find({published:true}).sort({createdAt:-1}).populate({path:"author",select:"firstName lastName photoUrl"})
        if(!blogs){
            return res.status(404).json({
                message:"blogs not found",
            })
        }
        res.status(200).json({
            success:true,
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to get published blogs",
        })
    }
}

export const togglePublishBlog=async(req,res)=>{
    try {
        const {blogId}=req.params;
        const {publish}=req.query;

        const blog= await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                
                message:"Blog not found",
            })
        }
        // publish status based on the query parameter
        blog.isPublished=!blog.isPublished
        await blog.save();
        const statusMessage= blog.isPublished?"Published" : "UnPublished"
        return res.status(200).json({
            success:true,
            message:`Blog ${statusMessage} successfully`,
        })
    } catch (error) {
          return res.status(500).json({
            message:"Failed to update status",
        })
    }
}

export const likeBlog = async (req,res)=>{
    try {
       const {blogId}=req.params;
       const likeId= req._id;
       const blog= await Blog.findById(blogId).populate({path:"likes"});
       if(!blog){
        return res.status(404).json({
            message:"Blog not found",
            success:false
        }

        )
    }
    await blog.updateOne({$addToSet:{likes:likeId} })
    await blog.save()
    return res.status(200).json({
        success:true,
        message:"Blog liked successfully",
        blog
    })
    } catch (error) {
        console.log(error)
    }
}

export const dislikeBlog= async(req,res)=>{
    try {
       const {blogId}=req.params;
       const likeId= req.id;
       const blog= await Blog.findById(blogId)
       if(!blog){
        return res.status(404).json({
            message:"Blog not found",
            success:false
        }

        )
    }
    // dislike Blog
    await blog.updateOne({$pull:{likes:likeId} })
    await blog.save()
    return res.status(200).json({
        success:true,
        message:"Blog disliked successfully",
        blog
    })
    } catch (error) {
        console.log(error)
    }
}

export const getTotalBlogLikes=async(req,res)=>{
    try {
        const userId= req._id;
        
        const myBlogs=await Blog.find({author:userId}).select("likes")
        const totalLikes=myBlogs.reduce((acc,blog)=>acc+(blog.likes?.length || 0),0)
        return res.status(200).json({
            success:true,
            totalBlogs:myBlogs.length.length,
            totalLikes
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: "false"
        })
    }
}