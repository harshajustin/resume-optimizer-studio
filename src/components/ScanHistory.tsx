import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, ArrowUpDown, Archive, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ScanRecord {
  id: string;
  score: number;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  progressStatus: 'Interview' | 'Applied' | 'Saved' | 'Rejected';
  scanDate: string;
  isArchived: boolean;
}

const ScanHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [scanRecords] = useState<ScanRecord[]>([
    {
      id: "1",
      score: 40,
      companyName: "[Company Name]",
      jobTitle: "IT Intern",
      jobDescription: "JOB SUMMARY: IT Intern role is primarily involves performing routine assignments under close supervision...",
      progressStatus: "Interview",
      scanDate: "Aug 1, 2025",
      isArchived: false
    }
  ]);

  const filteredRecords = scanRecords.filter(record => {
    const matchesSearch = 
      record.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchived = showArchived ? record.isArchived : !record.isArchived;
    
    return matchesSearch && matchesArchived;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview':
        return "bg-primary/10 text-primary";
      case 'Applied':
        return "bg-green-100 text-green-800";
      case 'Saved':
        return "bg-muted text-muted-foreground";
      case 'Rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleTrack = (id: string) => {
    // Logic to track job application
    console.log("Track job:", id);
  };

  const handleArchive = (id: string) => {
    // Logic to archive scan
    console.log("Archive scan:", id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scan History</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {/* Sort */}
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
          
          {/* Archived Toggle */}
          <Button 
            variant={showArchived ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4" />
            Archived
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-20 text-center">Score</TableHead>
                <TableHead>Company name / job title</TableHead>
                <TableHead className="w-96">Job description</TableHead>
                <TableHead className="w-32 text-center">Progress status</TableHead>
                <TableHead className="w-24 text-center">Scan date</TableHead>
                <TableHead className="w-24 text-center">Job tracker</TableHead>
                <TableHead className="w-20 text-center">Archive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell className="text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border font-semibold text-sm ${getScoreColor(record.score)}`}>
                      {record.score}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-primary">{record.companyName}</div>
                      <div className="text-sm text-muted-foreground">{record.jobTitle}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                      {record.jobDescription}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Select defaultValue={record.progressStatus}>
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saved">Saved</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {record.scanDate}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTrack(record.id)}
                    >
                      Track
                    </Button>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(record.id)}
                      className="h-8 w-8"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1 - 1 of 1
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

export default ScanHistory;
