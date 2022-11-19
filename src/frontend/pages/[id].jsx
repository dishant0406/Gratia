import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import { useMetaMask } from 'metamask-react';

const PostPage = () => {
  const [open, setOpen]= useState(false)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [artist, setArtist] = useState('')

  useEffect(()=>{

  },[])
  return (
    <div className='w-[100vw] relative min-h-[100vh] bg-[#EBEBFD]'>
      <NavBar/>
      <div className='w-[100vw] flex justify-center'>
        <button onClick={()=>setOpen(true)} className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                  Post
        </button>
      </div>
      {open && <div onClick={() => setOpen(false)} style={{ backgroundColor: 'rgba(30,34,42, 0.7)' }} className='w-[100vw] flex items-center justify-center h-[100vh] fixed top-[0] left-[0]'>
        <div onClick={(e) => { e.stopPropagation() }} className='w-[40rem] h-[30rem] justify-between px-[3rem] flex rounded-[20px] bg-[#BAC4DF]'>
          <div className='mt-[4rem] flex flex-col items-start'>
            <p className='text-[38px] font-[700]'>Exclusive Content</p>
            <p className='text-[26px] font-[700] mt-[-0.75rem]'>Post something</p>

            <div className='mt-[1rem]'>
              <p className='text-[20px] font-[700]' style={{ lineHeight: '28px' }}>Offer Content to users</p>
              <div className='flex gap-[1rem] items-center mt-[2rem]'>
                <p className='text-[20px] font-[700]' style={{ lineHeight: '28px' }}>Post Title</p>
                <input placeholder='Enter the title...' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[15rem] text-[20px] font-[500px]' />
              </div>
                <textarea placeholder='Enter Content...' className='mt-[1rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[23rem] text-[20px] font-[500px]' />
             <button  className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Post
              </button>

            </div>
          </div>
          <div className="mt-[4rem] overflow-hidden h-[10rem] w-[10rem] rounded-full bg-white">
          </div>
        </div>
      </div>}
      <div className='w-[100vw] mt-[2rem] flex justify-center'>
        <div className='w-[80vw] flex flex-col gap-[1rem] items-center py-[3rem] bg-white shadow-xl'>
          <p className='text-[26px] font-[700] text-center'>Enter the Decentralised World!!</p>
          <iframe src="https://giphy.com/embed/g7GKcSzwQfugw" width="480" height="407" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  )
}

export default PostPage