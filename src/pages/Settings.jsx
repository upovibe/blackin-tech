import TabComponent from "../components/common/TabComponent";
import UserInsightsForm from "../components/auth/UserInsightsForm";

const SettingsPage = () => {
  const tabs = [
    {
      label: "Profile",
      content: <div>Your Profile settings go here...</div>,
    },
    {
      label: "Account",
      content: (
        <div>
          <UserInsightsForm />
        </div>
      ),
    },
    {
      label: "Security",
      content: <div>Your Security settings go here...</div>,
    },
  ];

  return (
    <main>
      <section className="flex items-center justify-center">
        <div className="container">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <TabComponent
              tabs={tabs}
              defaultActiveTab="Profile"
              orientation="vertical"
              onTabChange={(activeTab) =>
                console.log("Active Tab: ", activeTab)
              } // Optional callback
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
