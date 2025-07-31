import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    BookOpen,
    AlertTriangle,
    Loader2,
    MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

// Your original content units data
const contentUnits = [
    {
        id: '1',
        code: 'MATH-101',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: `<h2>Chapter 1: Basic Concepts</h2>
      <p>Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.</p>
      <h3>1.1 Variables and Constants</h3>
      <ul>
        <li><strong>Variable:</strong> A symbol (usually a letter) that represents a number that may change.</li>
        <li><strong>Constant:</strong> A fixed value that does not change.</li>
      </ul>
      <h3>1.2 Expressions and Equations</h3>
      <ul>
        <li><strong>Expression:</strong> A combination of variables, numbers and operations.</li>
        <li><strong>Equation:</strong> A statement that two expressions are equal.</li>
      </ul>`,
        questionType: "content",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        totalReviews: 3,
        minimumReviews: 3,
        questions:
            [
                {
                    id: 'q1',
                    question: 'What is a variable in algebra?',
                    type: 'Short Answer',
                    topic: 'variables',
                    status: 'pending', // Changed to pending for review
                    difficulty: 'Easy',
                    correctAnswer: 'A symbol that represents a number that can change.',
                    explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                    createdBy: 'Dr. Smith',
                },
                {
                    id: 'q2',
                    question: 'What is a variable in algebra?',
                    type: 'Short Answer',
                    topic: 'variables',
                    status: 'pending', // Changed to needs edit for review
                    difficulty: 'Easy',
                    correctAnswer: 'A symbol that represents a number that can change.',
                    explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                    createdBy: 'Dr. Smith',
                }
            ]
    },
    {
        id: '2',
        code: 'MATH-201',
        title: 'அலகு: சமமான கோணங்கள்',
        description: 'இந்த அலகில் கோணங்களின் அடிப்படைப் புரிதலைக் கற்றுக்கொள்கிறோம்.',
        content: `
      <h2>அத்தியாயம் 1: கோணங்கள்</h2>
      <p>கோணம் என்பது இரண்டு ரேகைகள் சந்திக்கும் இடத்தில் உருவாகும்.</p>
      <h3>1.1 கோண வகைகள்</h3>
      <ul>
        <li>குறுகிய கோணம்</li>
        <li>நீளமான கோணம்</li>
      </ul>
    `,
        language: 'ta',
        explanation: 'This unit teaches the basics of angles and their types in Tamil.',
        questionsCount: 8,
        studentsEnrolled: 38,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-04',
        createdBy: 'Dr. Kumar',
        questionType: "content",
        totalRevies: 3,
        minimumReviews: 3,
        questions: [
            {
                id: 'q3',
                question: 'கோணம் என்றால் என்ன?',
                type: 'Long Answer',
                topic: 'angles',
                status: 'pending', // Changed to pending for review
                difficulty: 'Easy',
                correctAnswer: 'இரண்டு ரேகைகள் சந்திக்கும் இடத்தில் உருவாகும் வடிவம்.',
                explanation: 'An angle is formed at the intersection of two lines.',
                createdBy: 'Dr. Kumar',
                createdAt: '2024-02-01'
            }
        ]
    },
    {
        id: '3',
        code: 'MATH-301',
        title: 'त्रिकोणमिति का परिचय',
        description: 'त्रिकोणों और उनके अनुपातों की मूल बातें।',
        content: `
      <h2>अध्याय 1: त्रिकोणमिति</h2>
      <p>त्रिकोणमिति गणित की वह शाखा है जिसमें कोणों और त्रिकोणों का अध्ययन किया जाता है।</p>
      <h3>1.1 प्रमुख अनुपात</h3>
      <ul>
        <li>साइन (sin)</li>
        <li>कोसाइन (cos)</li>
        <li>टैन्जेंट (tan)</li>
      </ul>
    `,
        language: 'hi',
        explanation: 'This unit introduces trigonometry and its basic ratios in Hindi.',
        questionsCount: 10,
        studentsEnrolled: 41,
        createdAt: '2024-03-01',
        updatedAt: '2024-03-04',
        createdBy: 'Dr. Mehta',
        questionType: "content",
        totalRevies: 2,
        minimumReviews: 3,
        questions: [
            {
                id: 'q4',
                question: 'त्रिकोणमिति में साइन क्या दर्शाता है?',
                type: 'Short Answer',
                topic: 'trigonometry',
                status: 'pending', // Changed to pending for review
                difficulty: 'Medium',
                correctAnswer: 'विपरीत भुजा और कर्ण का अनुपात',
                explanation: 'In trigonometry, sine is the ratio of the opposite side to the hypotenuse.',
                createdBy: 'Dr. Mehta',
                createdAt: '2024-03-01'
            }
        ]
    },
    {
        id: '4',
        code: 'MATH-101',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: "<p>Demo Image</p>",
        imageLink: "https://tse2.mm.bing.net/th/id/OIP.7cRYFyLoDEDh4sRtM73vvwHaDg?pid=Api&P=0&h=180",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        questionsCount: 12,
        studentsEnrolled: 45,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'Dr. Smith',
        questionType: "content",
        totalReviews: 3,
        minimumReviews: 3,
        questions: [
            {
                id: 'q5',
                question: 'What is a variable in algebra?',
                type: 'Multiple Choice',
                options: [
                    "2", "3", "4", "5"

                ],
                topic: 'variables',
                status: 'pending', // Changed to needs edit for review
                difficulty: 'Easy',
                correctAnswer: 'a',
                explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                createdBy: 'Dr. Smith',
                createdAt: '2024-01-15'

            },
        ]
    },
    {
        id: '5',
        code: 'MATH-401',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: "<p>Demo Image</p>",
        imageLink: "https://tse2.mm.bing.net/th/id/OIP.7cRYFyLoDEDh4sRtM73vvwHaDg?pid=Api&P=0&h=180",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        status: 'pending',
        questionsCount: 12,
        studentsEnrolled: 45,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'Dr. Smith',
        questionType: "content",
        totalReviews: 3,
        minimumReviews: 3,
        questions: [
            {
                id: 'q6',
                question: 'What is a variable in algebra?',

                status: 'pending', // Changed to pending for review
                type: 'Multiple Choice',
                options: [
                    {
                        id: "a0018813-3476-4440-a27c-a4d5ed8b2933",
                        isCorrect: true,
                        text: "option a"
                    },
                    {
                        id: "a0018813-3476-4440-a27c-a4d5ed8b2934",
                        isCorrect: false,
                        text: "option b"
                    },
                    {
                        id: "a0018813-3476-4440-a27c-a4d5ed8b2935",
                        isCorrect: false,
                        text: "option c"
                    },
                    {
                        id: "a0018813-3476-4440-a27c-a4d5ed8b2936",
                        isCorrect: false,
                        text: "option d"
                    },

                ],
                topic: 'variables',
                difficulty: 'Easy',
                correctAnswer: 'a',
                explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                createdBy: 'Dr. Smith',
                createdAt: '2024-01-15'
            },
        ]
    }
];

