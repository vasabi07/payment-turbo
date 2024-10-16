"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'

const Signin = () => {
    const router = useRouter()
  const [data,setData] = useState({
      phone: "",
      password: ""
  })
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setData({...data, [e.target.name]:e.target.value})
  }
  const HandleSubmit =async (e: React.FormEvent)=>{
      e.preventDefault();
      try {
          const response =await axios.post("http://3.26.20.130:8000/signin",data,{
            withCredentials: true
          });
          console.log(response.data);
          router.push("/");
      } catch (error) {
          console.log(error)
      }
  }
return (
  <div className='flex w-full h-screen justify-center items-center'>
      <div className='flex p-2  w-[300px] h-[320px] flex-col border-2 '>
      <h1 className='text-4xl'>Signin</h1>
      <form className='flex flex-col justify-between p-2 gap-2'   onSubmit={HandleSubmit}>
          <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='phone' value={data.phone} type="phone" placeholder='Phone' onChange={HandleChange} />
          <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='password' value={data.password} type="text" placeholder='Password' onChange={HandleChange} />
          <button className='px-4 py-2 bg-slate-600 text-white' type='submit' >Submit</button>
      </form>
      </div>
  </div>
)
}

export default Signin