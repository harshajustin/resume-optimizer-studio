import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

interface SkillItem {
  name: string;
  resume: number;
  jobDescription: number;
  status: 'match' | 'missing' | 'partial';
}

interface SkillMatchResultsProps {
  onBack?: () => void;
}

const SkillMatchResults = ({ onBack }: SkillMatchResultsProps) => {
  const matchScore = 40;
  const jobTitle = "IT Intern";
  const company = "Company Name";

  const hardSkills: SkillItem[] = [
    { name: "Computer knowledge", resume: 1, jobDescription: 1, status: 'match' },
    { name: "Software Development", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "routine maintenance", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "organizational skill", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "quality management", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "version control", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "automation", resume: 2, jobDescription: 1, status: 'match' },
  ];

  const softSkills: SkillItem[] = [
    { name: "technical skills", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "problem-solving", resume: 0, jobDescription: 1, status: 'missing' },
    { name: "collaboration", resume: 2, jobDescription: 1, status: 'match' },
    { name: "communication", resume: 0, jobDescription: 1, status: 'missing' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Skill Match Results</h1>
            <p className="text-muted-foreground">{jobTitle} at {company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Match Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Overall Match Rate</h2>
              <p className="text-muted-foreground">Resume compatibility with job requirements</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${getScoreColor(matchScore)}`}>
                <span className="text-2xl font-bold">{matchScore}%</span>
              </div>
            </div>
          </div>

          {/* Key Areas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium">Searchability</span>
              </div>
              <Badge variant="destructive" className="text-xs">Needs Work</Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Formatting</span>
              </div>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">Good</Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Skills Match</span>
              </div>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">Good</Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Experience</span>
              </div>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">Good</Badge>
            </div>
          </div>

          {/* Key Recommendations */}
          <div className="space-y-3">
            <h3 className="font-semibold">Key Recommendations:</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-sm">Adding this job's company name and skills additions can help to improve your ATS match rate by 60% or more information.</p>
              </div>
              <div className="flex items-start space-x-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-sm">We did not find an address on your resume. Recruiters can your address to validate your location for job openings near you.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <p className="text-sm">You provided your email. Recruiters can your email to contact you for job matches.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hard Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Hard Skills Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hard skills show your technical qualifications and expertise. You can learn hard skills in classrooms, training courses, and on the job. These skills are typically focused on hard facts and demonstrable tasks such as the use of tools, equipment, or software.
            </p>

            {/* Hard Skills Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 grid grid-cols-4 gap-4 font-medium text-sm">
                <div>Skill</div>
                <div className="text-center">Resume</div>
                <div className="text-center">Job Description</div>
                <div className="text-center">Status</div>
              </div>
              
              {hardSkills.map((skill, index) => (
                <div key={index} className="p-3 grid grid-cols-4 gap-4 items-center border-t text-sm">
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-center">{skill.resume}</div>
                  <div className="text-center">{skill.jobDescription}</div>
                  <div className="flex justify-center">
                    {getStatusIcon(skill.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              Don't see skills from the job description? <Button variant="link" className="p-0 h-auto text-primary">Add Skill</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soft Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Soft Skills Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Soft skills are your interpersonal and communication skills. These skills will especially help you as a good employee for any company. Soft skills have been shown to increase your hireability.
            </p>

            {/* Soft Skills Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 grid grid-cols-4 gap-4 font-medium text-sm">
                <div>Skill</div>
                <div className="text-center">Resume</div>
                <div className="text-center">Job Description</div>
                <div className="text-center">Status</div>
              </div>
              
              {softSkills.map((skill, index) => (
                <div key={index} className="p-3 grid grid-cols-4 gap-4 items-center border-t text-sm">
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-center">{skill.resume}</div>
                  <div className="text-center">{skill.jobDescription}</div>
                  <div className="flex justify-center">
                    {getStatusIcon(skill.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              Don't see skills from the job description? <Button variant="link" className="p-0 h-auto text-primary">Add Skill</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiter Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Job Level Match</h4>
                <p className="text-sm text-muted-foreground">
                  Six months of experience were found in this job description. Focus on promoting your skills and qualifications to impact your rank among candidates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Measurable Results</h4>
                <p className="text-sm text-muted-foreground">
                  We found 5 numbers or measurable results in your resume. Consider adding at least 1 specific achievement or impact you had in previous roles to show results.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Resume Tone</h4>
                <p className="text-sm text-muted-foreground">
                  The tone of your resume is generally positive and can common action and buzzwords were found. Great job!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Web Presence</h4>
                <p className="text-sm text-muted-foreground">
                  Nice - You've listed a website or online presence, which is a great way for recruiters and hiring managers to quickly check out your experience and credibility associated with a professional website.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Word Count</h4>
                <p className="text-sm text-muted-foreground">
                  There are 349 words in your resume, which is within the optimal range. 1000 words count for maximum effectiveness.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formatting Section */}
      <Card>
        <CardHeader>
          <CardTitle>Formatting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Layout</h4>
                <p className="text-xs text-muted-foreground">Professional formatting detected</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Font Check</h4>
                <p className="text-xs text-muted-foreground">Readable fonts used</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Page Setup</h4>
                <p className="text-xs text-muted-foreground">Proper margins and spacing</p>
              </div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Upgrade your account to receive more findings.
              </p>
              <Button className="mt-3" size="sm">
                Upgrade Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillMatchResults;
