import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { setBlog } from '@/Redux/blogSlice'
import React from 'react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { setLoading } from '@/Redux/authSlice'
import { Loader2 } from 'lucide-react'

function CreateBlog() {
  const [title,setTitle] =useState("")
  const [category,setCategory] = useState("")
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const {blog,loading} = useSelector(store => store.blog)
  const getSelectedCategory= (value) => {
    setCategory(value)
  }
const createBlogHandler = async () => {
  try {
    dispatch(setLoading(true));

    const res = await axios.post(
      `http://localhost:3000/api/v1/blog/`,
      { title, category },
      {
        headers: {
          "Content-Type": "application/json"   // ✅ fixed
        },
        withCredentials: true
      }
    );

    if (res.data.success) {
      // If blog state is empty, initialize it with the new blog
      if (!blog || blog.length === 0) {
        dispatch(setBlog([res.data.blog]));
      } else {
        dispatch(setBlog([...blog, res.data.blog]));   // ✅ fixed
      }

      navigate(`/dashboard/write-blog/${res.data.blog._id}`);
      toast.success(res.data.message);
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to create blog");
  } finally {
    dispatch(setLoading(false));
  }
};


  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className="md:p-10 p-4 dark:bg-gray-800 ">
        <h1 className='text-2xl font-bold'>Let's create blog</h1>
        <p></p>
        <div className='mt-5'>
          <div>
            <Label>Title</Label>
            <input type='text' placeholder='Your Blog name' value={title} onChange={(e)=>setTitle(e.target.value)} className='bg-white dark:bg-gray-700 mt-1' />
          </div>
          <div className='mt-4 mb-5'>
            <Label className="mb-1">Category</Label>
            <Select onValueChange={getSelectedCategory}>
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
          <div className='flex gap-2'>
            <Button disabled={loading} onClick={createBlogHandler}>
  {loading ? (
    <>
      <Loader2 className='mr-1 h-4 w-4 animate-spin' /> Please wait
    </>
  ) : (
    "Create"
  )}
</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog
