import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, MapPin, Bookmark } from "lucide-react";

const JobListings = () => {
  const jobs = [
    {
      title: "Financial Services Account Associate II",
      company: "FIS",
      location: "Greater Hyderabad Area",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      title: "Sr. Technical Architect - SCPO",
      company: "Blue Yonder",
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      title: "Sr Technical Architect - (SCPO , Consulting)",
      company: "Blue Yonder", 
      location: "Hyderabad, Telangana, India",
      timeAgo: "1 day ago",
      type: "Full-time"
    },
    {
      title: "Program Manager, Last Mile Analytics and Quality",
      company: "Amazon",
      location: "Hyderabad, Telangana, India", 
      timeAgo: "1 day ago",
      type: "Full-time"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Jobs</CardTitle>
          <Button variant="link" className="text-primary">
            View all →
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Discover and apply to jobs</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs by keyword" 
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for a city" 
                className="pl-10"
              />
            </div>
            <Button className="px-8">
              Search
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="parttime">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map((job, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm leading-tight">{job.title}</h3>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary">{job.company}</p>
                      <p className="text-xs text-muted-foreground">{job.location}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{job.timeAgo}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                          Scan
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button variant="outline" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <Button variant="ghost" size="sm">→</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobListings;