import React, { useState } from 'react'
import auth from '../assets/auth.jpg'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'sonner';
const  Signup=()=> {
  const [showPassword,setShowPassword]=useState(false)
  const navigate=useNavigate()
  const [user,setUser]= useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
  })
  const handleChange = (e)=>{
    const {name,value}=e.target
    setUser((prevUser)=>({...prevUser,[name]:value}))
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(user)


     try{
    const res= await axios.post(`http://localhost:3000/api/v1/user/register`,user,{
      headers:{
        'Content-Type':'application/json',
      },
      withCredentials:true
    })
    if(res.data.success){
      navigate('/login')
      toast.success('User created successfully')
    }
  }catch(error){
    console.log(error)
  }
 
   
  }

  return (
    <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hidden md:block'>
          <img src={auth} alt="" className='h-[700px]'/>
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className='w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600'>
            <CardHeader>
              <CardTitle>
                <h1 className='text-center text-xl font-semibold'>Create an account</h1>
              </CardTitle>
              <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to create your account</p>
            </CardHeader>
            <CardContent>
              <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='flex gap-3'>
                  <div>
                    <Label>First Name</Label>
                    <Input type="text" placeholder="First Name"
                    name="firstName" 
                    className="dark:border-gray-600 dark:bg-gray-900" 
                    value={user.firstName}
                    onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input type="text" placeholder="Last Name"
                    name="lastName" 
                    className="dark:border-gray-600 dark:bg-gray-900" 
                    value={user.lastName}
                    onChange={handleChange}/>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                  type="email"
                  placeholder="Place your email here"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={user.email}
                    onChange={handleChange}/>
                </div>
                <div className='relative'>
                  <Label>Password</Label>
                  <Input
                  type={showPassword ? "text":"password"}
                  placeholder="Create a Password"
                  name="password"
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={user.password}
                    onChange={handleChange}/>
                  <button onClick={()=>{setShowPassword(!showPassword)}} type='button' className='absolute right-3 top-6 text-gray-500'>
                  {showPassword ? <EyeOff  size={20}></EyeOff>:<Eye></Eye>}  
                  </button>
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
                <p className='text-center text-gray-600 dark:text-gray-300 '>Already have an account? <Link to={'/login'}><span className='underline cursor-pointer hover:text-gray-800
                dark:hover:text-gray-100'>Sign in</span></Link></p>
              </form>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Signup
