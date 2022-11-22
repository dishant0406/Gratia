import { useRouter } from "next/router"

const ArtistListItem = ({onClick=()=>{}, details}) => {
  const router = useRouter()
  return (
    <div className='bg-[#95ABE3] flex-wrap flex md:justify-between justify-center px-[3rem] gap-[3rem] items-center max-w-[40rem] min-h-[8rem] mx-[1rem] py-[2rem] md:py-[0px]  rounded-[20px]'>
        <div className="flex gap-[1rem] items-center">
          <div className="h-[6rem] w-[6rem] rounded-full overflow-hidden bg-white">
            <img src={details.imgurl} className='h-[7rem] w-[7rem]'/>
          </div>
          <div className=" flex flex-col items-start">
            <p className="text-white text-[20px] font-[700]">{details.name}</p>
            <p className="text-white text-[16px] font-[700]">{details.cate}</p>
          </div>
        </div>
        {!details.isSub && <button onClick={onClick} className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#4355AF]">
          Subscribe
        </button>}
        {details.isSub && <button onClick={()=>{router.push(`/${details.uid}`)}} className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#4355AF]">
          Go To Page
        </button>}
    </div>
  )
}

export default ArtistListItem