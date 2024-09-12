import React, { useState, useEffect } from "react";
import {
  fetchPronouns,
  fetchCountries,
  fetchLanguages,
} from "../../api/usersApi";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import SelectInput from "../common/SelectInput";
import TagInput from "../common/TagInput";
import AvatarUpload from "../common/AvatarUpload";
import Button from "../common/Button";
import { updateProfile } from "../../services/authService";
import Lottie from "lottie-react";
import successAnimation from "../../assets/animations/Animation - ProfileSuccess.json";

const CompleteProfile = () => {
  const [formValues, setFormValues] = useState({
    avatarUrl: "",
    userName: "",
    bio: "",
    pronouns: "",
    languages: [],
    country: "",
    city: "",
  });

  const [pronounsOptions, setPronounsOptions] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animationClass, setAnimationClass] = useState(
    "opacity-0 translate-y-4"
  );
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationClass("opacity-100 translate-y-0");
    const fetchData = async () => {
      try {
        const pronounsData = await fetchPronouns();
        setPronounsOptions(pronounsData);

        const countriesData = await fetchCountries();
        setCountriesOptions(countriesData);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formValues);
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setAnimationClass("opacity-0 translate-y-4"); // Set animation class for fade-out
    setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
      setAnimationClass("opacity-100 translate-y-0"); // Set animation class for fade-in
    }, 300); // Adjust timeout duration to match the transition duration
  };

  const prevStep = (e) => {
    e.preventDefault();
    setAnimationClass("opacity-0 translate-y-4"); // Set animation class for fade-out
    setTimeout(() => {
      setStep((prevStep) => prevStep - 1);
      setAnimationClass("opacity-100 translate-y-0"); // Set animation class for fade-in
    }, 300); // Adjust timeout duration to match the transition duration
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
    <div className="p-4 bg-gray-100 max-w-lg mx-auto h-auto sm:h-full rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Complete Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-hidden relative">
          <div
            className={`transition-all duration-300 ease-in-out transform ${animationClass}`}
          >
            {/* Step 1: Avatar Upload */}
            {step === 1 && (
              <div className="space-y-4">
                <AvatarUpload onUpload={handleAvatarUpload} />
                <Button onClick={nextStep} className="w-full sm:w-auto">
                  Next
                </Button>
              </div>
            )}

            {/* Step 2: Username and Bio */}
            {step === 2 && (
              <div className="space-y-4">
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
                <div className="flex justify-between">
                  <Button onClick={prevStep} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button onClick={nextStep} className="w-full sm:w-auto">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pronouns and Languages */}
            {step === 3 && (
              <div className="space-y-4">
                <SelectInput
                  name="pronouns"
                  placeholder="Select Pronouns"
                  value={formValues.pronouns}
                  onChange={handleInputChange}
                  options={pronounsOptions.map((p) => ({ label: p, value: p }))}
                  className="w-full"
                />
                <TagInput
                  options={languagesOptions}
                  placeholder="Languages"
                  onChange={handleTagChange}
                  maxTags={5}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <Button onClick={prevStep} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button onClick={nextStep} className="w-full sm:w-auto">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Country and City */}
            {step === 4 && (
              <div className="space-y-4">
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
                <div className="flex justify-between">
                  <Button onClick={prevStep} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
