import React ,{ useState } from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'  
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import DashBoard from './pages/DashBoard'
import Profile from './pages/Profile'
import Comments from './pages/Comments'
import YourBlog from './pages/YourBlog'
import CreateBlog from './pages/CreateBlog'
import UpdateBlog from './pages/UpdateBlog'
import BlogView from './pages/BlogView'
import SearchList from './pages/SearchList'
import Footer from './components/Footer'
const router= createBrowserRouter([
  {
    path: '/',
    element:<><Navbar/><Home /></>,

  },{
    path: '/blogs',
    element: <><Navbar/><Blogs/></>,
  },{
    path:"/about",
    element: <><Navbar/><About/></>,

  },{
    path: '/login',
    element:<><Navbar/><Login/></>,
  },{
    path:"/signup",
    element: <><Navbar/><Signup/></>,
  },{
    path: "/search",
    element: <><Navbar/><SearchList/><Footer/></>
  },
  {
    path:"/blogs/:blogId",
    element: <><Navbar/><BlogView/></>,
  },
  {
    path: '/dashboard',
    element:<><DashBoard/></>,
    children:[
      {
      path: 'profile',
      element:<><Navbar /><Profile/></>
    },
      {
      path: 'your-blog',
      element:<><Navbar /><YourBlog/></>
    },
      {
      path: 'comments',
      element:<><Navbar /><Comments/></>
    },
      {
      path: 'write-blog',
      element:<><Navbar /><CreateBlog/></>
    },{
      path: 'write-blog/:blogId',
      element:<UpdateBlog/>
    },
  ]

  }
])

const App =() => {
 

  return (
  <>
<RouterProvider router={router} />
  </>
  )
}

export default App
