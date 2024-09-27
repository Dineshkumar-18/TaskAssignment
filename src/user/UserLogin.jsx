import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const UserLogin = () => {


    console.log("hello")
    const [login,setLogin]=useState({
        email:"",
        password:""
    })
    const [view,setView]=useState(false)
    const [error,setError]=useState("")
    const passwordRef = useRef(login.password);
    const navigate=useNavigate()

    const handleChange=(e)=>
    {
       setLogin({...login,[e.target.name]:e.target.value})
    }

   const handleLogin=async (e)=>{
      
      e.preventDefault();
      try {
        console.log("handleLogin")
        const response=await axios.post('https://localhost:7274/api/UserAccount/login',login)
        console.log(response.data)
        console.log(response.data.flag)
        if(!response.data.flag) setError(response.data.message)        
        else
        {
            const jwtToken = response.data.jwttoken;
            if (jwtToken) {
                localStorage.setItem('jwtToken', jwtToken);
            }
          setError('')
          navigate('/user/')
        }
      } catch (error) {
          console.log(error)
          setError(error.message)
      }
   }

   const handleView=()=>
   {
      setView((prev)=>!prev)
      console.log(view)
   }

   useEffect(() => {
    console.log(login.email, login.password);
}, [login]); 


  return (
<div className='min-h-screen flex justify-center items-center'>
  <div className="bg-opacity-80 bg-black border-2 border-white border-opacity-40 backdrop-blur-lg text-white rounded-lg p-10 w-96">
  <form method='POST'>
    <h1 className="text-3xl text-center mb-6">Login</h1>
    <div className="input-box relative w-full h-12 mb-6">
      <input
        type="email"
        placeholder="Email"
        required
        name='email'
        value={login.email}
        onChange={handleChange}
        className="w-full h-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
      />
      <i className='bx bxs-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
    </div>
    <div className="input-box relative w-full h-12 mb-6">
      <input
        type={view  ? 'text' : 'password'}
        ref={passwordRef}
        placeholder="Password"
        value={login.password}
        required
        onChange={handleChange}
        name='password'
        className="w-full h-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
      />
      <div onClick={handleView} className='cursor-pointer'>
        <i className={`fa-solid ${view ? 'fa-eye' : 'fa-eye-slash'}  absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-white`}></i>
      </div>
    </div>
    
    <button
      type="submit"
      onClick={handleLogin}
      className="btn w-full h-12 bg-blue-500 rounded-full shadow-lg text-white font-semibold hover:bg-blue-600 transition duration-300"
    >
      Login
    </button>
    <div className="register-link text-center mt-6 text-sm">
      <p>
         Don't have an account? {' '}
        <Link to="/user/register" className="text-blue-500 hover:underline font-semibold">Register</Link>
      </p>
    </div>
    {error!="" && <p className="text-red-500 text-lg mt-2 text-center">{error}</p>}
  </form>
</div>
</div>

  )
}

export default UserLogin
