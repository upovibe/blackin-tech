import TabComponent from "../components/common/TabComponent";
import EditProfile from "../components/edit/EditProfile";
import UserInsightsForm from "../components/auth/UserInsightsForm";

const SettingsPage = () => {
  const tabs = [
    {
      label: "Basic Info",
      content: (
        <div>
          <EditProfile />
        </div>
      ),
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
      <section className="flex items-center justify-center p-2">
        <div className="container w-full xl:w-8/12">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <TabComponent
              tabs={tabs}
              defaultActiveTab="Profile"
              orientation="vertical"
              onTabChange={(activeTab) =>
                console.log("Active Tab: ", activeTab)
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
