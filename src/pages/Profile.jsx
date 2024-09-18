import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/images/avatar-default.png";
import defaultCoverImage from "../assets/images/coverimage.jpg";
import { FaInfoCircle, FaMapMarker, FaUser } from "react-icons/fa";
import Divider from "../components/common/Divider";
import TabComponent from "../components/common/TabComponent";
import JobProfile from "../components/lists/JobProfile";
import Lottie from "lottie-react";
import pageloading from "../assets/animations/Animation - LoadingPage.json";
import Modal from "../components/common/Modal";
import UserInsightsForm from "../components/auth/UserInsightsForm";
import ProfileProgress from "../components/auth/ProfileProgress"; 

function Profile() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(fetchData);
  }, []);

  const tabs = [
    user.role === "admin" && {
      label: "Posted",
      content: <JobProfile tab="Posted" />,
    },
    // { label: "Projects", content: <JobProfile tab="Projects" /> },
    { label: "Applied", content: <JobProfile tab="Applied" /> },
    { label: "Saved", content: <JobProfile tab="Saved" /> },
  ].filter(Boolean);

  const handleTabChange = (tab) => {
    console.log("Selected Tab:", tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Lottie animationData={pageloading} loop={true} className="w-48 h-48" />
      </div>
    );
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="">
      <section className="w-screen flex flex-col items-center justify-center">
        <div className="w-full h-64 bg-gray-200 relati">
          <img
            src={user.coverImageUrl || defaultCoverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container flex items-start flex-col lg:flex-row p-0 px-2 md:py-2 gap-5 lg:gap-10">
          <div className="flex items-center flex-col gap-2 mb-4 w-full lg:w-3/6 xl:w-2/6 transform -translate-y-16">
            <div className="flex items-center flex-col gap-5 w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start lg:items-start flex-col gap-1 w-full">
                  <div className="relative flex flex-col items-center justify-center">
                    <img
                      src={user.avatarUrl || defaultAvatar}
                      alt="User Avatar"
                      className="w-28 h-28 rounded-full border-2 border-opacity-20 border-gray-300"
                    />
                    {user.role === "admin" && (
                      <span className="absolute bottom-0 text-sm px-3 py-[1px] shadow bg-orange-400 text-white rounded-full font-semibold w-max">
                        {user?.role}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold">
                    {user.fullName || "Anonymous"}
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-semibold text-lg lowercase">
                      @{user.userName}
                    </span>
                    &#183;
                    <span className="text-sm font-semibold underline">
                      {user.pronouns}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-max ml-auto mt-5 flex items-center gap-1 transform translate-y-12">
                  <button
                    className="w-full hover:bg-gray-100 px-3 border-2 rounded-lg text-slate-700 text-center flex items-center gap-2"
                    onClick={handleModalOpen}
                  ><FaUser className="text-xs font-semibol"/>
                    {" "}
                    Edit
                  </button>
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-300/80 p-3 flex flex-col items-center gap-3 w-full">
                <span className="flex items-baseline space-x-2 text-slate-800 font-semibold text-sm mr-auto">
                  <FaInfoCircle />
                  <p>{user.bio}</p>
                </span>
                <Divider direction="horizontal" className="opacity-50" />
                <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                  <FaMapMarker />
                  <span className="">
                    {user.country}&nbsp;{user.city}
                  </span>
                </div>
                <ProfileProgress/>
              </div>
              
            </div>
          </div>
          <div className="flex items-center flex-col gap-2 mb-4 rounded-xl size-full border-slate-300/80 p-3">
            <div className="size-full">
              <TabComponent
                tabs={tabs}
                defaultActiveTab="Saved"
                onTabChange={handleTabChange}
              />
            </div>
          </div>
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Add more professions"
        className="h-screen"
      >
        <UserInsightsForm />
      </Modal>
    </main>
  );
}

export default Profile;
