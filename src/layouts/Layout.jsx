/* eslint-disable no-unused-vars */
import React from 'react'
import NavBar from '../component/NavBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
        <NavBar/>
        <Outlet/>
    </>

  )
}

export default Layout