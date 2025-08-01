import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Upload, Bookmark } from "lucide-react";
import { useState } from "react";

const ResumeScanner = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">New scan</CardTitle>
          <Button variant="outline" size="sm">
            View a Sample Scan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Resume</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                <Bookmark className="h-4 w-4 mr-1" />
                Saved Resumes
              </Button>
            </div>
            
            <Textarea
              placeholder="Paste resume text..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                <span className="text-primary cursor-pointer hover:underline">Drag & Drop or Upload</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Job Description</h3>
            
            <Textarea
              placeholder="Copy and paste job description here"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[400px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Available scans: 4 · <Button variant="link" className="p-0 h-auto text-primary">Upgrade</Button>
          </div>
          <Button 
            size="lg"
            disabled={!resumeText || !jobDescription}
            className="px-8"
          >
            Scan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeScanner;