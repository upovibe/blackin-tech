import React from "react";
import Logo from "../common/Logo";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram, FaPinterest, FaX } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <footer className="text-slate-900 py-6 flex items-center justify-center px-2 border-t-2 border-slate-400/10">
        <div className="container flex flex-col gap-y-4 md:gap-y-6">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/upovibe/#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-700 hover:text-slate-900 transition-all duration-300 ease-in-out"
              >
                <FaFacebook className="w-6 h-6 hover:scale-110 transform transition-transform duration-300 ease-in-out" />
              </a>
              <a
                href="https://x.com/upovibe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-700 hover:text-slate-900 transition-all duration-300 ease-in-out"
              >
                <FaX className="w-6 h-6 hover:scale-110 transform transition-transform duration-300 ease-in-out" />
              </a>
              <a
                href="https://www.pinterest.com/upovibe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-700 hover:text-slate-900 transition-all duration-300 ease-in-out"
              >
                <FaPinterest className="w-6 h-6 hover:scale-110 transform transition-transform duration-300 ease-in-out" />
              </a>
              <a
                href="https://www.instagram.com/upovibe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-700 hover:text-slate-900 transition-all duration-300 ease-in-out"
              >
                <FaInstagram className="w-6 h-6 hover:scale-110 transform transition-transform duration-300 ease-in-out" />
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">BlackinTech &copy; 2022</p>
            <ul className="flex gap-x-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
