import React, { useEffect, useRef, useState } from 'react'
import ArtistListItem from '../components/ArtistListItem/ArtistListItem'
import NavBar from '../components/NavBar/NavBar'
import axios from 'axios'
import { useMetaMask } from "metamask-react";
import web3 from '../../../eth/web3';
import factory from '../../../eth/factory'
import artistContract from '../../../eth/campaign'

const Home = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [open, setOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const inputRef = useRef(null)
  const [contriAmount, setContriAmount] = useState('')
  const [error, setErr] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [contributeLoading, setContriLoading] = useState(false)
  const [ArtistData, setArtistData] = useState({
    title: '',
    mincontri: 0,
    account,
    uid: '',
    youtube: '',
    twitch: '',
    category: '',
    purl: imageUrl
  })

  const [openIndex, setOpenIndex] = useState(null)

  const [artistsDetails, setArtistsDetails] = useState([])

  useEffect(() => {
    setArtistData({ ...ArtistData, account: account })
  }, [account])

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
      setArtistData({ ...ArtistData, purl: data.url })
    }
    catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    status === "connected" && (async function () {
      try {
        if (account) {
          const artists = await factory.methods.getArtist().call()

          const newArr = await Promise.all(artists.map(async (_, index) => {

            const newArtistInstace = artistContract(artists[index])
            const artistDetail = await newArtistInstace.methods.getArtistDetails().call()

            const isSubscribed = await newArtistInstace.methods.subscribedUsers(account).call()
            console.log(isSubscribed)

            return {
              name: artistDetail[0],
              uid: artistDetail[1],
              youtube: artistDetail[2],
              twitch: artistDetail[3],
              minContri: artistDetail[4],
              cate: artistDetail[5],
              postsCount: artistDetail[6],
              imgurl: artistDetail[7],
              isSub: isSubscribed
            }

          }))
          setArtistsDetails(newArr)
        }
      } catch (err) {
        console.log(err)
      }


    })();

  }, [loading, contributeLoading, status, account])



  const handleCreateArtist = async () => {
    if (ArtistData.title !== '' && ArtistData.mincontri !== 0 && ArtistData.uid != '' && ArtistData.youtube !== '' && ArtistData.twitch !== '' && ArtistData.category !== '' && ArtistData.purl !== '') {
      try {
        setLoading(true)
        setErr('')
        await factory.methods.createArtist(ArtistData.title, web3.utils.toWei(ArtistData.mincontri, 'ether'), ArtistData.uid, ArtistData.youtube, ArtistData.twitch, ArtistData.category, ArtistData.purl).send({
          from: account
        })
        setOpen(false)
        setSignupOpen(false)
        setArtistData({
          title: '',
          mincontri: 0,
          account,
          uid: '',
          youtube: '',
          twitch: '',
          category: '',
          purl: imageUrl
        })
      } catch (err) {
        if (err.message.includes(':')) {
          setErr(err.message.split(':')[1])
        }
        else {
          setErr(err.message)
        }
      }
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    const artists = await factory.methods.getArtist().call()
    const newArtistInstace = artistContract(artists[openIndex])
    try {
      setContriLoading(true)
      const accounts = await web3.eth.getAccounts()
      await newArtistInstace.methods.registerUser().send({
        from: accounts[0],
        value: web3.utils.toWei(contriAmount, 'ether')
      })
    } catch (err) {
      console.log(err)
    }
    setContriLoading(false)
    setOpen(false)
  }

  return (
    <div className='w-[100vw] relative min-h-[100vh] bg-[#EBEBFD]'>
      <NavBar onClick={() => setSignupOpen(true)} />
      <div className='w-[100vw] flex flex-col items-center'>
        <p className='text-[56px] font-[700] mt-[3rem]'>Gratia for Gratitude</p>
        <div className='w-[25rem] mt-[1rem] flex items-center text-[#595B69] px-[2rem] font-sans bg-white rounded-[10px] h-[3rem]'>
          Support your favourite artist
        </div>
        <button className="px-[2rem] rounded-[10px] text-white font-[700] text-[26px] mt-[1rem] rounded py-[0.25rem] bg-[#4355AF]">Go!</button>
        <p className="text-[38px] font-[700] w-[80vw] mt-[1rem] text-left">Featured Artists</p>
        <div className='my-[2rem] flex flex-col gap-[1rem]'>
          {status === "notConnected" && <p className='text-[26px] font-[700] text-center'>Connect To Metamask to Access the Content</p>}
          {artistsDetails.map((e, idx) => {
            return <ArtistListItem details={e} onClick={() => { setOpenIndex(idx); setOpen(true) }} />
          })}
        </div>
      </div>
      {open && <div onClick={() => setOpen(false)} style={{ backgroundColor: 'rgba(30,34,42, 0.7)' }} className='w-[100vw] flex items-center justify-center h-[100vh] fixed top-[0] left-[0]'>
        <div onClick={(e) => { e.stopPropagation() }} className='w-[40rem] h-[30rem] justify-between px-[3rem] flex rounded-[20px] bg-[#BAC4DF]'>
          <div className='mt-[4rem] flex flex-col items-start'>
            <p className='text-[38px] font-[700]'>{artistsDetails[openIndex].name}</p>
            <p className='text-[26px] font-[700] mt-[-0.75rem]'>{artistsDetails[openIndex].cate}</p>

            <div className='mt-[5rem]'>
              <p className='text-[20px] font-[700]' style={{ lineHeight: '28px' }}>What would you like to offer?</p>
              <div className='flex gap-[1rem] items-center mt-[2rem]'>
                <p className='text-[20px] font-[700]' style={{ lineHeight: '28px' }}>MATIC</p>
                <input onChange={e => setContriAmount(e.target.value)} value={contriAmount} placeholder='0.002' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[13rem] text-[20px] font-[500px]' />
              </div>
              {!contributeLoading && <button onClick={handleSubscribe} className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Subscribe
              </button>}
              {contributeLoading && <button className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Loading
              </button>}
            </div>
          </div>
          <div className="mt-[4rem] overflow-hidden h-[10rem] w-[10rem] rounded-full bg-white">
            <img className='w-[11rem] h-[11rem]' src={artistsDetails[openIndex].imgurl} />
          </div>
        </div>
      </div>}
      {signupOpen && <div onClick={() => setSignupOpen(false)} style={{ backgroundColor: 'rgba(30,34,42, 0.7)' }} className='w-[100vw] flex items-center justify-center h-[100vh] fixed top-[0] left-[0]'>
        <div onClick={(e) => { e.stopPropagation() }} className='w-[40rem] h-[40rem] justify-between px-[3rem] flex rounded-[20px] bg-[#BAC4DF]'>
          <div className='mt-[4rem] flex flex-col items-start'>
            {error !== '' && <p>{error}</p>}
            <p className='text-[38px] font-[700]'>Welcome</p>
            <p className='text-[26px] font-[700] mt-[-0.75rem]'>Let's get you started</p>

            <div className='mt-[3rem]'>
              <p className='text-[20px] font-[700]' style={{ lineHeight: '28px' }}>What would you like to offer?</p>
              <div className='flex gap-[1rem] items-center mt-[2rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, title: e.target.value }) }} placeholder='Name' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              <div className='flex gap-[1rem] items-center mt-[0.5rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, mincontri: e.target.value }) }} placeholder='Minimum Contribution' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              <div className='flex gap-[1rem] items-center mt-[0.5rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, uid: e.target.value }) }} placeholder='Unique ID' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              <div className='flex gap-[1rem] items-center mt-[0.5rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, youtube: e.target.value }) }} placeholder='Youtube URL' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              <div className='flex gap-[1rem] items-center mt-[0.5rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, twitch: e.target.value }) }} placeholder='Twitch URL' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              <div className='flex gap-[1rem] items-center mt-[0.5rem]'>
                <input onChange={e => { setArtistData({ ...ArtistData, category: e.target.value }) }} placeholder='Category' className='h-[2.5rem] px-[10px] rounded-[10px] focus:outline-0 border-none w-[20rem] text-[20px] font-[500px]' />
              </div>
              {!loading && <button onClick={handleCreateArtist} className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Let's Dive in
              </button>}
              {loading && <button className="px-[1rem] mt-[1rem] text-white w-[20rem] font-[500] rounded py-[0.5rem] bg-[#4355AF]">
                Loading....
              </button>}
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <div className="mt-[4rem] h-[10rem] w-[10rem] overflow-hidden rounded-full bg-white">
              {imageUrl !== '' && <img src={imageUrl} className='h-[11rem] w-[11rem]' />}
            </div>
            <input accept="image/png, image/gif, image/jpeg" onChange={handleChange} ref={inputRef} type='file' hidden />
            <button onClick={() => inputRef.current.click()} className="mt-[1rem] px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#4355AF]">
              Upload Photo
            </button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Home