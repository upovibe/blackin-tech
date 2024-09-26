import React, { useState, useEffect } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationHero from "../../assets/animations/Animation - Signup.json";
import { FaUserFriends, FaBriefcase, FaRocket } from "react-icons/fa"; // Icons import
import Button from "../common/Button";
import Divider from "../common/Divider";

function Hero() {
  const { user } = UserAuth();
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const texts = [
    "Empower Your Career",
    "Connect with Innovators",
    "Explore Tech Opportunities",
    "Join a Thriving Community",
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
          setText((prevText) =>
            texts[textIndex].substring(0, prevText.length + 1)
          );
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

  const handleExplore = () => {
    navigate("/jobs");
  }
  const handleJoin = () => {
    navigate("/signin");
  }

    if (user) {
      return null;
    }

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidde px-2">
      <div className="flex flex-col items-center justify-center gap-5">
        {/* Text and CTA Container */}
        <div className="text-center relative rounded-lg w-full lg:w-8/12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 whitespace-nowrap overflow-hidden">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 animate-gradient-shift">
              {text}
            </span>
            <span className="font-bold text-slate-600 animate-blink">|</span>
          </h1>
          <p className="font-bold mb-8 text-slate-600">
            Connecting Black Professionals to Leading Tech Careers. Unlock new
            career paths, build meaningful connections, and explore exciting
            opportunities in the ever-evolving tech industry.
          </p>
          <div className="flex  items-center justify-center gap-3">
            <Button
              onClick={handleExplore}
              className="bg-slate-600 w-36 rounded-full text-md md:text-lg font-semibold text-white hover:bg-slate-700 transition transform hover:scale-105 duration-300"
            >
              Explore
            </Button>
            <Button
              onClick={handleJoin}
              className="bg-slate-700 w-36 rounded-full text-md md:text-lg font-semibold text-white hover:bg-slate-800 transition transform hover:scale-105 duration-300"
            >
              Join
            </Button>
          </div>
        </div>
        {/* Lottie Animation Container */}
        <div className="w-full flex items-center justify-center relative">
          <div className="size-32 md:size-64 bg-gradient-to-r from-green-200 to-slate-100 absolute top-5 left-0  lg:left-80 rounded-full bg-opacity-20"></div>
          <Lottie
            animationData={animationHero}
            className="w-full lg:w-1/2 h-auto"
          />
        </div>
      </div>
      {/* Engagement Section with Icons */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Icon 1 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md w-full gap-2 bg-gradient-to-bl from-slate-200 to-slate-50">
          <FaUserFriends className="text-lg md:text-2xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Community</h3>
          <p className="text-slate-500 text-center">
            Join a thriving community of innovators and professionals.
          </p>
        </div>
        {/* Icon 2 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md w-full gap-2 bg-gradient-to-bl from-slate-200 to-slate-50">
          <FaBriefcase className="text-lg md:text-2xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">
            Opportunities
          </h3>
          <p className="text-slate-500 text-center">
            Access exclusive job offers and career growth opportunities.
          </p>
        </div>
        {/* Icon 3 */}
        <div className="flex items-center flex-col justify-center border border-gray-200 p-6 rounded-lg shadow-md w-full gap-2 bg-gradient-to-bl from-slate-200 to-slate-50">
          <FaRocket className="text-lg md:text-2xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Growth</h3>
          <p className="text-slate-500 text-center">
            Accelerate your personal and professional development.
          </p>
        </div>
      </div>
      
      <Divider className="my-20 bg-slate-800/5" />
    </div>
  );
}

export default Hero;
