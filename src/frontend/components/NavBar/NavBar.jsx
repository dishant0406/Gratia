import { useMetaMask } from "metamask-react";

const NavBar = ({onClick=()=>{}}) => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  return (
    <div className='flex w-[100vw] px-[4rem] justify-between items-center pt-[1rem]'>
      <p className="text-[42px] font-[700]">Gratia</p>
      <div className="flex gap-[2rem]">
        {status === "notConnected" && (
          <button onClick={connect} className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#60C081]">
          Connect Metamask
        </button>
        )}
        {status === "connected" && (
          <button className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#60C081]">
          {account}
        </button>
        )}
        {status === "connecting" && (
          <button className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#60C081]">
          Connecting...
        </button>
        )}
        <button onClick={onClick} className="px-[1rem] text-white font-[500] rounded py-[0.5rem] bg-[#4355AF]">
          Artist Signup
        </button>
      </div>
    </div>
  )
}

export default NavBar