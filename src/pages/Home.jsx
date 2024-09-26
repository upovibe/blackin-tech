import React, { useEffect } from "react";
import Hero from "../components/common/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import FriendsImage from "../assets/images/FriendsImage.jpeg";
import CareerImage from "../assets/images/CareerImage.jpeg";
import TalentImage from "../assets/images/photo-1556761175-5973dc0f32e7.jpeg";
import Sponsor1 from "../assets/images/VisualStudio.png";
import Sponsor2 from "../assets/images/Vercel.png";
import Sponsor3 from "../assets/images/Github.png";
import Subscribe from "./Subscribe";
import Divider from "../components/common/Divider";

function Home() {

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with animation duration
  }, []);
  
  return (
    <main className="">
      <section className="flex items-center justify-center py-16 relative z-10">
        <div className="container flex flex-col items-center justify-center">
          <Hero />
          <Divider className="my-20 bg-slate-800/5" />
          {/* Features Section */}
          <div className="flex flex-col items-center justify-center w-full lg:w-10/12 gap-28 my-20">
            <div
              className="flex flex-col md:flex-row w-full items-center gap-10 p-3"
              data-aos="fade-up"
            >
              <img
                src={FriendsImage}
                alt="Connect with Friends"
                className="w-full md:w-[660px] h-[350px] object-cover rounded-lg shadow-lg"
              />
              <div className="flex flex-col items-start w-full lg:w-1/2">
                <h3 className="text-3xl font-bold mb-2">
                  Build Lasting Connections
                </h3>
                <p className="text-gray-600">
                  Strengthen your network with ease. Whether it's reconnecting
                  with old friends or finding new collaborators, this platform
                  makes staying in touch seamless and engaging.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row-reverse w-full items-center gap-10 p-3"
              data-aos="fade-up"
            >
              <img
                src={CareerImage}
                alt="Advance Your Career"
                className="w-full md:w-[660px] h-[350px] object-cover rounded-lg shadow-lg"
              />
              <div className="flex flex-col items-start w-full lg:w-1/2">
                <h3 className="text-3xl font-bold mb-2">Advance Your Career</h3>
                <p className="text-gray-600">
                  Propel your career forward with expert advice, job
                  opportunities, and a community of professionals ready to
                  support your growth and ambitions.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row w-full items-center gap-10 p-3"
              data-aos="fade-up"
            >
              <img
                src={FriendsImage}
                alt="Showcase Your Talents"
                className="w-full md:w-[660px] h-[350px] object-cover rounded-lg shadow-lg"
              />
              <div className="flex flex-col items-start w-full lg:w-1/2">
                <h3 className="text-3xl font-bold mb-2">
                  Showcase Your Talents
                </h3>
                <p className="text-gray-600">
                  Demonstrate your skills and expertise. This platform is
                  designed to highlight your accomplishments, making it easier
                  for you to be noticed by potential employers and
                  collaborators.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row-reverse w-full items-center gap-10 p-3"
              data-aos="fade-up"
            >
              <img
                src={FriendsImage}
                alt="Collaborate Effortlessly"
                className="w-full md:w-[660px] h-[350px] object-cover rounded-lg shadow-lg"
              />
              <div className="flex flex-col items-start w-full lg:w-1/2">
                <h3 className="text-3xl font-bold mb-2">
                  Collaborate Effortlessly
                </h3>
                <p className="text-gray-600">
                  Whether you're working on a project or sharing innovative
                  ideas, this platform provides the tools you need to
                  collaborate seamlessly with peers in your field.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="mt-16 py-12 px-6 rounded-lg" data-aos="fade-up">
            <h2 className="text-3xl font-semibold text-center mb-8">
              What Our Users Say
            </h2>
            <blockquote className="text-center text-gray-700 italic">
              “This platform has transformed the way I connect with
              professionals and land new opportunities. Highly recommend!”
            </blockquote>
            <p className="text-center text-gray-500 mt-4">
              — Jane Doe, Software Engineer
            </p>

            {/* Additional Testimonial */}
            <blockquote className="text-center text-gray-700 italic mt-8">
              “I was able to hire a talented freelancer for my startup within
              days. The process was seamless, and I couldn't be happier with the
              results.”
            </blockquote>
            <p className="text-center text-gray-500 mt-4">
              — John Smith, Startup Founder
            </p>
          </div>

          {/* Sponsors Section */}
          <div className="mt-16" data-aos="fade-up">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Our Sponsors
            </h2>
            <div className="flex items-center justify-center space-x-8">
              <img src={Sponsor1} alt="Sponsor 1" className="h-12 w-auto" />
              <img src={Sponsor2} alt="Sponsor 2" className="h-12 w-auto" />
              <img src={Sponsor3} alt="Sponsor 3" className="h-12 w-auto" />
            </div>
          </div>
          <Subscribe />
        </div>
      </section>
    </main>
  );
}

export default Home;
