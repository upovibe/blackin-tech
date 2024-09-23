import React, { useState, useEffect } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import Input from "../common/Input";
import Button from "../common/Button";
import TextArea from "../common/TextArea";
import SelectInput from "../common/SelectInput";
import Toast from "../common/Toast";
import { createDocument, getDocumentByID, updateDocument, getAllDocuments } from "../../services/firestoreCRUD";
import { formatDate } from "../../utils/dateUtils";
import { useParams } from "react-router-dom";

const SubscriptionForm = () => {
  const { user } = UserAuth();
  const { subscriptionId } = useParams(); // Assuming you use a route like /subscription/:subscriptionId
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([{ feature: "" }]);
  const [badge, setBadge] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [subTypes, setSubTypes] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSubTypes = async () => {
      try {
        const subTypesSnapshot = await getAllDocuments("subTypes");
        setSubTypes(
          subTypesSnapshot.map((doc) => ({
            label: doc.type,
            value: doc.slug,
          }))
        );
      } catch (error) {
        console.error("Error fetching subTypes:", error);
      }
    };

    fetchSubTypes();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (subscriptionId) {
        setIsUpdating(true);
        try {
          const subscriptionData = await getDocumentByID("subscriptions", subscriptionId);
          if (subscriptionData) {
            setTitle(subscriptionData.title || "");
            setDescription(subscriptionData.description || "");
            setPrice(subscriptionData.price || "");
            setSelectedType(subscriptionData.type || "");
            setKeyFeatures(subscriptionData.keyFeatures || [{ feature: "" }]);
            setBadge(subscriptionData.badge || "");
          }
        } catch (error) {
          console.error("Error fetching subscription data:", error);
        }
      }
    };

    fetchSubscription();
  }, [subscriptionId]);

  const handleKeyFeatureChange = (index, e) => {
    const newKeyFeatures = [...keyFeatures];
    newKeyFeatures[index].feature = e.target.value;
    setKeyFeatures(newKeyFeatures);
  };

  const addKeyFeature = () => {
    setKeyFeatures([...keyFeatures, { feature: "" }]);
  };

  const removeKeyFeature = (index) => {
    if (keyFeatures.length > 1) {
      const newKeyFeatures = [...keyFeatures];
      newKeyFeatures.splice(index, 1);
      setKeyFeatures(newKeyFeatures);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !selectedType) {
      showToast("Please fill all required fields.", "error");
      return;
    }

    const timestamp = new Date();
    const formattedUpdatedAt = formatDate(timestamp);

    const subscriptionData = {
      title,
      description,
      price,
      type: selectedType,
      keyFeatures,
      badge,
      createdBy: {
        id: user.uid,
        avatarUrl: user.avatarUrl,
        fullName: user.fullName,
        email: user.email,
      },
      updatedAt: formattedUpdatedAt,
    };

    try {
      if (isUpdating && subscriptionId) {
        await updateDocument("subscriptions", subscriptionId, subscriptionData);
        showToast(`Subscription "${title}" updated successfully!`);
      } else {
        const formattedCreatedAt = formatDate(timestamp);
        subscriptionData.createdAt = formattedCreatedAt;
        await createDocument("subscriptions", subscriptionData);
        showToast(`Subscription "${title}" added successfully!`);
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedType("");
      setKeyFeatures([{ feature: "" }]);
      setBadge("");
    } catch (error) {
      console.error("Error saving subscription to Firestore:", error);
      showToast("Error saving subscription.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5 flex flex-col gap-3">
        <div className="w-full">
          <Input
            name="title"
            placeholder="Subscription Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="w-full px-1">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="flex items-center gap-3 justify-between">
          <div className="w-full">
            <Input
              name="price"
              placeholder="Subscription Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <SelectInput
              options={subTypes}
              placeholder="Select Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)} 
              required
            />
          </div>
        </div>
        <div>
          {keyFeatures.map((keyFeature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                name="keyFeature"
                placeholder="Key Feature"
                value={keyFeature.feature}
                onChange={(e) => handleKeyFeatureChange(index, e)}
              />
              <Button
                type="button"
                onClick={addKeyFeature}
                className="bg-blue-500 text-white"
              >
                +
              </Button>
              {keyFeatures.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeKeyFeature(index)}
                  className="bg-red-500 text-white"
                >
                  -
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="w-full">
          <Input
            name="badge"
            placeholder="Badge such as new, special etc"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="bg-green-500 text-white">
        {isUpdating ? "Update Subscription" : "Save Subscription"}
      </Button>

      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </form>
  );
};

export default SubscriptionForm;
