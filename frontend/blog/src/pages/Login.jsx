import React, { useState } from 'react'
import auth from '../assets/auth.jpg'
import { Card,CardHeader,CardTitle , CardContent} from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authSlice, { setLoading,setUser } from '../Redux/authSlice'
import axios from 'axios';
import { toast } from 'sonner'

const Login=()=> {
  const [showPassword,setShowPassword]=useState(false)
  const navigate= useNavigate()
  const dispatch = useDispatch()
  const [input,setInput]= useState({
    
    email:"",
    password:"",
  })
  const handleChange = (e)=>{

    const {name,value}=e.target
    setInput((prev)=>({...prev,[name]:value}))
  }
  const handleSubmit = async (e)=>{
    e.preventDefault()
    console.log(input);

    try {
      dispatch(setLoading(true))
      const res= await axios.post(`http://localhost:3000/api/v1/user/login`,input,{
        headers:{
          "Content-Type": "application/json",
        },
        withCredentials:true
      });
      console.log("res: ", res.data)
      if(res.data.success){
        localStorage.setItem("token", res.data.token)
        navigate('/')
        dispatch(setUser(res.data.user))
        toast(res.data.success)
      }
    } catch (error) {
      if (error.response && error.response.data) {
  console.log(error.response.data.message);
  toast.error(error.response.data.message);
} else {
  console.log("Login failed:", error.message);
  
}

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
                <h1 className='text-center text-xl font-semibold'>Login into your account</h1>
              </CardTitle>
              <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to login your account</p>
            </CardHeader>
            <CardContent>
              <form className='space-y-4' onSubmit={handleSubmit}>
                
                <div>
                  <Label>Email</Label>
                  <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={input.email}
                  onChange={handleChange}
                  />
                </div>
                <div className='relative'>
                  <Label>Password</Label>
                  <Input
                  type={showPassword ? "text":"password"}
                  placeholder="Enter your Password"
                  name="password"
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={input.password}
                  onChange={handleChange}/>
                  
                  <button onClick={()=>{setShowPassword(!showPassword)}} type='button' className='absolute right-3 top-6 text-gray-500'>
                  {showPassword ? <EyeOff  size={20}></EyeOff>:<Eye></Eye>}  
                  </button>
                </div>
                <Button type="submit" className="w-full">Login</Button>
                <p className='text-center text-gray-600 dark:text-gray-300 '>Don't have an account? <Link to={'/Signup'}><span className='underline cursor-pointer hover:text-gray-800
                dark:hover:text-gray-100'>Sign in</span></Link></p>
              </form>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
