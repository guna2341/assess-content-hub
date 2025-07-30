import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ChevronLeft, BookOpen, FileText } from "lucide-react";
import { useAssessmentResultStore } from "../../zustand/student/resultState";

export function AssessmentResultPage() {
  const navigate = useNavigate();
  const {
    completedAssessments,
    formatDate,
    calculatePercentage,
    getAssessmentById
  } = useAssessmentResultStore();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/assessments")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
        <h1 className="text-2xl font-bold">Completed Assessments</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {completedAssessments.map((assessment) => {
          const percentage = calculatePercentage(assessment.score, assessment.totalQuestions);
          
          return (
            <Card key={assessment.id} className="bg-gradient-card border border-custom-100 shadow-soft hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <Badge variant={assessment.type === "summary" ? "secondary" : "default"}>
                    {assessment.type === "summary" ? "Summary" : "Question Bank"}
                  </Badge>
                </div>
                <CardDescription>
                  Completed on {formatDate(assessment.dateCompleted)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Score:</span>
                  <span className="font-bold">
                    {assessment.score}/{assessment.totalQuestions}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between">
                  <span>Percentage:</span>
                  <span className={`font-bold ${
                    assessment.passed ? "text-green-600" : "text-red-600"
                  }`}>
                    {percentage}%
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge variant={assessment.passed ? "success" : "destructive"}>
                  {assessment.passed ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {assessment.passed ? "Passed" : "Not Passed"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/assessment-result/${assessment.id}`, {
                      state: { assessment: getAssessmentById(assessment.id) }
                    })
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AssessmentResultPage;