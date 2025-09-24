import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex h-screen w-screen justify-center items-center'>
      <Image 
      src={"/new-logo.png"}
      alt='logo'
      height={200}
      width={200}
      className='animate-pulse'
      />
    </div>
  )
}

export default Loading