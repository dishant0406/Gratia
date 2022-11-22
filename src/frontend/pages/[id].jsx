import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import { useMetaMask } from 'metamask-react';
import axios from 'axios';
import web3 from '../../../eth/web3';
import factory from '../../../eth/factory'
import { useRouter } from 'next/router';
import artistContract from '../../../eth/campaign'
import BlogCard from '../components/BlogCard/BlogCard';

const PostPage = () => {
  const [open, setOpen]= useState(false)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const inputRef = useRef(null)
  const [imgUrl, setImageUrl] = useState('')
  const [hash, setHash] = useState('')
  const [docType, setDocType] = useState('')
  const router = useRouter()
  const [artist, setArtist] = useState('')
  const {id} = router.query
  const [isManager, setIsManager] = useState(false)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])



  /*

   title: ptitle,
   content: pcontent,
   doctype:pdoctype,
   docurl:pdocurl,
   dochash:pdochash

  */

   const handleChange = async (e) => {
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    try {
      const { data } = await axios.post('http://localhost:3259/api/upload', formData, config);
      setImageUrl(data.url)
      setHash(data.hash)
      setDocType(data.filetype)
    }
    catch (err) {
      console.log(err)
    }

  }

  useEffect(()=>{
      (async function() {
        if(id){
          const address = await factory.methods.getArtistByID(id).call()
            setArtist(address)
        }
      })();
      
  },[id])

  useEffect(()=>{

    (async function() {
      if(artist!=''){
        const newArtistInstace = artistContract(artist)
        const isAvailable = await newArtistInstace.methods.subscribedUsers(account).call()
        if(!isAvailable){
          router.push('/')
        }
        const manager = await newArtistInstace.methods.manager().call()
        setIsManager(manager.toLowerCase()===account.toLowerCase())
        
        const postLength = await newArtistInstace.methods.getPostsLength().call()
        
        let postsArr = []

        for(let i=0;i<postLength;i++){
          const post = await newArtistInstace.methods.posts(i).call()
          const {content, dochash, doctype, docurl, title} = post
          postsArr.push({content, dochash, doctype, docurl, title})
        }

        console.log(postsArr)
        setPosts(postsArr)

      }
    })();
    

  },[artist, account, loading])

  const handlePost = async ()=> {
    if(title!==''&&content!==''&&docType!==''&&imgUrl!==''){
      try{
        setLoading(true)
        const newArtistInstace = artistContract(artist)
        await newArtistInstace.methods.postABlog(title, content, docType, imgUrl, hash).send({
          from:account
        })
        setOpen(false)
        setHash('')
        setImageUrl('')
        setTitle('')
        setContent('')
        setDocType('')
      }
      catch(err){
        console.log(err)
      }
      setLoading(false)
    }
  }

  return (
    <div className='w-[100vw] relative min-h-[100vh] bg-[#EBEBFD]'>
      <NavBar/>
      {isManager && <div className='w-[100vw] flex justify-center'>
        <button onClick={()=>setOpen(true)} className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                  Post
        </button>
      </div>}
      {open && <div onClick={() => setOpen(false)} style={{ backgroundColor: 'rgba(30,34,42, 0.7)' }} className='w-[100vw] flex items-center justify-center h-[100vh] fixed top-[0] left-[0]'>
        <div onClick={(e) => { e.stopPropagation() }} className='w-[40rem] h-[30rem] justify-between px-[3rem] flex rounded-[20px] bg-[#BAC4DF]'>
          <div className='mt-[4rem] flex flex-col items-start'>
            <p className='text-[26px] font-[700] mt-[-0.75rem]'>Post something</p>

            <div className='mt-[1rem] w-[20rem]'>
              <p className='text-[20px] font-[700] ' style={{ lineHeight: '28px' }}>Offer Content to users</p>
              <div className='flex gap-[1rem] items-center mt-[2rem]'>
                <input accept="image/png, image/gif, image/jpeg" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Enter the title...' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[23rem] text-[20px] font-[500px]' />
              </div>
                <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder='Enter Content...' className='mt-[1rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] py-[1rem] h-[8rem] font-[500px]' />
             {!loading && <button onClick={handlePost}  className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Post
              </button>}
             {loading && <button disabled  className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Loading...
              </button>}

            </div>
          </div>
          <div className='flex flex-col items-center'>
          <div className="mt-[4rem] overflow-hidden h-[10rem] w-[10rem] rounded bg-white">
          {imgUrl !== '' && <img src={imgUrl} className='h-[11rem] w-[11rem]' />}
          </div>
          <input onChange={handleChange}  ref={inputRef} type='file' hidden />
            <button onClick={() => inputRef.current.click()} className="mt-[1rem] px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#4355AF]">
              Upload Photo
            </button>
          </div>
        </div>
      </div>}
      <div className='w-[100vw] mt-[2rem] flex justify-center'>
        <div className='w-[80vw] flex flex-col gap-[1rem] items-center py-[3rem] bg-white shadow-xl'>
          <p className='text-[26px] font-[700] text-center'>Enter the Decentralised World!!</p>
          {posts.map((e)=>{
            return <BlogCard title={e.title} content={e.content} imgUrl={e.docurl}/>
          })}
        </div>
      </div>
    </div>
  )
}

export default PostPage