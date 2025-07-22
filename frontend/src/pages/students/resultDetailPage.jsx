import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Added import
import { ChevronLeft, CheckCircle, XCircle, Clock, BookOpen } from "lucide-react";
import { useAssessmentResultStore } from "../../zustand/student/resultState";

export function AssessmentResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { getAssessmentById } = useAssessmentResultStore();
  
  // Get assessment from location state or store
  const assessment = state?.assessment || getAssessmentById(id);

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Assessment not found</p>
        <Button onClick={() => navigate("/assessments")}>Back to Assessments</Button>
      </div>
    );
  }

  const percentage = Math.round((assessment.score / assessment.totalQuestions) * 100);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Button variant="outline" onClick={() => navigate("/assessments/results")}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">{assessment.title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={assessment.type === "summary" ? "secondary" : "default"}>
              {assessment.type === "summary" ? "Summary" : "Question Bank"}
            </Badge>
            <Badge variant={assessment.passed ? "success" : "destructive"}>
              {assessment.passed ? "Passed" : "Not Passed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">
                {assessment.score}/{assessment.totalQuestions}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Percentage</p>
              <p className={`text-2xl font-bold ${
                assessment.passed ? "text-green-600" : "text-red-600"
              }`}>
                {percentage}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Time Taken</p>
              <p className="text-2xl font-bold">{assessment.details.timeTaken}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Topics Covered:</h3>
            <div className="flex flex-wrap gap-2">
              {assessment.details.topics.map((topic, index) => (
                <Badge key={index} variant="outline">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Performance Breakdown:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-600">
                    <CheckCircle className="inline h-5 w-5 mr-2" />
                    Correct Answers: {assessment.details.correctAnswers}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-600">
                    <XCircle className="inline h-5 w-5 mr-2" />
                    Incorrect Answers: {assessment.details.incorrectAnswers}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}