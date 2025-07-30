import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  Trophy, 
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAssessmentDetailStore } from '../../zustand/student/assessmentPageState';

export function AssessmentDetailPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    timeLeft,
    currentQuestion,
    questions,
    answers,
    isSubmitted,
    results,
    hasStarted,
    checkIfCompleted,
    startAssessment,
    selectAnswer,
    submitAssessment,
    goToNextQuestion,
    goToPrevQuestion,
  } = useAssessmentDetailStore();

  // Check if assessment was already completed
  useEffect(() => {
    if (checkIfCompleted(assessmentId)) {
      toast({
        title: 'Assessment Already Completed',
        description: 'You have already completed this assessment and cannot retake it.',
        variant: 'destructive',
      });
      navigate('/assessments');
    }
  }, [assessmentId, checkIfCompleted, navigate, toast]);

  // Prevent going back during test
  useEffect(() => {
    if (hasStarted && !isSubmitted) {
      const handleBackButton = (e) => {
        e.preventDefault();
        toast({
          title: 'Warning',
          description: 'You cannot navigate away during the assessment. Please complete or submit the test.',
          variant: 'destructive',
        });
        window.history.pushState(null, '', window.location.pathname);
      };

      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handleBackButton);

      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }
  }, [hasStarted, isSubmitted, toast]);

  // Initialize timer when component mounts
  useEffect(() => {
    if (!hasStarted && !isSubmitted && !checkIfCompleted(assessmentId)) {
      startAssessment();
    }
  }, [hasStarted, isSubmitted, assessmentId, checkIfCompleted, startAssessment]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isSubmitted && results) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            {results.score >= 70 ? (
              <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            ) : (
              <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            )}
            <CardTitle>
              {results.score >= 70 ? 'Assessment Passed!' : 'Assessment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                results.score >= 70 ? 'text-green-600' : 'text-red-600'
              }`}>
                {results.score}%
              </div>
              <p className="text-muted-foreground">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
            </div>

            <Alert variant={results.score >= 70 ? 'success' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {results.score >= 70 ? 'Congratulations!' : 'Try Again Next Time'}
              </AlertTitle>
              <AlertDescription>
                {results.score >= 70 
                  ? 'You have successfully passed this assessment.'
                  : 'You did not meet the passing score (70%). Review your answers below.'}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Detailed Results:</h3>
              {results.detailedResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${
                    result.isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{result.question}</p>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {result.selectedOption}
                        </span>
                      </p>
                    </div>
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {!result.isCorrect && (
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Correct answer: </span>
                      <span className="text-green-600">{result.correctOption}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button 
              className="w-full mt-6"
              onClick={() => navigate('/assessments')}
            >
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 justify-end w-full">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <Button onClick={submitAssessment}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{questions[currentQuestion].text}</p>
          
          <div className="space-y-2">
            {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
              <Button 
                key={key}
                variant={
                  answers[questions[currentQuestion].id] === key
                    ? 'default'
                    : 'outline'
                }
                className="w-full justify-start"
                onClick={() => selectAnswer(questions[currentQuestion].id, key)}
              >
                <span className="font-bold mr-2">{key}.</span> {value}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPrevQuestion}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={goToNextQuestion}
          disabled={currentQuestion === questions.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}