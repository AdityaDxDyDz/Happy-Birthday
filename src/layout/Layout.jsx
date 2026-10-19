import React from 'react'
import { Outlet } from 'react-router'
import HeartTransition from '../components/HeartTransition'
import SoundManager from '../components/SoundManager'

const Layout = () => {
  return (
    <>
      <SoundManager />
      <HeartTransition />
      <Outlet />
    </>
  )
}

export default Layout