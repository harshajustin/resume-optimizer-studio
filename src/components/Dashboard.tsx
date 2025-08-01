import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowRight, Calendar, Star, Upload, Bookmark, Search, MapPin, X, FileText } from "lucide-react";
import { useState, useRef } from "react";

interface DashboardProps {
  onNavigateToResults?: () => void;
}

const Dashboard = ({ onNavigateToResults }: DashboardProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type.includes('document') || file.type === 'text/plain')) {
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Welcome to SkillMatch AI!</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-warning" />
          <span>Try 2 weeks Premium</span>
          <Button variant="ghost" size="icon">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground">H</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Top Row - Three Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Resume Scan */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToResults}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest Skill Match</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 border-2 border-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">40</span>
                </div>
                <div>
                  <p className="font-medium">IT Intern</p>
                  <p className="text-sm text-muted-foreground">IT Intern</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Searchability</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Formatting</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Skills Match</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Coverletter</span>
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Recruiter Tips</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Tracker */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Job Tracker</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Next Interview</h3>
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn Report */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">LinkedIn Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Optimize your LinkedIn profile to match your preferred job listings.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Optimize LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Scan Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">New Skill Match</CardTitle>
            <Button variant="outline" size="sm">
              View a Sample Match
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Resume</h3>
                <Button variant="link" className="p-0 h-auto text-primary text-sm">
                  <Star className="h-4 w-4 mr-1" />
                  Saved Resumes
                </Button>
              </div>
              
              {!uploadedFile ? (
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                >
                  <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-primary font-medium mb-1">
                    Drag & Drop or Upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOC, DOCX, TXT files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-success/50 bg-success/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-success" />
                      <div>
                        <p className="font-medium text-sm text-success">{uploadedFile.name}</p>
                        <p className="text-xs text-success/70">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Job Description</h3>
              
              <Textarea
                placeholder="Copy and paste job description here"
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Available matches: 4 · <Button variant="link" className="p-0 h-auto text-primary">Upgrade</Button>
            </div>
            <Button size="lg" className="px-8">
              Match Skills
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Jobs</CardTitle>
              <p className="text-sm text-muted-foreground">Discover and apply to jobs</p>
            </div>
            <Button variant="link" className="text-primary">
              View all →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs by keyword" className="pl-10" />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for a city" className="pl-10" />
              </div>
              <Button>Search</Button>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Card 1 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Financial Services Account Associate II</h3>
                  <p className="text-sm text-primary font-medium mb-1">FIS</p>
                  <p className="text-xs text-muted-foreground mb-2">Greater Hyderabad Area</p>
                  <p className="text-xs text-muted-foreground mb-3">1 day ago</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Match Skills</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Card 2 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Sr. Technical Architect - SCPO</h3>
                  <p className="text-sm text-primary font-medium mb-1">Blue Yonder</p>
                  <p className="text-xs text-muted-foreground mb-2">Hyderabad, Telangana, India</p>
                  <p className="text-xs text-muted-foreground mb-3">1 day ago</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Match Skills</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Card 3 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Sr Technical Architect - (SCPO, Consulting)</h3>
                  <p className="text-sm text-primary font-medium mb-1">Blue Yonder</p>
                  <p className="text-xs text-muted-foreground mb-2">Hyderabad, Telangana, India</p>
                  <p className="text-xs text-muted-foreground mb-3">1 day ago</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Match Skills</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Card 4 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2">Program Manager, Last Mile Analytics and Quality</h3>
                  <p className="text-sm text-primary font-medium mb-1">Amazon</p>
                  <p className="text-xs text-muted-foreground mb-2">Hyderabad, Telangana, India</p>
                  <p className="text-xs text-muted-foreground mb-3">1 day ago</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Match Skills</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">1</Button>
                <Button variant="ghost" size="sm">2</Button>
                <Button variant="ghost" size="sm">3</Button>
                <Button variant="ghost" size="sm">→</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

