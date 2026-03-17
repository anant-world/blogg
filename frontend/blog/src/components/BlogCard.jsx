import React from 'react'

const BlogCard=({blog})=> {
    console.log(blog); 
    const date= new Date(blog.createdAt)
    const formattedDate= date.toLocaleDateString("en-GB")
  return (
    <div className='bg-white dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all'>
        <img src={blog.thumbnail} alt="" className='rounded-lg'/>
        <p className='text-sm mt-2'>
            By {blog.author.firstName}  | {blog.category}
        </p>
    </div>
  )
}

export default BlogCard
