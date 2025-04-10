import React from 'react'
import { RecoilRoot } from 'recoil'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <RecoilRoot><div>{children}</div></RecoilRoot>
    
  )
}

export default layout