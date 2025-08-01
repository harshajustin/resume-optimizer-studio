import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const JobTracker = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Job Tracker</CardTitle>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">Next Interview</p>
            <p className="text-sm text-muted-foreground mb-4">No upcoming interviews</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobTracker;