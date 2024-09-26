import { useNavigate } from "react-router-dom";
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SubscriptionList from "../components/lists/SubscriptionList";

const JobManagementPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/jobs");
  };

  

  return (
    <main className="">
      <section className="flex itema-center justify-center p-4" >
        <div className="container flex flex-col items-center justify-center gap-16 py-16">
          <div className="flex flex-col space-y-6 items-center justify-center px-0 md:px-20 lg:px-40 xl:px-60">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center font-serif" data-aos="fade-up">
              Find Top Tech Talent Today
            </h1>
            <p className="text-xs md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto" data-aos="fade-up">
              Connect with skilled, diverse professionals ready to innovate and
              elevate your business. Post jobs and start building your dream
              team now.
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-green-200 to-slate-100 w-full xl:w-10/12 mx-auto relative py-14 px-5" data-aos="fade-up">
            <SubscriptionList />
          </div>
          <div className="flex items-center justify-center">
            <button onClick={handleBackClick} className="bg-slate-900 p-2 h-16 w-[15rem] rounded-full text-white font-semibold text-lg">
              View all job posts
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobManagementPage;
