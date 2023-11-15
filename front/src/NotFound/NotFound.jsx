import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()
    const BackToHome =()=>{
        navigate("/")
    }
    return (
    <div className='bg-gray h-screen flex items-center'>
        <div className='mx-auto w-3/5'>
      <img src="./notfound.png" alt="" className='block mx-auto w-full'/>
      <div className='flex items-center justify-center'> 
      <button className='w-80 rounded-sm p-2 mb-2 border btn-home' onClick={BackToHome}>Back To Home</button>
        </div>
      </div>
    </div>
  )
}
