import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import {
  getUserByUsername,
  addConnection,
  removeConnection,
  getConnectionsByUserId,
  listenToConnectionCount,
  checkConnectionStatus,
  listenToConnectionStatus,
} from "../services/firestoreUsersManagement";
import Lottie from "lottie-react";
import pageloading from "../assets/animations/Animation - LoadingPage.json";
import Modal from "../components/common/Modal";
import UserInsightsForm from "../components/auth/UserInsightsForm";
import ProfileProgress from "../components/auth/ProfileProgress";
import JobProfile from "../components/lists/JobProfile";
import Divider from "../components/common/Divider";
import TabComponent from "../components/common/TabComponent.jsx";
import DefaultCoverImage from "../assets/images/coverimage.jpg";
import DefaultAvatar from "../assets/images/avatar-default.png";
import { FaInfoCircle, FaMapMarker, FaUser } from "react-icons/fa";
import { FaPencil, FaUserMinus, FaUserPlus } from "react-icons/fa6";
import Toast from "../components/common/Toast";

function Profile() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connections, setConnections] = useState(new Set());
  const [connectionCount, setConnectionCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userName) {
        console.error("Username is undefined");
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserByUsername(userName);
        if (profile) {
          setProfileUser(profile);
          // Fetch current connections and update count
          const connectionList = await getConnectionsByUserId(profile.id);
          setConnections(
            new Set(connectionList.map((conn) => conn.connectedUserId))
          );
          setConnectionCount(connectionList.length);

          // Set up listeners for real-time updates
          listenToConnectionCount(profile.id, setConnectionCount);

          // Check initial connection status
          const isConnected = await checkConnectionStatus(user.uid, profile.id);
          setConnections((prev) =>
            isConnected ? new Set(prev).add(profile.id) : prev
          );

          // Listen to connection status in real-time
          listenToConnectionStatus(user.uid, profile.id, (isConnected) => {
            setConnections((prev) => {
              const updatedConnections = new Set(prev);
              if (isConnected) {
                updatedConnections.add(profile.id);
              } else {
                updatedConnections.delete(profile.id);
              }
              return updatedConnections;
            });
          });
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userName]);

  const handleConnect = async () => {
    setIsConnecting(true); // Start loading
    try {
      await addConnection(
        user.uid,
        profileUser.id,
        profileUser.avatarUrl,
        profileUser.fullName
      );
      setConnections(
        (prevConnections) => new Set([...prevConnections, profileUser.id])
      );
      setToastMessage("Connected successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error connecting.");
      setToastType("error");
    } finally {
      setIsConnecting(false); // End loading
      setToastVisible(true);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true); // Start loading
    try {
      await removeConnection(user.uid, profileUser.id);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileUser.id);
        return updatedConnections;
      });
      setToastMessage("Disconnected successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error disconnecting.");
      setToastType("error");
    } finally {
      setIsDisconnecting(false); // End loading
      setToastVisible(true);
    }
  };

  const handleNavigateToSettings = () => {
    navigate(`/settings`);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Lottie animationData={pageloading} loop={true} className="w-48 h-48" />
      </div>
    );
  }

  if (!profileUser) {
    return <p>User not found</p>;
  }

  const tabs = [
    profileUser.role === "admin" && {
      label: "Posted",
      content: <JobProfile tab="Posted" />,
    },
    { label: "Applied", content: <JobProfile tab="Applied" /> },
    { label: "Saved", content: <JobProfile tab="Saved" /> },
  ].filter(Boolean);

  return (
    <main>
      <section className="w-screen flex flex-col items-center justify-center">
        <div className="w-full h-64 bg-gray-200 relative">
          <img
            src={profileUser.coverImageUrl || DefaultCoverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container flex items-start flex-col lg:flex-row p-0 px-2 md:py-2 gap-5 lg:gap-10">
          <div className="flex items-center flex-col gap-2 mb-4 w-full lg:w-3/6 xl:w-2/6 transform -translate-y-16">
            <div className="flex items-center flex-col gap-5 w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start lg:items-start flex-col gap-1 w-1/2">
                  <div className="relative flex flex-col items-center justify-center">
                    <img
                      src={profileUser.avatarUrl || DefaultAvatar}
                      alt="User Avatar"
                      className="w-28 h-28 rounded-full border-2 border-opacity-20 border-white"
                    />
                    {profileUser.role === "admin" && (
                      <span className="absolute bottom-0 text-sm px-3 py-[1px] shadow bg-orange-400 text-white rounded-full font-semibold w-max">
                        {profileUser.role}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-wrap">
                    {profileUser.fullName || "Anonymous"}
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-semibold text-lg lowercase">
                      @{profileUser.userName}
                    </span>
                    &#183;
                    <span className="text-sm font-semibold underline">
                      {profileUser.pronouns}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end md:w-1/2 ml-auto mt-5 gap-1 transform translate-y-12">
                  {user.userName === profileUser.userName ? (
                    <button
                      onClick={handleNavigateToSettings}
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                    >
                      <FaPencil /> Edit
                    </button>
                  ) : (
                    <>
                      {connections.has(profileUser.id) ? (
                        <button
                          className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                          onClick={handleDisconnect}
                          disabled={isDisconnecting} // Disable button while loading
                        >
                          <FaUserMinus />{" "}
                          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                        </button>
                      ) : (
                        <button
                          className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                          onClick={handleConnect}
                          disabled={isConnecting} // Disable button while loading
                        >
                          <FaUserPlus />
                          {isConnecting ? "Connecting..." : "Connect"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-300/80 p-3 flex flex-col items-center gap-3 w-full">
                <span className="flex items-baseline space-x-2 text-slate-800 font-semibold text-sm mr-auto">
                  <FaInfoCircle />
                  <p>{profileUser.bio}</p>
                </span>
                <Divider direction="horizontal" className="opacity-50" />
                <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                  <FaMapMarker />
                  <span>
                    {profileUser.country}&nbsp;{profileUser.city}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-800">
                    Connections: {connectionCount}
                  </span>
                </div>
                {user.userName === profileUser.userName && <ProfileProgress />}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col gap-2 mb-4 rounded-xl size-full border-slate-300/80 p-3">
            <div className="size-full">
              <TabComponent
                tabs={tabs}
                defaultActiveTab="Saved"
                onTabChange={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Your Insights"
        className="h-screen"
      >
        <UserInsightsForm />
      </Modal>

      {toastVisible && (
        <Toast
          role="alert"
          aria-live="assertive"
          visible={toastVisible}
          type={toastType}
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}
    </main>
  );
}

export default Profile;
