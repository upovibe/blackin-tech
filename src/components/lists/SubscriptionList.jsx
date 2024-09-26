import React, { useEffect, useState } from "react";
import { getAllDocuments } from "../../services/firestoreCRUD";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoadingStates, setButtonLoadingStates] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("info");

  // Badge colors array
  const badgeColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await getAllDocuments("subscriptions");
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubscribe = async (subscriptionId, title) => {
    setButtonLoadingStates((prev) => ({ ...prev, [subscriptionId]: true }));
    setToastMessage(`Subscribing to ${title}`);
    setToastType("info");
    setToastVisible(true);


    setTimeout(() => {
      setButtonLoadingStates((prev) => ({ ...prev, [subscriptionId]: false }));
    }, 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="subscription-list flex flex-wrap items-center justify-center mx-0">
      {subscriptions.length > 0 ? (
        subscriptions.map((sub, index) => (
          <div key={sub.id} className="subscription-item w-full lg:w-4/12 p-3">
            <div className="relative bg-gray-100 rounded-2xl shadow-lg flex flex-col items-center justify-center lg:h-[30rem] py-6 w-full">
              {/* Badge for New or Highlighted Plans */}
              <div className="absolute -top-3 ">
                {sub.badge && (
                  <span
                    className={`badge ${
                      badgeColors[index % badgeColors.length]
                    } text-white px-2 py-1 rounded-full text-xs font-semibold uppercase text-center shadow-lg`}
                  >
                    {sub.badge}
                  </span>
                )}
              </div>

              <div className="size-full flex flex-col items-center justify-between w-full gap-10">
                <div className="flex items-center flex-col w-full gap-2">
                  {/* Title */}
                  <h3 className="text-3xl font-bold mt-4 mb-2 text-slate-800 leading-tight w-full text-center">
                    {sub.title}
                  </h3>
                  <div className="flex items-end justify-center w-full">
                    <p className="text-4xl font-bold text-slate-800 leading-none">
                      {sub.price}
                    </p>
                    <span className="text-sm tex-slate-800 font-semibold">/month</span>
                  </div>
                </div>

                {/* Make the type full width */}
                <div className="w-full flex items-center justify-center bg-slate-800">
                  <p className="flex items-center justify-center text-white font-bold text-lg md:text-3xl p-3 leading-none w-full">
                    {sub.type}
                  </p>
                </div>

                {/* Key Features */}
                <div className="key-features text-slate-700 w-full">
                  <ul className="list-none flex-col flex items-start w-full px-6">
                    {sub.keyFeatures.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm mb-2 w-full"
                      >
                        <span className="text-slate-500 mr-2">✔</span>
                        <p>{feature.feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-between w-full">
                  {/* Subscribe Button */}
                  <button
                    className="mt-6 w-48 h-12 bg-slate-500 text-white rounded-full font-semibold hover:bg-slate-600 transition"
                    onClick={() => handleSubscribe(sub.id, sub.title)}
                    disabled={buttonLoadingStates[sub.id]}
                  >
                    {buttonLoadingStates[sub.id] ? (
                      <Lottie
                        animationData={loadingAnimation}
                        className="w-4 h-4 mx-auto"
                      />
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-results-found mt-6 flex flex-col items-center">
          <Lottie animationData={noDataAnimation} className="w-64 h-64" />
          <p className="text-slate-700">No subscriptions found</p>
        </div>
      )}

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

export default SubscriptionList;
