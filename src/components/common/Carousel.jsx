import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Carousel = ({ children, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % React.Children.count(children));
  }, [children]);

  useEffect(() => {
    const interval = isHovered ? null : setInterval(handleNext, autoSlideInterval);
    return () => clearInterval(interval);
  }, [handleNext, isHovered, autoSlideInterval]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + React.Children.count(children)) % React.Children.count(children)
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        ref={carouselRef}
      >
        {React.Children.map(children, (child, index) => (
          <div className="flex-shrink-0 w-full">{child}</div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {isHovered && (
        <>
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
            onClick={handlePrev}
          >
            <FaArrowLeft />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
            onClick={handleNext}
          >
            <FaArrowRight />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