// Extract questions that need review from content units
const questionsNeedingReview = contentUnits.flatMap(unit =>
    unit.questions
        ?.filter(question => question.status === 'pending')
        ?.map(question => ({
            ...question,
            contentUnit: {
                id: unit.id,
                code: unit.code,
                title: unit.title,
                language: unit.language
            }
        })) || []
);

export function ContentReviewsPage() {
    const [loading, setLoading] = useState(false);
    const [questions] = useState(questionsNeedingReview);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const { toast } = useToast();

    const handleReviewAction = async (action, questionId) => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'marked for edit';
            toast({
                title: 'Success',
                description: `Question ${actionText} successfully`,
                variant: "default"
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: `Failed to ${action} question`,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getLanguageLabel = (lang) => {
        switch (lang) {
            case 'hi': return 'हिंदी';
            case 'ta': return 'தமிழ்';
            default: return 'English';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                </Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                </Badge>;
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const colors = {
            'Easy': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Hard': 'bg-red-100 text-red-800'
        };
        return (
            <Badge variant="outline" className={colors[difficulty] || 'bg-gray-100 text-gray-800'}>
                {difficulty}
            </Badge>
        );
    };

    const addComment = (questionId) => {
        if (!newComment.trim()) return;

        setComments(prev => ({
            ...prev,
            [questionId]: newComment
        }));
        setNewComment('');

        toast({
            title: 'Comment added',
            description: 'Your comment has been saved',
            variant: "default"
        });
    };

    if (loading && questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Loading questions for review...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Reviews</h1>
                    <p className="text-muted-foreground">
                        Review and approve questions submitted by faculty members
                    </p>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((question) => (
                    <Card key={question.id} className="bg-gradient-card border shadow-soft hover:shadow-medium transition-all duration-200">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Header with badges */}
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="bg-muted/20">
                                            {question.contentUnit.code}
                                        </Badge>
                                        <Badge variant="outline">
                                            {getLanguageLabel(question.contentUnit.language)}
                                        </Badge>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {question.type}
                                        </Badge>
                                        {getDifficultyBadge(question.difficulty)}
                                        {getStatusBadge(question.status)}
                                    </div>
                                </div>

                                {/* Question content */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        <strong>Topic:</strong> {question.topic} | <strong>Unit:</strong> {question.contentUnit.title}
                                    </p>

                                    {/* Multiple choice options */}
                                    {question.type === 'Multiple Choice' && question.options && (
                                        <div className="bg-muted/20 p-3 rounded-lg mb-3">
                                            <p className="text-sm font-medium mb-2">Options:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {question.options.map((option) => (
                                                    <div key={option.id} className={`text-sm p-2 rounded ${option.isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-50'}`}>
                                                        {option.text} {option.isCorrect && '✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Answer and explanation */}
                                    <div className="bg-muted/20 p-3 rounded-lg">
                                        <p className="text-sm"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                                        <p className="text-sm mt-1"><strong>Explanation:</strong> {question.explanation}</p>
                                    </div>
                                </div>

                                {/* Comment section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Review Comments</span>
                                    </div>
                                    {comments[question.id] ? (
                                        <div className="p-3 rounded-lg">
                                            <div dangerouslySetInnerHTML={{ __html: comments[question.id] }} />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No comments yet</p>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <RichTextEditor
                                            value={newComment}
                                            onChange={setNewComment}
                                            placeholder="Add your review comments..."
                                            editorClassName="max-h-[200px] border-gray-300"
                                        />
                                        <Button
                                            onClick={() => addComment(question.id)}
                                            disabled={!newComment.trim()}
                                            className="self-end"
                                        >
                                            Add Comment
                                        </Button>
                                    </div>
                                </div>

                                {/* Footer with creator info and actions */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span>Created by {question.createdBy}</span>
                                        </div>
                                        <div>
                                            <span>Date: {question.createdAt}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Highlighted Approve Button */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-white bg-green-600 hover:bg-green-700 hover:text-white border-green-600"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Approve Question</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to approve this question? It will be published and available for use.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleReviewAction('approve', question.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        {/* Highlighted Reject Button */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-white bg-red-600 hover:bg-red-700 hover:text-white border-red-600"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Reject Question</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to reject this question? The faculty member will be notified.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleReviewAction('reject', question.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {questions.length === 0 && (
                <Card className="bg-gradient-card border-0 shadow-soft">
                    <CardContent className="p-12 text-center">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                        <p className="text-muted-foreground">
                            All questions have been reviewed
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}