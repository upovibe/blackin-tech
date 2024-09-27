import React, { useState } from "react";

// Tab Component
const TabComponent = ({ tabs, defaultActiveTab, onTabChange, orientation = "horizontal" }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0].label);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className={`w-full ${orientation === "vertical" ? "md:flex" : ""}`}>
      {/* Tabs */}
      <div
        className={`${
          orientation === "horizontal"
            ? "flex w-full border-b border-gray-300"
            : "flex md:flex-col w-full md:w-1/4 md:gap-3 border-r items-start border-gray-300 md:pr-10 m-0 mb-5 md:mr-10"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`${
              orientation === "horizontal"
                ? "w-full px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors duration-200"
                : "w-full px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors duration-200 text-center md:text-left"
            } transition-colors duration-200 ${
              activeTab === tab.label
                ? "text-slate-700 bg-gray-200 border-b-2 border-black/50"
                : "text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {orientation === "vertical" && (
        <div className="w-full"> 
          {tabs.map((tab) =>
            activeTab === tab.label ? (
              <div key={tab.label} className="w-full transition-opacity duration-200 flex-row">
                {tab.content}
              </div>
            ) : null
          )}
        </div>
      )}

      {orientation === "horizontal" && (
        <div className="py-4 w-full">
          {tabs.map((tab) =>
            activeTab === tab.label ? (
              <div key={tab.label} className="w-full transition-opacity duration-200">
                {tab.content}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default TabComponent;
