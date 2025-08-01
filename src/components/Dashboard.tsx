import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Calendar, Star, TrendingUp } from "lucide-react";
import ResumeScanner from "./ResumeScanner";
import JobTracker from "./JobTracker";
import LinkedInReport from "./LinkedInReport";
import JobListings from "./JobListings";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, Harsha!</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-warning" />
          <span>Try 2 weeks Premium</span>
          <Button variant="ghost" size="icon">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs">H</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Latest Resume Scan</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-warning-foreground font-bold text-lg">40</span>
                  </div>
                  <div>
                    <p className="font-medium">IT Intern</p>
                    <p className="text-sm text-muted-foreground">IT Intern</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>Searchability</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Formatting</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Skills Match</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Coverletter</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Recruiter Tips</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <JobTracker />
        </div>

        <div className="lg:col-span-1">
          <LinkedInReport />
        </div>
      </div>

      <ResumeScanner />
      
      <JobListings />
    </div>
  );
};

export default Dashboard;