import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getConnections,
  saveConnection,
  removeConnection,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const UserProfileList = () => {
  const { user } = UserAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const connectionList = await getConnections(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.id)));

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter((profile) => profile.fullName);
        setProfiles(validProfiles);

        validProfiles.forEach((profile) => {
          listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleConnect = async (profileId, profile) => {
    if (user) {
      try {
        const fullName = profile.fullName || "Anonymous User";
        await saveConnection(user.uid, profileId, {
          fullName,
          avatarUrl: profile.avatarUrl,
        });
        setConnections(
          (prevConnections) => new Set([...prevConnections, profileId])
        );
        setToastMessage("Connected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error connecting user: ", error);
        setToastMessage("Failed to connect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleDisconnect = async (profileId) => {
    if (user) {
      try {
        await removeConnection(user.uid, profileId);
        setConnections((prevConnections) => {
          const updatedConnections = new Set(prevConnections);
          updatedConnections.delete(profileId);
          return updatedConnections;
        });
        setToastMessage("Disconnected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error disconnecting user: ", error);
        setToastMessage("Failed to disconnect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
          style={{ width: "180px", minHeight: "260px" }}
          onClick={() => handleProfileClick(profile.userName)}
        >
          <div
            className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-fulls"
            style={{
              backgroundImage:
                `url(${profile.coverImageUrl})` ||
                "https://via.placeholder.com/150",
            }}
          />
          <div className="flex flex-col flex-grow items-center justify-between relative">
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20">
              <img
                src={profile.avatarUrl || "https://via.placeholder.com/150"}
                alt={profile.fullName}
                className=""
              />
            </div>
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
              <div className="p-3 size-full text-center">
                <h3 className="text-center font-semibold truncate">
                  {profile.fullName}
                </h3>
                <p className="text-xm truncate">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                <div className="flex justify-center">
                  {user.uid === profile.id ? (
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={() => navigate(`/profile/${profile.userName}`)}
                    >
                      <FaEye />
                      View
                    </button>
                  ) : connections.has(profile.id) ? (
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(profile.id);
                      }}
                    >
                      <FaUserMinus /> Disconnect
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(profile.id, {
                          fullName: profile.fullName,
                          avatarUrl: profile.avatarUrl,
                        });
                      }}
                    >
                      <FaUserPlus /> Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Toast Notification */}
      <Toast
        role="alert"
        aria-live="assertive"
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default UserProfileList;
