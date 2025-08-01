import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import JobTrackerPage from "@/components/JobTrackerPage";
import FindJobs from "@/components/FindJobs";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <main className="flex-1 overflow-y-auto">
        {activeItem === "dashboard" && <Dashboard />}
        {activeItem === "new-scan" && <Dashboard />}
        {activeItem === "job-tracker" && <JobTrackerPage />}
        {activeItem === "find-jobs" && <FindJobs />}
        {/* Other views can be added here */}
      </main>
    </div>
  );
};

export default Index;
