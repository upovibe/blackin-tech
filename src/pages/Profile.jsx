import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/images/avatar-default.png";
import { FaInfoCircle, FaLocationArrow, FaMapMarker } from "react-icons/fa";
import Divider from "../components/common/Divider";
import TabComponent from "../components/common/TabComponent";
import JobList from "../components/lists/JobList";

function Profile() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const tabs = [
    { label: "Job Listings", content: <div><JobList/></div> },
    { label: "Jobs Applied", content: <div>This is the Boosted Shots tab content.</div> },
  ];

  const handleTabChange = (tab) => {
    console.log("Selected Tab:", tab);
  };

  return (
    <>
      <main className="w-screen ">
        <section className="w-full py-16 full flex items-center justify-center">
          <div className="container flex items-start flex-col lg:flex-row p-0 px-2 md:py-2 gap-10">
            <div className="flex items-center flex-col gap-2 mb-4 w-full lg:w-3/6 xl:w-2/6 rounded-xl border-2 border-slate-300/80 p-3">
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
                <span className="font-semibold text-lg lowercase">@{user.userName}</span>&#183;
                <span className="text-sm font-semibold underline">{user.pronouns}</span>
              </div>
              <Divider
                direction="horizontal"
                className="mx-4 my-2 opacity-50"
              />
              <span className="flex items-baseline space-x-2 text-slate-800 font-semibold text-sm mr-auto">
                <FaInfoCircle />
                <p>{user.bio}</p>
              </span>

              <Divider
                direction="horizontal"
                className="mx-4 my-2 opacity-50"
              />
              <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                <FaMapMarker />
                <span className="">
                  {user.country}&nbsp;{user.city}
                </span>
              </div>
              <div className="w-full md:w-max ml-auto mt-5">
                <button
                  className="w-full hover:bg-gray-100 p-2 px-3 border-2 rounded-lg text-slate-700 text-center"
                  onClick={() => navigate("/edit-profile")}> Edit Profile</button>
              </div>
            </div>
            <div className="flex items-center flex-col gap-2 mb-4 rounded-xl size-full border-slate-300/80 p-3">
              <div className="size-full">
                <TabComponent tabs={tabs} defaultActiveTab="Job Listings" onTabChange={handleTabChange} orientation="horizontal" />
              </div>
               {/* Vertical Tabs (full width) */}
            {/* <TabComponent tabs={tabs} defaultActiveTab="Jobs Applied" onTabChange={handleTabChange} orientation="vertical" />  */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile;
