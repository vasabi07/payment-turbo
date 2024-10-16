"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
const Signup = () => {
    const router = useRouter();
    const [data,setData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        pin: ""
    })
    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setData({...data, [e.target.name]:e.target.value})
    }
    const HandleSubmit =async (e: React.FormEvent)=>{
        e.preventDefault();
        try {
            const response =await axios.post("http://13.211.25.11:8000/signup",data);
            if(response.status===201){
                router.push("/signin");
            }
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='flex w-full h-screen justify-center items-center'>
        <div className='flex p-2  w-[300px] h-[380px] flex-col border-2 '>
        <h1 className='text-4xl'>Signup</h1>
        <form className='flex flex-col justify-between p-2 gap-2'   onSubmit={HandleSubmit}>
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600  ' name='name' value={data.name} type="text" placeholder='Name' onChange={HandleChange} />
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='phone' value={data.phone} type="phone" placeholder='Phone' onChange={HandleChange} />
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='email' value={data.email} type="email" placeholder='Email' onChange={HandleChange}/>
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='password' value={data.password} type="text" placeholder='Password' onChange={HandleChange} />
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='pin' value={data.pin} type="text" placeholder='Pin' onChange={HandleChange} />

            <button className='px-4 py-2 bg-slate-600 text-white' type='submit' >Submit</button>
        </form>
        </div>
    </div>
  )
}

export default Signup;