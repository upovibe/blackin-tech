import React, { useState, useEffect } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { fetchCountries, fetchLanguages } from "../../api/fetchStaticData";
import { getAllDocuments, getDocumentByID  } from "../../services/firestoreCRUD";
import { toLowerCase } from "../../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import SelectInput from "../common/SelectInput";
import TagInput from "../common/TagInput";
import AvatarUpload from "../common/AvatarUpload";
import CoverImageUpload from "../common/CoverImageUpload";
import Button from "../common/Button";
import { updateProfile } from "../../services/authService";
import Lottie from "lottie-react";
import SetUpProfile from "../../assets/animations/Animation - SettingUpProfile.json";
import successAnimation from "../../assets/animations/Animation - ProfileSuccess.json";
import Toast from "../common/Toast";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaCheckCircle,
} from "react-icons/fa";

const CompleteProfile = () => {
  const { user } = UserAuth(); // Get user from the context
  
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

  const [pronounsOptions, setPronounsOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animationClass, setAnimationClass] = useState(
    "opacity-0 translate-y-4"
  );

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const navigate = useNavigate();
  const userID = user?.uid;
  useEffect(() => {
    setAnimationClass("opacity-100 translate-y-0");
    const fetchData = async () => {
      try {
        // Fetch pronouns from Firestore
        const pronounsData = await getAllDocuments("pronouns");
        const formattedPronouns = pronounsData.map((pronoun) => ({
          label: pronoun.name,
          value: pronoun.slug,
        }));
        setPronounsOptions(formattedPronouns);

        // Fetch countries from the existing API
        const countriesData = await fetchCountries();
        setCountriesOptions(countriesData);

        // Fetch languages from the existing API
        const languagesData = await fetchLanguages();
        setLanguagesOptions(languagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "userName") {
      const alphanumericValue = value.replace(/[^a-zA-Z0-9_]/g, "");
      setFormValues((prev) => ({
        ...prev,
        [name]: alphanumericValue,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const validateStep = () => {
    switch (step) {
      case 1:
        return formValues.avatarUrl !== "";
      case 2:
        return formValues.coverImageUrl !== "";
      case 3:
        return formValues.userName !== "" && formValues.bio !== "";
      case 4:
        return formValues.pronouns !== "" && formValues.languages.length > 0;
      case 5:
        return formValues.country !== "" && formValues.city !== "";
      default:
        return false;
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setAnimationClass("opacity-0 translate-y-4");
      setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
        setAnimationClass("opacity-100 translate-y-0");
      }, 300);
    } else {
      setToastMessage("Please fill out all required fields.");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setAnimationClass("opacity-0 translate-y-4");
    setTimeout(() => {
      setStep((prevStep) => prevStep - 1);
      setAnimationClass("opacity-100 translate-y-0");
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValuesWithLowercaseUsername = {
        ...formValues,
        userName: toLowerCase(formValues.userName), // Convert username to lowercase
    };

    if (validateStep()) {
        try {
            const result = await updateProfile(formValuesWithLowercaseUsername);

            if (result.success) {
                setToastMessage("Profile updated successfully!");
                setToastType("success");
                setToastVisible(true);
                setIsSubmitted(true);
                
                // Navigate to the user's profile
                setTimeout(() => {
                    navigate(`/profile/${formValuesWithLowercaseUsername.userName}`);
                }, 3000);
            } else {
                setToastMessage("Failed to update profile.");
                setToastType("error");
                setToastVisible(true);
            }
        } catch (error) {
            setToastMessage("An error occurred.");
            setToastType("error");
            setToastVisible(true);
        }
    } else {
        setToastMessage("Please fill out all required fields.");
        setToastType("error");
        setToastVisible(true);
    }
};

  if (isSubmitted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie
          animationData={successAnimation}
          loop={false}
          className="w-48 h-48"
        />
      </div>
    );
  }

  return (
    <>
      <Toast
        type={toastType}
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <div className="flex flex-col items-center justify-start h-screen">
        <div className="p-4 w-full flex-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative size-full mx-auto md:w-6/12 lg:w-5/12 xl:w-4/12">
              <div
                className={`transition-all duration-300 ease-in-out transform ${animationClass}`}
              >
                {/* Step 1: Avatar Upload */}
                {step === 1 && (
                  <div className="space-y-10 text-center">
                    <span className="text-xl font-bold">
                      Tap to choose a photo
                    </span>
                    <AvatarUpload onUpload={handleAvatarUpload} />
                    <Button
                      iconLeft={<FaArrowAltCircleRight />}
                      onClick={nextStep}
                      className="w-full"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Step 2: Cover Image Upload */}
                {step === 2 && (
                  <div className="space-y-10 text-center">
                    <span className="text-xl font-bold">
                      Upload a cover image
                    </span>
                    <CoverImageUpload onUpload={handleCoverImageUpload} />
                    <div className="flex justify-between gap-5">
                      <Button
                        iconLeft={<FaArrowAltCircleLeft />}
                        onClick={prevStep}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        iconLeft={<FaArrowAltCircleRight />}
                        onClick={nextStep}
                        className="w-full"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Username and Bio */}
                {step === 3 && (
                  <div className="space-y-10 text-center">
                    <span className="text-xl font-bold">
                      Tell us more about your
                    </span>
                    <div className="space-y-5">
                      <Input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={formValues.userName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <TextArea
                        name="bio"
                        placeholder="Write your bio..."
                        value={formValues.bio}
                        onChange={handleInputChange}
                        className="w-full"
                      /> 
                      <Input
                      type="url"
                      name="link"
                      placeholder="Portfolio/Website Link"
                      value={formValues.link}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    </div>
                    <div className="flex justify-between gap-5">
                      <Button
                        iconLeft={<FaArrowAltCircleLeft />}
                        onClick={prevStep}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        iconLeft={<FaArrowAltCircleRight />}
                        onClick={nextStep}
                        className="w-full"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Pronouns and Languages */}
                {step === 4 && (
                  <div className="space-y-10 text-center">
                    <span className="text-xl font-bold">
                      What's your Pronouns and Language?
                    </span>
                    <div className="space-y-5">
                      <SelectInput
                        name="pronouns"
                        placeholder="Select Pronouns"
                        value={formValues.pronouns}
                        onChange={handleInputChange}
                        options={pronounsOptions} // Using the fetched options
                        className="w-full"
                      />
                      <TagInput
                        options={languagesOptions}
                        placeholder="Languages"
                        onChange={handleTagChange}
                        maxTags={5}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between gap-5">
                      <Button
                        iconLeft={<FaArrowAltCircleLeft />}
                        onClick={prevStep}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        iconLeft={<FaArrowAltCircleRight />}
                        onClick={nextStep}
                        className="w-full"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Country and City */}
                {step === 5 && (
                  <div className="space-y-10 text-center">
                    <span className="text-xl font-bold">Where from you?</span>
                    <div className="space-y-5">
                      <SelectInput
                        name="country"
                        placeholder="Select Country"
                        value={formValues.country}
                        onChange={handleInputChange}
                        options={countriesOptions.map((c) => ({
                          label: c,
                          value: c,
                        }))}
                        className="w-full"
                      />
                      <Input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formValues.city}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between gap-5">
                      <Button
                        iconLeft={<FaArrowAltCircleLeft />}
                        onClick={prevStep}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        iconRight={<FaCheckCircle />}
                        type="submit"
                        className="w-full"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="w-full md:h-2/4">
          <Lottie
            animationData={SetUpProfile}
            loop={true}
            className="w-full h-full mr-auto bg-[#fcfcfc]"
          />
        </div>
      </div>
    </>
  );
};

export default CompleteProfile;