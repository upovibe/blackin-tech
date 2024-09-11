import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';
import Logo from '../common/Logo';
import { FaSearch, FaWindowClose } from 'react-icons/fa';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // For navigation purposes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchClick = () => {
    // Redirect to the search page when the search button is clicked
    navigate('/search');
  };

  const handleSignUpClick = () => {
    // Redirect to the signup page when the Sign Up button is clicked
    navigate('/signup');
  };

  return (
    <nav className='relative flex w-full justify-center items-center'>
      <div className="container flex items-center md:justify-between p-2 py-3 relative w-full">
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center space-x-5'>
            {/* Logo */}
            <Logo/>

            <ul className="hidden md:flex items-center space-x-4  w-full md:w-max flex-row justify-start md:justify-center md:items-center gap-6 font-semibold">
              <li className='block w-full hover:bg-slate-700/50 hover:text-white md:hover:text-slate-950 md:hover:bg-transparent transition-all duration-300 ease-in-out md:border-b-2 border-transparent md:hover:border-slate-700 p-2 md:p-0 md:pb-[1px]'>
                <Link to="/jobs">Job</Link>
              </li>
              <li className='block w-full hover:bg-slate-700/50 hover:text-white md:hover:text-slate-950 md:hover:bg-transparent transition-all duration-300 ease-in-out md:border-b-2 border-transparent md:hover:border-slate-700 p-2 md:p-0 md:pb-[1px]'>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>

          <div className='flex items-center gap-3 ml-auto'>
            {/* Search Component */}
            <div className="hidden lg:block  w-64">
              <SearchInput />
            </div>

            {/* Search Button for smaller screens */}
            <Button className="lg:hidden bg-transparent text-slate-700 hover:bg-transparent " size="small" onClick={handleSearchClick}>
              <FaSearch />
            </Button>

            {/* Sign Up Button */}
            <Button className="hidden md:block" onClick={handleSignUpClick}>Sign Up</Button>
          </div>
        </div>

        <div>
          <div className="burger-menu  flex md:hidden  cursor-pointer flex-col space-y-1 ml-3" onClick={toggleMenu}>
            <div className={`w-6 h-[2px] bg-slate-900 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-6 h-[2px] bg-slate-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-[2px] bg-slate-900 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </div>
          {/* Sliding Menu */}
          <div className={`fixed top-0 left-0 h-full w-64 bg-slate-700 text-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
            <div className="p-4 flex justify-between items-center">
              <div>
                <Link to="/" className="text-xl font-semibold">
                  BT
                </Link>
              </div>
              {/* Close Button */}
              <button
                onClick={toggleMenu}
                className="text-slate-300 hover:text-white transition-all"
              >
                <FaWindowClose />
              </button>
            </div>
            <ul className="mt-4 space-y-4 p-3">
              <li className="hover:bg-slate-500 rounded-md transition-all w-full">
                <Link to="/jobs" className='block w-full h-full p-2'>Jobs</Link>
              </li>
              <li className="hover:bg-slate-500 rounded-md transition-all w-full">
                <Link to="/about" className='block w-full h-full p-2'>Abouts</Link>
              </li>
              <li className="hover:bg-slate-500 rounded-md transition-all w-full">
                <Link to="/terms" className='block w-full h-full p-2'>Terms</Link>
              </li>
            </ul>
            <div className='p-2'>
              <Button className="block bg-white text-black hover:text-white w-full" onClick={handleSignUpClick}>Sign Up</Button>
            </div>
          </div>
        </div>

        {/* Overlay to close menu */}
        {isMenuOpen && (
          <div
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/50 z-10"
          ></div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
