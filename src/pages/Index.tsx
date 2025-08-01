import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import JobTrackerPage from "@/components/JobTrackerPage";
import FindJobs from "@/components/FindJobs";
import ResumeManager from "@/components/ResumeManager";
import ScanHistory from "@/components/ScanHistory";

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
        {activeItem === "resume-manager" && <ResumeManager />}
        {activeItem === "scan-history" && <ScanHistory />}
        {/* Other views can be added here */}
      </main>
    </div>
  );
};

export default Index;
