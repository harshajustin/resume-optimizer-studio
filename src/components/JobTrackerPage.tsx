import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, DragEvent } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  timeAgo: string;
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer';
}

const JobTrackerPage = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Financial Services Account Associate II",
      company: "FIS",
      location: "Greater Hyderabad Area",
      timeAgo: "1 day ago",
      status: "saved"
    },
    {
      id: "2",
      title: "Sr. Technical Architect - SCPO",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      status: "saved"
    },
    {
      id: "3",
      title: "Sr Technical Architect - (SCPO, Consulting)",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      status: "saved"
    }
  ]);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [draggedJob, setDraggedJob] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const savedJobs = jobs.filter(job => job.status === 'saved');
  const appliedJobs = jobs.filter(job => job.status === 'applied');
  const interviewJobs = jobs.filter(job => job.status === 'interview');
  const rejectedJobs = jobs.filter(job => job.status === 'rejected');
  const offerJobs = jobs.filter(job => job.status === 'offer');

  const handleAddCompany = () => {
    if (newCompanyName.trim()) {
      const newJob: Job = {
        id: Date.now().toString(),
        title: "IT Intern",
        company: newCompanyName,
        location: "Remote",
        timeAgo: "Just added",
        status: "saved"
      };
      setJobs([...jobs, newJob]);
      setNewCompanyName("");
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, jobId: string) => {
    setDraggedJob(jobId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, newStatus: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer') => {
    e.preventDefault();
    if (draggedJob) {
      setJobs(jobs.map(job => 
        job.id === draggedJob ? { ...job, status: newStatus } : job
      ));
      setDraggedJob(null);
    }
  };

  const JobCard = ({ job, isDraggable = false }: { job: Job; isDraggable?: boolean }) => (
    <Card 
      className={`mb-3 ${isDraggable ? 'cursor-move hover:shadow-md transition-shadow' : ''}`}
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && handleDragStart(e, job.id)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-1">{job.title}</h3>
        <p className="text-sm text-primary font-medium mb-1">{job.company}</p>
        <p className="text-xs text-muted-foreground mb-2">{job.location}</p>
        <p className="text-xs text-muted-foreground">{job.timeAgo}</p>
      </CardContent>
    </Card>
  );

  const DropZone = ({ 
    status, 
    title, 
    count, 
    description, 
    children 
  }: { 
    status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offer';
    title: string;
    count?: number;
    description: string;
    children: React.ReactNode;
  }) => {
    const getColumnStyles = (status: string) => {
      switch (status) {
        case 'saved':
          return 'bg-slate-50 border-slate-200';
        case 'applied':
          return 'bg-blue-50 border-blue-200';
        case 'interview':
          return 'bg-amber-50 border-amber-200';
        case 'rejected':
          return 'bg-red-50 border-red-200';
        case 'offer':
          return 'bg-green-50 border-green-200';
        default:
          return 'bg-background border-border';
      }
    };

    return (
      <div 
        className={`h-full border-2 border-dashed rounded-lg p-4 transition-colors ${
          getColumnStyles(status)
        } ${draggedJob ? 'border-primary/50 bg-primary/5' : ''}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          {count !== undefined && (
            <Badge variant="secondary" className="rounded-full">
              {count}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {description}
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Left Sidebar - Jobs Search and List */}
      <div className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-12' : 'w-[18rem]'
      }`}>
        {/* Collapse/Expand Button */}
        <div className="p-2 border-b border-border flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isSidebarCollapsed && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h1 className="text-2xl font-bold mb-1">Jobs</h1>
              <p className="text-sm text-muted-foreground mb-4">Discover and apply to jobs</p>
              
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search jobs by keyword" 
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for a city" 
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Date</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="link" className="text-sm p-0 h-auto text-primary">
                    Clear all
                  </Button>
                  <Button className="px-6">
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              
              {/* Find more jobs link */}
              <div className="p-4 border-t border-border">
                <Button 
                  variant="link" 
                  className="text-primary text-sm p-0 h-auto flex items-center gap-1"
                >
                  Find more jobs
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content - Job Tracker */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold">Job Tracker</h1>
        </div>

        {/* Main Content - Job Tracker */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 h-full" style={{ minWidth: '1500px' }}>
              {/* Saved Column */}
              <div className="flex-shrink-0 w-80">
                <DropZone
                  status="saved"
                  title="Saved"
                  count={savedJobs.length}
                  description="Jobs saved from our chrome extension or the scan report will appear here."
                >
                  {/* Add Company Section */}
                  <div className="bg-secondary border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-medium">LOW</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">IT Intern</p>
                        <p className="text-xs text-muted-foreground">Company Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add company name"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        className="text-sm flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                      />
                      <Button 
                        size="sm" 
                        onClick={handleAddCompany}
                        className="shrink-0"
                        variant="outline"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Saved Jobs */}
                  <div className="space-y-3">
                    {savedJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDraggable />
                    ))}
                  </div>
                </DropZone>
              </div>

              {/* Applied Column */}
              <div className="flex-shrink-0 w-80">
                <DropZone
                  status="applied"
                  title="Applied"
                  description="Application completed. Awaiting response from employer or recruiter."
                >
                  <div className="space-y-3">
                    {appliedJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDraggable />
                    ))}
                    {appliedJobs.length === 0 && (
                      <div className="flex items-center justify-center h-40 text-muted-foreground">
                        <p className="text-sm">No applications yet</p>
                      </div>
                    )}
                  </div>
                </DropZone>
              </div>

              {/* Interview Column */}
              <div className="flex-shrink-0 w-80">
                <DropZone
                  status="interview"
                  title="Interview"
                  description="Invited to interview? Record the interview date and notes here."
                >
                  <div className="space-y-3">
                    {interviewJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDraggable />
                    ))}
                    {interviewJobs.length === 0 && (
                      <div className="flex items-center justify-center h-40 text-muted-foreground">
                        <p className="text-sm">No interviews scheduled</p>
                      </div>
                    )}
                  </div>
                </DropZone>
              </div>

              {/* Rejected Column */}
              <div className="flex-shrink-0 w-80">
                <DropZone
                  status="rejected"
                  title="Rejected"
                  description="Applications that were not successful. Keep track for future reference."
                >
                  <div className="space-y-3">
                    {rejectedJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDraggable />
                    ))}
                    {rejectedJobs.length === 0 && (
                      <div className="flex items-center justify-center h-40 text-muted-foreground">
                        <p className="text-sm">No rejections yet</p>
                      </div>
                    )}
                  </div>
                </DropZone>
              </div>

              {/* Offer Column */}
              <div className="flex-shrink-0 w-80">
                <DropZone
                  status="offer"
                  title="Offer"
                  description="Interview completed. Waiting for offer from the company."
                >
                  <div className="space-y-3">
                    {offerJobs.map((job) => (
                      <JobCard key={job.id} job={job} isDraggable />
                    ))}
                    {offerJobs.length === 0 && (
                      <div className="flex items-center justify-center h-40 text-muted-foreground">
                        <p className="text-sm">No offers yet</p>
                      </div>
                    )}
                  </div>
                </DropZone>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrackerPage;