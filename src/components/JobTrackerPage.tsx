import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, Bookmark, Heart } from "lucide-react";
import { useState } from "react";

const JobTrackerPage = () => {
  const [selectedJob, setSelectedJob] = useState(0);

  const jobs = [
    {
      id: 1,
      title: "Financial Services Account Associate II",
      company: "FIS",
      location: "Greater Hyderabad Area",
      timeAgo: "1 day ago",
      type: "Full-time",
      description: "Are you curious, motivated, and forward-thinking? At FIS, you'll have the opportunity to work on some of the most challenging and relevant issues in financial services and technology. Our talented people empower us, and we believe in being part of a team that is open, collaborative, entrepreneurial, passionate and above all fun.",
      aboutTeam: "The Transfer Agency is a division responsible for Transaction Operations, Processing and associated functions of mutual funds for various clients.",
      responsibilities: [
        "Verifying and processing customer requests to ensure information is correct and in good order, and takes appropriate action",
        "Performing quality control activities to ensure quality standards are met",
        "Producing template email or written correspondence to customers, when appropriate",
        "Adhering to all policies & procedure guidelines and divisional operational metrics/standards to achieve operational, productivity and quality",
        "Adhering to all front/company policies and regulatory controls/requirement",
        "Identifying improvement opportunities to streamline business processes resulting in greater efficiencies, productivity and/or service",
        "Providing backup support to other areas within the unit when required",
        "Excellent customer service skills that build high levels of customer satisfaction",
        "Strong phone, verbal and written communication skills, along with active listening",
        "Customer focus and adaptability to different personality types",
        "Demonstrating effective people skills and sensitivities when dealing with others",
        "Ability to work both independently and in a team environment"
      ],
      requirements: [
        "1 to 3 Years of experience from Mutual fund and transfer agency process or Finance",
        "Shift time - 5:30 PM to 6:30 AM",
        "Ready to work in night shifts (5 days in a week)",
        "Hybrid model - 3 days in a week",
        "Excellent communication and interpersonal skills",
        "Excellent knowledge of Customer Services, Global mindset (Desirable)"
      ],
      benefits: [
        "A voice in the future of fintech",
        "Always-on learning and development",
        "Collaborative work environment",
        "Opportunities to give back",
        "Competitive salary and benefits"
      ]
    },
    {
      id: 2,
      title: "Sr. Technical Architect - SCPO",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Sr Technical Architect - (SCPO, Consulting)",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 4,
      title: "Program Manager, Last Mile Analytics and Quality",
      company: "Amazon",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 5,
      title: "Sr Analyst - Retail",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 6,
      title: "Sr Business Analyst - Sales Support",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 7,
      title: "Data Center Technicians",
      company: "Microsoft",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 8,
      title: "Support Lead - PL/SQL, Unix Shell scripting & Monitoring",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 9,
      title: "Software Engineer II",
      company: "Microsoft",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      id: 10,
      title: "Technical Architect - BY SCPO/BY Demand & Fulfillment, Enterprise Sales Planning, Inventory Optimization, S&OP",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    }
  ];

  const selectedJobData = jobs[selectedJob];

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Jobs Search and List */}
      <div className="w-96 border-r border-border bg-card flex flex-col">
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
          {jobs.map((job, index) => (
            <div 
              key={job.id} 
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedJob === index ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedJob(index)}
            >
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
            </div>
          ))}
          
          {/* Pagination */}
          <div className="p-4 flex justify-center items-center space-x-2">
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">1</Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">2</Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">3</Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">→</Button>
          </div>
        </div>
      </div>

      {/* Main Content - Job Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedJobData && (
          <div className="p-6">
            {/* Job Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{selectedJobData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedJobData.location}
                </span>
                <span>{selectedJobData.type}</span>
              </div>
              
              <div className="flex gap-2">
                <Button className="px-6">Scan</Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save Job
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Apply
                </Button>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-6">
              {/* Position Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Position Type</h3>
                  <p className="text-sm">{selectedJobData.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Type Of Hire</h3>
                  <p className="text-sm">Experienced (relevant combo of work and education)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Education Desired</h3>
                  <p className="text-sm">Bachelor's Degree</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Travel Percentage</h3>
                  <p className="text-sm">0%</p>
                </div>
              </div>

              {/* Job Description */}
              {selectedJobData.description && (
                <div>
                  <h3 className="font-semibold mb-3">Job Description</h3>
                  <p className="text-sm leading-relaxed mb-4">{selectedJobData.description}</p>
                </div>
              )}

              {/* About The Team */}
              {selectedJobData.aboutTeam && (
                <div>
                  <h3 className="font-semibold mb-3">About The Team</h3>
                  <p className="text-sm leading-relaxed">{selectedJobData.aboutTeam}</p>
                </div>
              )}

              {/* What You Will Be Doing */}
              {selectedJobData.responsibilities && (
                <div>
                  <h3 className="font-semibold mb-3">What You Will Be Doing</h3>
                  <ul className="text-sm space-y-2">
                    {selectedJobData.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Bring */}
              {selectedJobData.requirements && (
                <div>
                  <h3 className="font-semibold mb-3">What You Bring</h3>
                  <ul className="text-sm space-y-2">
                    {selectedJobData.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What We Offer You */}
              {selectedJobData.benefits && (
                <div>
                  <h3 className="font-semibold mb-3">What We Offer You</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    A career at FIS is more than just a job. It's the chance to shape the future of fintech. At FIS, we offer you:
                  </p>
                  <ul className="text-sm space-y-2">
                    {selectedJobData.benefits.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Privacy Statement */}
              <div>
                <h3 className="font-semibold mb-3">Privacy Statement</h3>
                <p className="text-sm leading-relaxed">
                  FIS is committed to protecting the privacy and security of all personal information that we process in order to provide services to our clients. For specific information on how FIS protects personal information online, please see the Online Privacy Notice.
                </p>
              </div>

              {/* Sourcing Model */}
              <div>
                <h3 className="font-semibold mb-3">Sourcing Model</h3>
                <p className="text-sm leading-relaxed">
                  Recruitment at FIS works primarily on a direct sourcing model; a relatively small portion of our hiring is through recruitment agencies. FIS does not accept resumes from recruitment agencies which are not on the preferred supplier list and is not responsible for any related fees for resumes submitted to job postings, our employees, or any other part of our company.
                </p>
              </div>

              <div className="text-xs text-muted-foreground pt-4 border-t">
                #LI-dnp4pass
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrackerPage;