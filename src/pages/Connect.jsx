import React, { useState, useEffect } from "react";
import UserProfileList from "../components/lists/UserProfileList";
import UsersFilter from "../components/filters/UsersFilter";
import HorizontalLineWithText from "../components/common/HorizontalLineWithText";
import { getAllDocuments } from "../services/firestoreCRUD";
import { FaRotate, FaEyeSlash, FaEye } from "react-icons/fa6";
import Divider from "../components/common/Divider"

const Connect = () => {
  const [filterCriteria, setFilterCriteria] = useState({
    keyword: "",
    location: "",
    availability: "",
  });
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all profiles when component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await getAllDocuments("users");
      setAllProfiles(profiles); // Save the complete list of profiles
      setFilteredProfiles(profiles); // Initially show all profiles
    };

    fetchProfiles();
  }, []);

  // Apply filters to the profile list
  const applyFilters = (filters) => {
    setFilterCriteria(filters);

    const filtered = allProfiles.filter((profile) => {
      // Filter by keyword (search in title, skills, abilities)
      const keywordMatch =
        !filters.keyword ||
        profile.professionalTitle
          ?.toLowerCase()
          .includes(filters.keyword.toLowerCase()) ||
        profile.skills?.some((skill) =>
          skill.toLowerCase().includes(filters.keyword.toLowerCase())
        ) ||
        profile.abilities?.some((ability) =>
          ability.toLowerCase().includes(filters.keyword.toLowerCase())
        );

      // Filter by location
      const locationMatch =
        !filters.location || profile.location === filters.location;

      // Filter by availability
      const availabilityMatch =
        !filters.availability || profile.availability === filters.availability;

      return keywordMatch && locationMatch && availabilityMatch;
    });

    setFilteredProfiles(filtered);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <main className="min-h-screen">
      <section className="flex justify-center items-center pb-10 p-2">
        <div className="container pt-16">
          <div className="flex flex-col space-y-6 items-center justify-center px-0 md:px-20 lg:px-40 xl:px-60">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center font-serif">
              Find Tech Professionals
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto">
              Connect with skilled Black professionals in tech. Whether you need
              software developers, data scientists, or cybersecurity experts,
              BlackInTech links you with diverse talent across Germany. Build
              powerful connections that drive innovation.
            </p>
          </div>
        </div>
      </section>
      {/* Filter Section with Transition */}
      <section className="flex justify-center items-center pb-10 p-2">
        <div className="container w-full flex-col items-center">
          <div className="flex items-center justify-between">
            <div className="size-fit">
              <button
                onClick={() => setShowFilters(!showFilters)} // Toggle the filter visibility
                className="flex items-center space-x-2 px-4 py-2 border rounded-full text-sm font-sm transition-all duration-300"
              >
                <span className="flex items-center">
                  {showFilters ? (
                    <FaEyeSlash className="mr-2" />
                  ) : (
                    <FaEye className="mr-2" />
                  )}
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
              </button>
            </div>
            <div>
              <button
                className="flex items-center space-x-2 px-4 py-2 border rounded-full text-sm font-sm transition-all duration-300"
                onClick={handleRefresh}
              >
                <FaRotate />
                <span>Refresh</span>
              </button>
            </div>
          </div>          
          <Divider className="bg-slate-600/15 my-5"/>
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              showFilters
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="w-full mb-6 ">
              <UsersFilter onFilterChange={applyFilters} />
            </div>
          </div>
          <div className="w-full flex items-center justify-center py-10">
            <UserProfileList
              profiles={filteredProfiles}
              keywords={filterCriteria.keyword}
              selectedAvailability={filterCriteria.availability}
              selectedLocation={filterCriteria.location}
              key={refreshKey}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Connect;
