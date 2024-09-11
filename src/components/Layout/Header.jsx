import React from 'react'
import NavBar from './NavBar'

function Header() {
  return (
    <>
    <header className="flex justify-center w-screen h-max shadow border-b-1 border-slate-400/50">
      <NavBar/>
    </header>
    </>
  )
}

export default Header