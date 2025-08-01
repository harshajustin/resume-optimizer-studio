import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import JobTrackerPage from "@/components/JobTrackerPage";
import FindJobs from "@/components/FindJobs";
import ResumeManager from "@/components/ResumeManager";
import ScanHistory from "@/components/ScanHistory";
import SkillMatchResults from "@/components/SkillMatchResults";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showSkillMatchResults, setShowSkillMatchResults] = useState(false);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    setShowSkillMatchResults(false); // Reset results view when navigating
  };

  const handleNavigateToResults = () => {
    setShowSkillMatchResults(true);
  };

  const handleBackFromResults = () => {
    setShowSkillMatchResults(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <main className="flex-1 overflow-y-auto">
        {showSkillMatchResults ? (
          <SkillMatchResults onBack={handleBackFromResults} />
        ) : (
          <>
            {activeItem === "dashboard" && <Dashboard onNavigateToResults={handleNavigateToResults} />}
            {activeItem === "new-match" && <Dashboard onNavigateToResults={handleNavigateToResults} />}
            {activeItem === "new-scan" && <Dashboard onNavigateToResults={handleNavigateToResults} />}
            {activeItem === "job-tracker" && <JobTrackerPage />}
            {activeItem === "find-jobs" && <FindJobs />}
            {activeItem === "resume-manager" && <ResumeManager />}
            {activeItem === "match-history" && <ScanHistory />}
            {activeItem === "scan-history" && <ScanHistory />}
            {/* Other views can be added here */}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
