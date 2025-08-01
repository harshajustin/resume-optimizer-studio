import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, Clock, Building2, Bookmark, ExternalLink } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedTime: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isFullTime: boolean;
  isSaved: boolean;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Financial Services Account Associate II",
    company: "FIS",
    location: "Greater Hyderabad Area",
    postedTime: "1 day ago",
    type: "Full-time",
    description: "Are you curious, motivated, and forward-thinking? At FIS, you'll have the opportunity to work on some of the most challenging and relevant issues in financial services and technology. Our talented people empower us, and we believe in being part of a team that is open, collaborative, entrepreneurial, passionate and above all fun.",
    requirements: [
      "1 to 2 Years of experience from Mutual fund and transfer agency process or finance",
      "CISI Unit 6 - 3-30 PM to 9-30 AM",
      "Ready to work in night shifts (5 days in a week)",
      "Hybrid model - 3 days in a week",
      "Excellent communication and interpersonal skills"
    ],
    benefits: [
      "Competitive salary and benefits",
      "Career growth opportunities",
      "Hybrid work environment",
      "Collaborative work environment"
    ],
    isFullTime: true,
    isSaved: false
  },
  {
    id: "2",
    title: "Sr. Technical Architect - SCPO",
    company: "Blue Yonder",
    location: "Hyderabad, Telangana, India",
    postedTime: "1 day ago",
    type: "Full-time",
    description: "Blue Yonder is seeking a Senior Technical Architect to join our Supply Chain Planning Organization team.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "8+ years of experience in software development",
      "Experience with cloud technologies",
      "Strong problem-solving skills"
    ],
    benefits: [
      "Health insurance",
      "Retirement plans",
      "Professional development",
      "Flexible work arrangements"
    ],
    isFullTime: true,
    isSaved: false
  },
  {
    id: "3",
    title: "Program Manager, Last Mile Analytics and Quality",
    company: "Amazon",
    location: "Hyderabad, Telangana, India",
    postedTime: "1 day ago",
    type: "Full-time",
    description: "Amazon is looking for a Program Manager to lead Last Mile Analytics and Quality initiatives.",
    requirements: [
      "MBA or equivalent experience",
      "5+ years of program management experience",
      "Experience with data analytics",
      "Strong leadership skills"
    ],
    benefits: [
      "Stock options",
      "Health benefits",
      "Career advancement",
      "Innovation opportunities"
    ],
    isFullTime: true,
    isSaved: false
  }
];

const FindJobs = () => {
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("Any type");

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === "Any type" || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleSaveJob = (jobId: string) => {
    // Implementation for saving job
    console.log("Saving job:", jobId);
  };

  const handleApplyJob = (jobId: string) => {
    // Implementation for applying to job
    console.log("Applying to job:", jobId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Discover and apply to jobs</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs by keyword"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for a city"
              className="pl-10"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any type">Any type</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Button>Search</Button>
        </div>

        <div className="flex gap-2 mt-4">
          <Select defaultValue="Date">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Date">Date</SelectItem>
              <SelectItem value="Relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Clear all</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Job Listings */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedJob.id === job.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveJob(job.id);
                      }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-2">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.postedTime}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {job.isFullTime && (
                      <Badge variant="secondary">Full-time</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="w-1/2 overflow-y-auto">
          {selectedJob && (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{selectedJob.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedJob.company}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedJob.location}
                  </div>
                  <Badge variant="outline">Full-time</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleApplyJob(selectedJob.id)}>
                    Apply
                  </Button>
                  <Button variant="outline" onClick={() => handleSaveJob(selectedJob.id)}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Job
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Position Type</h3>
                  <p className="text-sm">{selectedJob.type}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Type of Hire</h3>
                  <p className="text-sm">Experience (relevant combo of work and education)</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Education Desired</h3>
                  <p className="text-sm">Bachelor's Degree</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Travel Percentage</h3>
                  <p className="text-sm">0%</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-sm leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">About The Team</h3>
                  <p className="text-sm leading-relaxed">
                    The Transfer Agency is a division responsible for Transaction Operations, Processing and 
                    is also the key contact point for mutual funds for various clients.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What You Will Be Doing</h3>
                  <ul className="text-sm space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What You Bring</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>1 to 2 Years of experience from Mutual fund and transfer agency process or finance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>CISI Unit 6 - 3: 30 PM to 9: 30 AM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Ready to work in night shifts (5 days in a week)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Hybrid model - 3 days in a week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Excellent communication and interpersonal skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Excellent knowledge of Customer Services Global mindset (Desirable)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What We Offer You</h3>
                  <div className="text-sm space-y-2">
                    <p>A career at FIS is more than just a job. It's the change to shape the future of fintech. At FIS, we offer you:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>A voice in the future of fintech</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Always on learning and development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Collaborative work environment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Opportunities to give back</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Competitive salary and benefits</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Privacy Statement</h3>
                  <p className="text-sm leading-relaxed">
                    FIS is committed to protecting the privacy and security of all personal information that 
                    we process in order to provide services to our clients. For specific information on how 
                    FIS protects personal information online, please see the Online Privacy Notice.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sourcing Model</h3>
                  <p className="text-sm leading-relaxed">
                    Recruitment at FIS works primarily on a direct sourcing model; a relatively small portion 
                    of our hiring is through recruitment agencies which are not on the preferred supplier list and is not responsible 
                    for any external fees for resumes submitted to job postings, our employees, or any other 
                    part of our company.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">#IndJobs</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
