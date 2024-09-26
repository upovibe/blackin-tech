import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addConnection,
  removeConnection,
  getConnectionsByUserId,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { truncateText } from "../../utils/truncate";
import { getAllDocuments, getDocumentByID } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import Tooltip from "../common/Tooltip";
import DefaultCoverImage from "../../assets/images/placeholder-image.png";
import DefaultAvatar from "../../assets/images/placeholder-image.png";
import {
  FaUserPlus,
  FaUserMinus,
  FaEye,
  FaTimes,
} from "react-icons/fa";

const UserProfileList = ({
  profiles,
  keywords,
  selectedAvailability,
  selectedLocation,
}) => {
  const { user } = UserAuth();
  const [badge, setBadge] = useState(null);
  const [profileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const navigate = useNavigate();

  // Fetch profiles and listen for real-time connection counts
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const connectionList = await getConnectionsByUserId(user.uid);
        setConnections(
          new Set(connectionList.map((conn) => conn.connectedUserId))
        );

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter(
          (profile) => profile.fullName && profile.id !== user.uid
        );


        const shuffledProfiles = validProfiles.sort(() => Math.random() - 0.5);

        // Fetch the badges for each profile
        const profilesWithBadges = await Promise.all(
          shuffledProfiles.map(async (profile) => {
            if (profile.badgeId) {
              const badge = await getDocumentByID("badges", profile.badgeId);
              return { ...profile, badge }; 
            }
            return profile;
          })
        );

        setProfileList(profilesWithBadges);

        // Set up real-time listener for connection counts
        profilesWithBadges.forEach((profile) => {
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

  const handleRemove = (profileId) => {
    setRemovedProfiles((prevRemoved) => new Set([...prevRemoved, profileId]));
  };

  const handleConnect = async (profileId, profile) => {
    setIsConnecting(true);
    try {
      await addConnection(
        user.uid,
        profileId,
        profile.avatarUrl,
        profile.fullName
      );
      setConnections((prevConnections) =>
        new Set(prevConnections).add(profileId)
      );
      setToastMessage("Connection added successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error adding connection.");
      setToastType("error");
    } finally {
      setIsConnecting(false);
      setToastVisible(true);
    }
  };

  const handleDisconnect = async (profileId) => {
    setIsDisconnecting(true);
    try {
      await removeConnection(user.uid, profileId);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileId);
        return updatedConnections;
      });
      setToastMessage("Connection removed successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error removing connection.");
      setToastType("error");
    } finally {
      setIsDisconnecting(false);
      setToastVisible(true);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  // Filter profiles based on keywords, availability, and location
  const filteredProfiles = profileList.filter((profile) => {
    const keywordMatch = keywords
      ? profile.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
        profile.professionalTitle
          ?.toLowerCase()
          .includes(keywords.toLowerCase()) ||
        profile.skills?.some((skill) =>
          skill.toLowerCase().includes(keywords.toLowerCase())
        )
      : true;

    const availabilityMatch = selectedAvailability
      ? profile.availability === selectedAvailability
      : true;

    const locationMatch = selectedLocation
      ? profile.location?.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    return (
      keywordMatch &&
      availabilityMatch &&
      locationMatch &&
      !removedProfiles.has(profile.id)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (filteredProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
      {filteredProfiles.map((profile) => (
        <div
          key={profile.id}
          className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
          style={{ width: "180px", minHeight: "260px" }}
          onClick={() => handleProfileClick(profile.userName)}
        >
          <div className="relative">
            <div
              className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full z-"
              style={{
                backgroundImage: `url(${
                  profile.coverImageUrl || DefaultAvatar
                })`,
              }}
            />
            <button
              className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full transition-all duration-200 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(profile.id);
              }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col flex-grow items-center justify-between relative">
            <div className="-translate-y-9 p-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full transition-all duration-300 ease-linear group hover:bg-gradient-to-r hover:from-green-400 hover:via-blue-500 hover:to-purple-600 h-1/6 min-h-20 min-w-20 rounded-full overflow-hidden">
              <img
                src={profile.avatarUrl || DefaultCoverImage}
                alt={profile.fullName}
                className="rounded-full size-20 min-h-20 min-w-20"
              />
            </div>

            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full">
              <div className="p-3 size-full text-center">
                <div className="flex items-center justify-center gap-1">
                <h3 className="text-center capitalize font-semibold truncate mt-3">
                  {profile.fullName}
                </h3>
                {profile.badge && profile.badge.icon && (
                  <Tooltip
                    position="top"
                    text={`${profile.badge.name || "Badge"}: ${
                      profile.badge.description || "No description available"
                    }`}
                  >
                    <img
                      src={profile.badge.icon}
                      alt={profile.badge.name || "Badge icon"}
                      className="size-4 min-h-4 min-w-4 ilter drop-shadow-lg mt-3"
                    />
                  </Tooltip>
                )}
                </div>                

                <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                  {profile.professionalTitle && (
                    <>
                      <span className="text-sm truncate">
                        {profile.professionalTitle}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-slate-500">
                  {truncateText((profile.skills || []).join(" | "), 100)}
                </p>
              </div>

              <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                <div className="flex justify-center">
                  {user.uid === profile.id ? (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={() => navigate(`/profile/${profile.userName}`)}
                    >
                      <FaEye />
                      View
                    </button>
                  ) : connections.has(profile.id) ? (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(profile.id);
                      }}
                      disabled={isDisconnecting}
                    >
                      <FaUserMinus />{" "}
                      {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(profile.id, {
                          fullName: profile.fullName,
                          avatarUrl: profile.avatarUrl,
                        });
                      }}
                      disabled={isConnecting}
                    >
                      <FaUserPlus />{" "}
                      {isConnecting ? "Connecting..." : "Connect"}
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
