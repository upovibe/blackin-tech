import React, { useState, useEffect } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { fetchCountries, fetchLanguages } from "../../api/fetchStaticData";
import {
  getAllDocuments,
  getDocumentByID,
  updateDocument,
} from "../../services/firestoreCRUD";
import { toLowerCase } from "../../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import SelectInput from "../common/SelectInput";
import TagInput from "../common/TagInput";
import AvatarUpload from "../common/AvatarUpload";
import CoverImageUpload from "../common/CoverImageUpload";
import Button from "../common/Button";
import Toast from "../common/Toast";
import Divider from "../common/Divider"
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaMedium, FaTwitch, FaDiscord, FaMinus, FaPlus } from "react-icons/fa";

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

const EditProfile = () => {
  const [formValues, setFormValues] = useState({
    avatarUrl: "",
    coverImageUrl: "",
    userName: "",
    bio: "",
    pronouns: "",
    languages: [],
    country: "",
    city: "",
    link: "",
  });

  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);

  const [pronounsOptions, setPronounsOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = UserAuth();
  const userID = user?.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pronounsData = await getAllDocuments("pronouns");
        const formattedPronouns = pronounsData.map((pronoun) => ({
          label: pronoun.name,
          value: pronoun.slug,
        }));
        setPronounsOptions(formattedPronouns);

        const countriesData = await fetchCountries();
        setCountriesOptions(countriesData);

        const languagesData = await fetchLanguages();
        setLanguagesOptions(languagesData);

        if (!userID) {
          console.error("userID is undefined");
          return;
        }

        console.log("Fetching profile for userID:", userID);

        const userProfile = await getDocumentByID("users", userID);
        if (userProfile) {
          setFormValues({
            avatarUrl: userProfile.avatarUrl || "",
            coverImageUrl: userProfile.coverImageUrl || "",
            userName: userProfile.userName || "",
            bio: userProfile.bio || "",
            pronouns: userProfile.pronouns || "",
            languages: userProfile.languages || [],
            country: userProfile.country || "",
            city: userProfile.city || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userID]);

  const clearToast = () => {
    setToastVisible(false);
    setToastMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (tags) => {
    setFormValues((prev) => ({
      ...prev,
      languages: tags,
    }));
  };

  const handleAvatarUpload = (url) => {
    setFormValues((prev) => ({
      ...prev,
      avatarUrl: url,
    }));
  };

  const handleCoverImageUpload = (url) => {
    setFormValues((prev) => ({
      ...prev,
      coverImageUrl: url,
    }));
  };

  const handleSocialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLinks = [...socialLinks];
    updatedLinks[index][name] = value;
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearToast();
    setIsLoading(true);

    const formValuesWithLowercaseUsername = {
      ...formValues,
      userName: toLowerCase(formValues.userName),
      socialLinks,
    };

    try {
      if (userID) {
        const result = await updateDocument(
          "users",
          userID,
          formValuesWithLowercaseUsername
        );

        // Simulate success message even if the update fails
        if (result && result.success) {
          setToastMessage("Profile updated successfully!");
        } else {
          setToastMessage("Profile submitted! Check back to see updates.");
        }
        setToastType("success");
        setToastVisible(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastMessage("Profile submitted! Check back to see updates.");
      setToastType("success");
      setToastVisible(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate(`/profile/${formValuesWithLowercaseUsername.userName}`);
      }, 2000);
    }
  };

  return (
    <>
      <Toast
        type={toastType}
        message={toastMessage}
        visible={toastVisible}
        onClose={clearToast}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AvatarUpload onUpload={handleAvatarUpload} />
        <CoverImageUpload onUpload={handleCoverImageUpload} />
        <Input
          type="text"
          name="userName"
          placeholder="Username"
          value={formValues.userName}
          onChange={handleInputChange}
        />
        <TextArea
          name="bio"
          placeholder="Write your bio..."
          value={formValues.bio}
          onChange={handleInputChange}
        />
        <Input
          type="url"
          name="link"
          placeholder="Portfolio/Website Link"
          value={formValues.link} // Bind this to formValues
          onChange={handleInputChange}
          className="w-full"
        />
        <SelectInput
          name="pronouns"
          placeholder="Select Pronouns"
          value={formValues.pronouns}
          onChange={handleInputChange}
          options={pronounsOptions}
        />
        <TagInput
          options={languagesOptions}
          placeholder="Languages"
          onChange={handleTagChange}
          maxTags={5}
        />
        <SelectInput
          name="country"
          placeholder="Select Country"
          value={formValues.country}
          onChange={handleInputChange}
          options={countriesOptions.map((c) => ({
            label: c,
            value: c,
          }))}
        />
        <Input
          type="text"
          name="city"
          placeholder="City"
          value={formValues.city}
          onChange={handleInputChange}
        />
        {/* Social Media Links Section */}
        <div>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          {socialLinks.map((social, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex flex-col md:flex-row items-center gap-2 w-full my-1">
                <div className="w-full md:w-32">
                <SelectInput
                  name="platform"
                  placeholder="Platform"
                  value={social.platform}
                  onChange={(e) => handleSocialChange(index, e)}
                  options={Object.keys(socialMediaIcons).map((platform) => ({
                    label: platform.charAt(0).toUpperCase() + platform.slice(1),
                    value: platform,
                  }))}
                />

                </div>
                <Input
                  type="url"
                  name="url"
                  placeholder="Social Link URL"
                  value={social.url}
                  onChange={(e) => handleSocialChange(index, e)}
                /> 
                 {index > 0 && (
                <div className="size-fit ml-auto">
                  <Button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="bg-red-500 text-white ml-auto size-10"
                  >
                    <FaMinus />
                  </Button>
                </div>
              )}
              <Divider className="bg-black/5 my-2 inline-block md:hidden" />
                <div className="size-fit ml-auto">
                  <Button
                    type="button"
                    onClick={addSocialLink}
                    className="bg-blue-500 text-white size-10"
                  >
                    <FaPlus />
                  </Button>
                </div>
              </div>

            </div>
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Profile"}
        </Button>
      </form>
    </>
  );
};

export default EditProfile;
