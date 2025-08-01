import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LinkedinIcon } from "lucide-react";

const LinkedInReport = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <LinkedinIcon className="h-5 w-5 text-primary" />
          <span>LinkedIn Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Optimize your LinkedIn profile to match your preferred job listings.
          </p>
          
          <Button variant="outline" className="w-full">
            Optimize LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInReport;