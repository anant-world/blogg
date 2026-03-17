import React,{useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { FaRegHeart,FaHeart } from 'react-icons/fa'
import { Bookmark, Ghost, MessageSquare, Share, Share2 } from 'lucide-react'
import { setBlog } from '@/Redux/blogSlice'
import axios from 'axios'

function BlogView() {
    const params= useParams()
    const blogId = params.blogId
    const dispatch= useDispatch()
    const {blog} =useSelector(store=>store.blog)
    const { user } = useSelector(store => store.auth); 
    const selectedBlog= blog.find(blog=>blog._id===blogId)
    const [blogLike,setBlogLike]=useState(selectedBlog.likes.length)
   const [liked, setLiked] = useState(user && selectedBlog.likes.includes(user._id));

useEffect(() => {
  setBlogLike(selectedBlog.likes.length);
  setLiked(user && selectedBlog.likes.includes(user._id));
}, [selectedBlog, user]);
    console.log(selectedBlog);
    
    const changeTimeFormat= (isDate)=>{
        const date = new Date(isDate)
        const options= {day:"numeric" , month:"long", year:"numeric"}
        const formattedDate = date.toLocaleDateString("en-US", options)
        return formattedDate;

    }
    console.log(selectedBlog);

    const handleShare=(blogId)=>{
      console.log(blogId);
      const blogUrl=`${window.location.origin}/blogs/${blogId}`
      if(navigator.share){
        navigator.share({
          title:"check out this blog",
          text:"Read this blog",
          url:blogUrl,
        }).then(()=>console.log("shared successfully")).catch((err=> console.error("error sharing",err)))
      }
      else{
        navigator.clipboard.writeText(blogUrl).then(()=>console.log("copied to clipboard"))
      }
    }

    const likeOrDislikeHandler=async()=>{
      if(!user){
         toast.error("Please log in to like or dislike this post!");
    return;
      }
      try {
        const action= liked ? 'dislikes' :'like'
        const res= await axios.get(`http://localhost:3000/api/v1/blog/${selectedBlog._id}/${action}`,
          {withCredentials:true})
          if(res.data.success){
            const updatedLikes= liked ? blogLike -1 :blogLike +1
            

          }
          const updatedBlogData=blog.map(p=>p._id===selectedBlog._id ?{
            ...p,
            likes: liked ? p.likes.filter(id=> id !==user._id) : [...p.likes,user._id]
          }:p) 
          console.log("Res: ", res)
          dispatch(setBlog(updatedBlogData))
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
    }
  return (
    
    
    <div className='pt-25 mb-10 ml-20'>
        <div className='max-w-6xl ml-10 '></div>
      <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Blogs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
{/* Blog Header */}
<div className='my-8'>
    <h1 className='text-4xl font-bold tracking-tight mb-4'>{selectedBlog.title}</h1>
    <div className='flex item-center justify-between flex-wrap gap-4'>
        <Avatar>
            <AvatarImage src={selectedBlog.author.photoUrl} alt="author"></AvatarImage>
                <AvatarFallback>JD</AvatarFallback>
            
        </Avatar>
        <div>
            <p className='font-medium mr-227 mt-2'>{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>
            
            
        </div>
    </div>
    <div className='ml-200 text-sm text-muted-foreground '>Published on {changeTimeFormat(selectedBlog.createdAt)} 8min read

    </div>
    <div className='mb-8 rounded-lg overflow-hidden'>
      <img src={selectedBlog.thumbnail} alt="blog image" width={1000} height={500} className='w-full object-cover'/>
      <p className='text-sm text-muted-foreground mt-2 italic'>{selectedBlog.subtitle}</p>
    </div>
    <p dangerouslySetInnerHTML={{__html:selectedBlog.description}}/>
    <div className='mt-10'>
      <div className='flex flex-wrap gap-2 mb-8'>
        <Badge variant="secondary"className='dark:bg-gray-700'>College</Badge>
        <Badge variant="secondary" className='dark:bg-gray-700'>Mern</Badge>
        <Badge variant="secondary" className='dark:bg-gray-700'>CR</Badge>
        <Badge variant="secondary" className='dark:bg-gray-700'>React</Badge>
      </div>
      {/* engagement */}
      <div className='flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8'>
        <div className='flex items-center space-x-4'>
          <Button onClick={likeOrDislikeHandler} variant="ghost" className="flex items-center gap-1">
            {
              liked ? <FaHeart size={24} className='cursor-pointer text-red-600'/> : <FaRegHeart size={24} className='cursor-pointer hover:text-gray-600 text-white'/>
            }
            <span>2.4k</span></Button>
          <Button  variant={Ghost} >
            <MessageSquare className='h-4 w-4 '/>
            <span> 100 comment</span>
          </Button>
        </div>

      </div>
      <div className='flex items-center space-x-2'>
        <Button variant={Ghost}>
          <Bookmark className='w-4 h-4'></Bookmark>
        </Button>
        <Button onClick={()=>handleShare(selectedBlog._id)} variant={Ghost}>
 <Share2 className="w-4 h-4" />

        </Button>
      </div>
    </div>
</div>
    </div>
  )
}

export default BlogView
