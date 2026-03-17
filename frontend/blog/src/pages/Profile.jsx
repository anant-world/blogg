import React, { useState } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import userLogo from '../assets/user.jpg'
import { Link } from 'react-router-dom'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/Redux/store'
import { setLoading , setUser} from '@/Redux/authSlice'
import { toast } from 'sonner'
import axios from 'axios'

function Profile() {
  
  const {user}=useSelector(store=>store.auth)
  const dispatch= useDispatch()
  const [input,setInput]= useState({
    firstName:user?.firstName,
    lastName:user?.lastName,
    occupation:user?.occupation,
    bio:user?.bio,
    facebook:user?.facebook,
    linkedin:user?.linkedin,
    github:user?.github,
    instagram:user?.instagram,
    file:user?.file
  })

  const changeEventHandler=(e)=>{
    const {name,value}=e.target
    setInput((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const changeFileHandler=(e)=>{
    setInput({...input,file:e.target.files?.[0]})
  }

  const submitHandler= async (e)=>{
    e.preventDefault()
    console.log(input);
    const formData= new FormData()
    formData.append('firstName',input.firstName)
    formData.append('lastName',input.lastName)
    formData.append('occupation',input.occupation)
    formData.append('bio',input.bio)
    formData.append('facebook',input.facebook)
    formData.append('linkedin',input.linkedin)
    formData.append('github',input.github)
    formData.append('instagram',input.instagram)
    if(input?.file){
      formData.append('file',input.file)
    }
    try {
      dispatch(setLoading(true))
      const res= await axios.put(`http://localhost:3000/api/v1/user/profile/update`,formData,{
        headers:{
          'Content-Type':'multipart/form-data',
        },withCredentials:true
      })
      if(res.data.success){
        
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      dispatch(setLoading(false))
    }

  }

  return (
    <div className='pt-20 md:ml-[320px] md:h-screen '>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className='w-40 h-40 border-2'>
              <AvatarImage src={user.photoUrl || userLogo} />
            </Avatar>
            <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3'>
             {user.occupation || " Mern Stack Developer"}
            </h1>
            <div className='flex gap-4 items-center'>
              <Link><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
            </div>
          </div>

          {/* info section */}
          <div>
            <h1 className='font-bold text-center md:text-start text-4xl mb-7'>Welcome {user.firstName|| "User"}  </h1>
            <p><span className='font-semibold'>Email: </span>{user.email}</p>

            <div className='flex flex-col gap-2 items-start justify-start my-5'>
              <Label>About Me</Label>
              <p className='border dark:border-gray-600 p-6 rounded-lg'>
                {user.bio || "I am a full stack developer with a passion for creating innovative and user-friendly applications "}
                
              </p>
            </div>

            {/* Dialog for Edit Profile */}
            <Dialog >
              <form>
                <DialogTrigger asChild>
                  <Button >Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription className="text-center">
                      Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className='grid gap-4 py-4'>
                    {/* First and Last Name */}
                    <div className="flex gap-2">
                      <div>
                        <Label htmlFor="first-name" className="text-right mb-1">First Name</Label>
                        <Input id="first-name" name="firstName" placeholder="First Name" className="col-span-3 text-gray-500" value={input.firstName} onChange={changeEventHandler}/>
                      </div>
                      <div>
                        <Label htmlFor="last-name" className="text-right mb-1">Last Name</Label>
                        <Input id="last-name" name="lastName" placeholder="Last Name" className="col-span-3 text-gray-500" value={input.lastName} onChange={changeEventHandler}/>
                      </div>
                    </div>

                    {/* Facebook and Instagram */}
                    <div className="flex gap-2">
                      <div>
                        <Label htmlFor="facebook" className="text-right mb-1">Facebook</Label>
                        <Input id="facebook" name="facebook" placeholder="Enter a URL" className="col-span-3 text-gray-500" value={input.facebook} onChange={changeEventHandler}/>
                      </div>
                      <div>
                        <Label htmlFor="instagram" className="text-right mb-1">Instagram</Label>
                        <Input id="instagram" name="instagram" placeholder="Enter a URL" className="col-span-3 text-gray-500" value={input.instagram} onChange={changeEventHandler}/>
                      </div>
                    </div>

                    {/* LinkedIn and GitHub */}
                    <div className="flex gap-2">
                      <div>
                        <Label htmlFor="linkedin" className="text-right mb-1">LinkedIn</Label>
                        <Input id="linkedin" name="linkedin" placeholder="Enter a URL" className="col-span-3 text-gray-500" value={input.linkedin} onChange={changeEventHandler} />
                      </div>
                      <div>
                        <Label htmlFor="github" className="text-right mb-1">GitHub</Label>
                        <Input id="github" name="github" placeholder="Enter a URL" className="col-span-3 text-gray-500" value={input.github} onChange={changeEventHandler}/>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description" className="text-right mb-1">Description</Label>
                      <Textarea name="bio"  id="description" placeholder="Enter a description" className="col-span-3 text-gray-500" value={input.bio} onChange={changeEventHandler}/>
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                      <Label htmlFor="file" className="text-right mb-1">Picture</Label>
                      <input
                        type="file"
                        id="file"
                         name="file"
                        accept="image/*"
                        className="w-[277px]"
                        onChange={changeFileHandler}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={submitHandler} type="submit" >Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile

