import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationHero from "../../assets/animations/Animation - Signup.json";
import { FaUserFriends, FaBriefcase, FaRocket } from 'react-icons/fa'; // Icons import
import Button from "../common/Button"; // Button import

function Hero() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const texts = [
    "Empower Your Career",
    "Connect with Innovators",
    "Explore Tech Opportunities",
    "Join a Thriving Community"
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2500;

  useEffect(() => {
    let typingTimeout;

    if (typing) {
      if (text.length < texts[textIndex].length) {
        typingTimeout = setTimeout(() => {
          setText((prevText) => texts[textIndex].substring(0, prevText.length + 1));
        }, typingSpeed);
      } else {
        setTyping(false);
        setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else if (isDeleting) {
      if (text.length > 0) {
        typingTimeout = setTimeout(() => {
          setText((prevText) => prevText.substring(0, prevText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [text, typing, isDeleting, textIndex]);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-12 px-2 md:px-0">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:items-start max-w-7xl mx-auto space-y-8 lg:space-y-0">
        {/* Lottie Animation Container */}
        <div className="flex-shrink-0 lg:w-1/2 mb-8 lg:mb-0 text-center">
          <Lottie animationData={animationHero} className="w-full h-auto" />
        </div>

        {/* Text and CTA Container */}
        <div className="lg:w-1/2 text-center lg:text-left relative p-8  rounded-lg ">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 whitespace-nowrap overflow-hidden">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 animate-gradient-shift">
              {text}
            </span>
            <span className="font-bold text-slate-600 animate-blink">|</span>
          </h1>
          <p className="text-md sm:text-lg md:text-xl lg:text-2xl mb-8 text-slate-600">
            Connecting Black Professionals to Leading Tech Careers. Unlock new career paths, build meaningful connections,
            and explore exciting opportunities in the ever-evolving tech industry.
          </p>
          <div className="flex flex-col md:flex-row justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-4">
            <Button
              href="#explore"
              className="bg-slate-600 px-6 py-3 rounded-full text-md md:text-lg font-semibold text-white hover:bg-slate-700 transition transform hover:scale-105 duration-300"
            >
              Explore Opportunities
            </Button>
            <Button
              href="#join"
              className="bg-slate-700 px-6 py-3 rounded-full text-md md:text-lg font-semibold text-white hover:bg-slate-800 transition transform hover:scale-105 duration-300"
            >
              Join Our Network
            </Button>
          </div>
        </div>
      </div>

      {/* Engagement Section with Icons */}
      <div className="flex justify-center lg:justify-start space-x-8">
        {/* Icon 1 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md">
          <FaUserFriends className="text-5xl text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Community</h3>
          <p className="text-slate-500">
            Join a thriving community of innovators and professionals.
          </p>
        </div>
        {/* Icon 2 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md">
          <FaBriefcase className="text-5xl text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Opportunities</h3>
          <p className="text-slate-500">
            Access exclusive job offers and career growth opportunities.
          </p>
        </div>
        {/* Icon 3 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md">
          <FaRocket className="text-5xl text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Growth</h3>
          <p className="text-slate-500">
            Accelerate your personal and professional development.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
