import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, ExternalLink } from "lucide-react";

const JobTrackerPage = () => {
  const jobs = [
    {
      title: "Financial Services Account Associate II",
      company: "FIS",
      location: "Greater Hyderabad Area",
      timeAgo: "1 day ago"
    },
    {
      title: "Sr. Technical Architect - SCPO",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago"
    },
    {
      title: "Sr Technical Architect - (SCPO , Consulting)",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago"
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Jobs Search */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Jobs</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm">←</span>
              <span className="text-sm">|</span>
            </div>
          </div>
          
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
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="link" className="text-sm p-0 h-auto">
                Clear all
              </Button>
              <Button className="px-8">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {jobs.map((job, index) => (
            <Card key={index} className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm leading-tight">{job.title}</h3>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {job.timeAgo}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="link" className="text-primary text-sm flex items-center space-x-1">
            <span>Find more jobs</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main Content - Job Tracker */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Job Tracker</h1>
        </div>

        <div className="grid grid-cols-3 gap-6 h-full">
          {/* Saved Column */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Saved</h2>
              <p className="text-sm text-muted-foreground">
                Jobs saved from our chrome extension or the scan report will appear here.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground">No saved jobs yet</p>
              </div>
            </div>
          </div>

          {/* Applied Column */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Applied</h2>
              <p className="text-sm text-muted-foreground">
                Application completed. Awaiting response from employer or recruiter.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground">No applications yet</p>
              </div>
            </div>
          </div>

          {/* Interview Column */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Interview</h2>
              <p className="text-sm text-muted-foreground">
                Invited to interview? Record the interview details and notes here.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground">No interviews scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrackerPage;