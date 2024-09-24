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
  incrementProfileView,
  getProfileViewCount,
} from "../services/firestoreUsersManagement";
import { getDocumentByID } from "../services/firestoreCRUD.js";
import Lottie from "lottie-react";
import pageloading from "../assets/animations/Animation - LoadingPage.json";
import Modal from "../components/common/Modal";
import Tooltip from "../components/common/Tooltip";
import UserInsightsForm from "../components/auth/UserInsightsForm";
import ProfileProgress from "../components/auth/ProfileProgress";
import JobProfile from "../components/lists/JobProfile";
import Divider from "../components/common/Divider";
import TabComponent from "../components/common/TabComponent.jsx";
import DefaultCoverImage from "../assets/images/coverimage.jpg";
import DefaultAvatar from "../assets/images/avatar-default.png";
import {
  FaInfoCircle,
  FaLink,
  FaMapMarker,
  FaShare,
  FaUser,
} from "react-icons/fa";
import {
  FaArrowUpRightFromSquare,
  FaPencil,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa6";
import Toast from "../components/common/Toast";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
  FaMedium,
  FaTwitch,
  FaDiscord,
  FaEye,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

const socialMediaIcons = {
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  facebook: FaFacebook,
  instagram: FaInstagram,
  medium: FaMedium,
  twitch: FaTwitch,
  discord: FaDiscord,
  // Add more platforms as needed
};

function Profile() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [profileViews, setProfileViews] = useState(0);
  const [profileUser, setProfileUser] = useState(null);
  const [badge, setBadge] = useState(null);
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
          setBadge(profile.badge || {});
          // Fetch and update profile view count
          if (user.uid !== profile.id) {
            // Ensure the view count isn't incremented when the user views their own profile
            await incrementProfileView(profile.id);
          }

          // Fetch the profile view count
          const viewCount = await getProfileViewCount(profile.id);
          setProfileViews(viewCount); // Set profile views state (to be created)

          // Fetch current connections and update count
          const connectionList = await getConnectionsByUserId(profile.id);
          setConnections(
            new Set(connectionList.map((conn) => conn.connectedUserId))
          );
          setConnectionCount(connectionList.length);

          listenToConnectionCount(profile.id, setConnectionCount);

          const isConnected = await checkConnectionStatus(user.uid, profile.id);
          setConnections((prev) =>
            isConnected ? new Set(prev).add(profile.id) : prev
          );

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
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">
                          {profileUser.fullName || "Anonymous"}
                        </span>
                        {badge && badge.name && (
                          <Tooltip
                            position="top"
                            text={`${badge.name}: ${
                              badge.description || "Click to see more details"
                            }`}
                          >
                            <img
                              src={badge.icon}
                              alt={badge.name}
                              className="size-4 ilter drop-shadow-lg"
                            />
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <span className="font-semibold text-lg lowercase">
                          @{profileUser.userName || "Anonymous"}
                        </span>
                        &#183;
                        <span className="text-sm font-semibold underline">
                          {profileUser.pronouns}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {profileUser.professionalTitle && (
                        <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                          <FaInfoCircle />
                          <span>{profileUser.professionalTitle}</span>
                        </div>
                      )}
                      {(profileUser.country || profileUser.city) && (
                        <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                          <FaMapMarker />
                          <span>
                            {profileUser.country}&nbsp;{profileUser.city}
                          </span>
                        </div>
                      )}
                      {profileUser.link && (
                        <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                          <FaLink />
                          <a
                            href={profileUser.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profileUser.link}
                          </a>
                        </div>
                      )}
                    </div>
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
                {profileUser.bio && (
                  <>
                    <span className="flex items-baseline space-x-2 text-slate-800 font-semibold text-sm mr-auto">
                      <p>{profileUser.bio}</p>
                    </span>
                    <Divider direction="horizontal" className="opacity-50" />
                  </>
                )}

                {profileUser.skills && profileUser.skills.length > 0 && (
                  <>
                    <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                      <span>{profileUser.skills.join(" | ")}</span>
                    </div>
                    <Divider direction="horizontal" className="opacity-50" />
                  </>
                )}

                {profileUser.abilities && profileUser.abilities.length > 0 && (
                  <>
                    <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                      <span>{profileUser.abilities.join(" | ")}</span>
                    </div>
                    <Divider direction="horizontal" className="opacity-50" />
                  </>
                )}

                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <FaUserPlus/>Connections
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {connectionCount}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <FaEye/>Profile Views
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {profileViews}
                  </span>
                </div>
              </div>

              <>
                {profileUser.socialLinks &&
                  profileUser.socialLinks.length > 0 && (
                    <div className="rounded-xl border-2 border-slate-300/80 flex flex-col items-center gap-3 w-full overflow-hidden">
                      <div className="flex flex-col items-start w-full">
                        {profileUser.socialLinks.map((social, index) => {
                          const Icon =
                            socialMediaIcons[social.platform.toLowerCase()]; // Get the icon

                          return (
                            <div
                              key={index}
                              className="w-full hover:bg-slate-200 transition-all duration-300 ease-in-out"
                            >
                              <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" flex items-center justify-between text-slate-800 font-semibold border-b-2 p-2"
                              >
                                <div className="flex items-center gap-3 ">
                                  {Icon && <Icon className="" />}{" "}
                                  {/* Render icon if exists */}
                                  <span>{social.platform}</span>{" "}
                                  {/* Display platform name instead of URL */}
                                </div>
                                <FaArrowUpRightFromSquare />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </>

              <div className="flex items-center justify-between w-full">
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
