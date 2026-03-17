import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React ,{useState}from 'react'
import { useRef } from 'react'
import JoditEditor from 'jodit-react';
import axios, { Axios } from 'axios'
import { setBlog } from '@/Redux/blogSlice'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/Redux/authSlice'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
function UpdateBlog() {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const editor = useRef(null)
  const navigate= useNavigate()
  const dispatch = useDispatch()
  const {blogId }= useParams()
  const {blog,loading}=useSelector(store=>store.blog)
  const selectBlog= blog.find(blog=>blog._id ===blogId)
  const [content,setContent]=useState("")
  const [publish,setPublish]=useState(false)
  const [blogData, setBlogData] = useState({
  title: "",
  subtitle: "",
  description: "",
  category: "",
  thumbnail: null
})
  useEffect(() => {
  if (selectBlog) {
    setContent(selectBlog.description || "")
    setPreviewThumbnail(selectBlog.thumbnail || null)
    setBlogData({
      title: selectBlog.title || "",
      subtitle: selectBlog.subtitle || "",
      description: selectBlog.description || "",
      category: selectBlog.category || "",
      thumbnail: selectBlog.thumbnail || null,
    })
  }
}, [selectBlog])


  const [previewThumbnail,setPreviewThumbnail]=useState(selectBlog?.thumbnail)

  const handleChange= (e)=>{
    const {name,value}=e.target
    setBlogData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const selectCategory =(value) =>{
    setBlogData({...blogData, category:value})
  } 
  const selectThumbnail =(e) => {
    const file = e.target.files?.[0];
    if(file){
      setBlogData({...blogData,thumbnail :file})
      const fileReader= new FileReader()
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
      fileReader.readAsDataURL(file)
    }
  }

  const updateBlogHandler= async () =>{
    console.log("UpdateBlog Hitting....")
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODlkYzQ0NmZhZGMxNTZlMDE1MjI0N2MiLCJpYXQiOjE3NTUyNjcyMzUsImV4cCI6MTc1NTM1MzYzNX0.q5jI5Mc1mZhiE1K42Om1rXBfnMUJ_nz8PMpq2fz8qwMconsole.log("Token being used:", token);

    const formData = new FormData()
    formData.append('title', blogData.title)
    formData.append('subtitle', blogData.subtitle)
    formData.append('description', content)
    formData.append('category', blogData.category)
    formData.append('file', blogData.thumbnail)
    try {
      dispatch(setLoading(true))
      const res= await axios.put(`http://localhost:3000/api/v1/blog/${blogId}`,formData,
        {
          headers:{
          'Content-Type': 'multipart/form-data',
          
        },withCredentials:true
        }
      )
      if(res.data.success){
        // toast.success(res.data.message)
        console.log(blogData);
        navigate("/")
        
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      console.log("Completed")
      dispatch(setLoading(false))
    }
  }
  const toggelPublishUnPublish=async(action)=>{
    try {
      const res= await axios.patch(`http://localhost:3000/api/v1/blog/${blogId}`,
        { action },  // or query param depending on backend
      { withCredentials: true }
      )
      if(res.data.success){
        setPublish(!publish)
        toast.success(res.data.message)
        navigate('/dashboard/your-blog')
      }else{
        toast.error("failed to update")
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const deleteBlog=async()=>{
    try {
      const res= await axios.delete(`http://localhost:3000/api/v1/blog/delete/${blogId}`,{withCredentials:true})
      if(res.data.success){
        const updatedBlogData=blog.filter((blogItem)=> blogItem?._id !==blogId)
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
        navigate('/dashboard/your-blog')
      }
    } catch (error) {
      toast.error
    }
  }


  return (
    <div className='md:ml-[320px] pt-20 px-3 pb-10'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2 space ">
          <h1 className='text-4xl font-bold'>Basic Blog Information</h1>
          <p>Make changes to your blogs here. Click publish when you are done </p>
          <div className='space-x-2'>
            <Button onClick={()=>toggelPublishUnPublish(selectBlog.isPublished ? "false":"true")}>
              {
                selectBlog?.isPublished ? "UnPublished" :"Publish"
              }
              </Button>
            <Button onClick={deleteBlog} variant="destructive">Remove blog</Button>
          </div>
          <div className=' '>
              <Label className="mb-1">Title</Label>
              <Input type="text" placeholder="Enter a title" name="title" value={blogData.title}
              onChange={handleChange} className="dark:border-gray-300" />
          </div>
          <div className=''>
              <Label className="mb-1">Subtitle</Label>
              <Input type="text" placeholder="Enter a subtitle" name="subtitle" 
              value={blogData.subtitle} onChange={handleChange} className="dark:border-gray-300" />
          </div>
          <div>
            <Label className="mb-1">Description</Label>
            <JoditEditor
            ref={editor}
            className='jodit_toolbar'
            value={blogData.description}
            onChange={newContent =>setContent(newContent)} />
          </div>
          <div>
            <Label>Category</Label>
                <Select onValueChange={selectCategory} className="dark:border-gray-300" >
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
          <SelectLabel>Category</SelectLabel>
    <SelectItem value="Web Dovelopment">Web Dovelopment</SelectItem>
    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
    <SelectItem value="Blogging">Blogging</SelectItem>
    <SelectItem value="Photography">Photography</SelectItem>
    <SelectItem value="Cooking">Cooking</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
          </div>
          <div>
            <Label className="mb-1">Thumbnail</Label>
          <Input
          type="file"
          onChange={selectThumbnail}
          id="file"
          accept="image/"
          className="w-fit dark:boder-gray-300"
          />
          { 
            previewThumbnail && <img src={previewThumbnail} alt="thumbnail" className="w-64 my-2" />
          }
          </div>
          <div className='flex gap-3'>
            <Button variant="outline" onClick={()=>navigate(-1)}>Delete</Button>
            <Button className="ml-2" onClick={updateBlogHandler}>
              {
                loading? <><Loader2 className='mr-2 w-4 h-4 animate-spin'/>Please wait</> :"Save"
              }
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default UpdateBlog
