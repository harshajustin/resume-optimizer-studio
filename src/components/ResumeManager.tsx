import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Star, Eye, Trash2, Download } from "lucide-react";
import { useState } from "react";

interface Resume {
  id: string;
  name: string;
  jobOpportunity: string;
  created: string;
  lastModified: string;
  isBase: boolean;
  isStarred: boolean;
}

const ResumeManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resumes] = useState<Resume[]>([
    {
      id: "1",
      name: "auto: Resume_copy",
      jobOpportunity: "IT Intern",
      created: "Aug 1, 2025",
      lastModified: "Aug 1, 2025",
      isBase: false,
      isStarred: false
    },
    {
      id: "2",
      name: "Resume",
      jobOpportunity: "-",
      created: "Aug 1, 2025",
      lastModified: "Aug 1, 2025",
      isBase: true,
      isStarred: false
    }
  ]);

  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.jobOpportunity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStarToggle = (id: string) => {
    // Logic to toggle star status
    console.log("Toggle star for resume:", id);
  };

  const handleView = (id: string) => {
    // Logic to view resume
    console.log("View resume:", id);
  };

  const handleDelete = (id: string) => {
    // Logic to delete resume
    console.log("Delete resume:", id);
  };

  const handleDownload = (id: string) => {
    // Logic to download resume
    console.log("Download resume:", id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resume Manager</h1>
          <p className="text-muted-foreground">Organize your uploaded resumes and save time with new job applications</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Base Resume Selection Card */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Select a base resume to save time.</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your base resume can be used by default for all new skill matches. Start with an 
                established resume to save time on future matches.
              </p>
            </div>
            <div className="ml-8 flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-32 bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-muted-foreground">My Base Resume</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded w-full"></div>
                    <div className="h-2 bg-muted rounded w-4/5"></div>
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-5/6"></div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="h-1.5 bg-muted rounded w-full"></div>
                    <div className="h-1.5 bg-muted rounded w-4/5"></div>
                    <div className="h-1.5 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
                
                {/* Job Description overlay */}
                <div className="absolute -top-2 -right-2 bg-card border border-border rounded p-2 shadow-sm">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Job Description</div>
                  <div className="w-16 space-y-1">
                    <div className="h-1 bg-muted rounded w-full"></div>
                    <div className="h-1 bg-muted rounded w-3/4"></div>
                    <div className="h-1 bg-muted rounded w-4/5"></div>
                  </div>
                </div>

                {/* Job Title overlay */}
                <div className="absolute -bottom-2 left-4 bg-card border border-border rounded px-2 py-1 shadow-sm">
                  <div className="text-xs text-muted-foreground">Job Title</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12 pl-6">Base</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Job Opportunity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResumes.map((resume) => (
                <TableRow key={resume.id} className="hover:bg-muted/50">
                  <TableCell className="pl-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleStarToggle(resume.id)}
                    >
                      <Star 
                        className={`h-4 w-4 ${
                          resume.isStarred || resume.isBase 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {resume.name}
                  </TableCell>
                  <TableCell>
                    {resume.jobOpportunity === "-" ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground italic">
                          {resume.jobOpportunity}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resume.created}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resume.lastModified}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleView(resume.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDownload(resume.id)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1-2 of 2
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                &lt;
              </Button>
              <Button variant="outline" size="sm" disabled>
                &gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeManager;
