import React from 'react'
import NavBar from './NavBar'

function Header() {
  return (
    <>
    <header className="flex justify-center w-screen h-max border-b-2 border-slate-400/10">
      <NavBar/>
    </header>
    </>
  )
}

export default Header