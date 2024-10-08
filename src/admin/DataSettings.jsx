import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import LoadingPage from "../assets/animations/Animation - LoadingPage.json";
import TabComponent from "../components/common/TabComponent";
import JobTypeTable from "../components/tables/JobTypeTable";
import JobAvailTable from "../components/tables/JobAvailTable";
import JobSkillsTable from "../components/tables/JobSkillsTable";
import JobAbilitiesTable from "../components/tables/JobAbilitiesTable";
import EduCategoriesTable from "../components/tables/EduCategoriesTable";
import PronounsTable from "../components/tables/PronounsTable";
import SubTypesTable from "../components/tables/SubTyoesTable";
import SubscriptionTable from "../components/tables/SubscriptionTable";
import BadgesTable from "../components/tables/BadgesTable";

const DataSettings = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const tabs = [
    {
      label: "SubType",
      content: (
        <div>
          <SubTypesTable />
        </div>
      ),
    },
    {
      label: "Badges",
      content: (
        <div>
          <BadgesTable />
        </div>
      ),
    },
    {
      label: "Subscriptions",
      content: (
        <div>
          <SubscriptionTable />
        </div>
      ),
    },
    {
      label: "Job Tpes",
      content: (
        <div>
          <JobTypeTable />
        </div>
      ),
    },
    {
      label: "Job Satus",
      content: (
        <div>
          <JobAvailTable />
        </div>
      ),
    },
    {
      label: "Job Skills",
      content: (
        <div>
          <JobSkillsTable />
        </div>
      ),
    },
    {
      label: "Job Abilities",
      content: (
        <div>
          <JobAbilitiesTable />
        </div>
      ),
    },
    {
      label: "Education Category",
      content: (
        <div>
          <EduCategoriesTable />
        </div>
      ),
    },
    {
      label: "Pronounce",
      content: (
        <div>
          <PronounsTable />
        </div>
      ),
    },
  ];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={LoadingPage} loop className="w-48 h-48" />
      </div>
    );
  }

  return (
    <>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <TabComponent
        tabs={tabs}
        defaultActiveTab="Job Tpes"
        onTabChange={() => {}}
      />
    </div>
    </>
  );
};

export default DataSettings;
