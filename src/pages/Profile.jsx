import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/images/avatar-default.png";
import { FaInfoCircle } from "react-icons/fa";
import Divider from '../components/common/Divider'

function Profile() {
  const navigate = useNavigate();
  const { user } = UserAuth();

  return (
    <>
      <main className="w-screen">
        <section className="-full flex items-center justify-center">
          <div className="container flex items-center px-4 py-16 gap-10">
            <div className="flex items-center flex-col gap-2 mb-4 bg-slate-800 w-4/12 rounded-xl border-2 border-slate-500/80 p-3">
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
              <span className="text-3xl font-bold">
                  {user.fullName || "Anonymous"}
                </span>
              <div className="flex flex-row gap-2 items-center">
              <span className="text-lg">@{user.userName}</span>
                <span className="text-lg font-semibold ">
                  {user.pronouns}
                </span>
              </div>
              <p className="flex items-center space-x-2 mt-4">
                <FaInfoCircle />
                <span>{user.bio}</span>
              </p>
              <div className="flex flex-col items-center space-x-4">                
                <span className="text-lg font-semibold">
                  {user.country}&nbsp;{user.city}
                </span>
              </div>
              
            </div>
            <div className="flex items-center flex-col gap-2 mb-4 bg-slate-800 w-8/12">
              <img
                src={user?.avatarUrl}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-28 h-28 rounded-full border-2 border-opacity-20 border-gray-300"
              />
              <div className="flex flex-row gap-2 items-center">
                <div className="font-semibold text-2xl uppercase">
                  <span>{user.fullName}</span>
                </div>
                <span className="text-lg font-semibold ">
                  ({user.pronouns})
                </span>
              </div>
              <div className="flex flex-col items-center space-x-4">
                <span className="text-3xl font-bold">
                  {user.fullName || "Anonymous"}
                </span>
                <span className="text-lg font-semibold">
                  {user.country}&nbsp;{user.city}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-center mb-4">
                <span className="text-lg">@{user.username}</span>
                <span className="flex items-center space-x-2  text-sm px-3 py-[1px] shadow bg-orange-400 text-white rounded-full font-semibold">
                  {user?.role}
                </span>
              </div>
              <Divider direction="vertical" className="mx-4" />
              <p className="flex items-center space-x-2 mt-4">
                <FaInfoCircle />
                <span>{user.bio}</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile;
