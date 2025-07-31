import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    CheckCircle,
    XCircle,
    Clock,
    User,
    MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const questionBank = [
    {
        id: 'math',
        name: 'Mathematics',
        children: [
            {
                id: 'algebra',
                name: 'Algebra',
                questions: [
                    {
                        id: '1',
                        question: 'Solve for x: 2x + 5 = 13',
                        difficulty: 'Easy',
                        options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
                        correctAnswer: 'A',
                        explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
                        status: 'approved',
                        createdBy: 'Dr. Smith',
                        createdAt: '2024-01-15',
                        comments: [
                            {
                                id: '1',
                                user: 'Reviewer A',
                                text: 'Clear and well-structured question.',
                                type: 'approved',
                                createdAt: '2024-01-16',
                            },
                        ],
                    }
                ],
                children: [
                    {
                        id: 'basic-algebra',
                        name: 'Basic Operations',
                        questionCount: 25,
                        questions: [
                            {
                                id: '2',
                                question: 'Solve for x: 3x - 7 = 14',
                                difficulty: 'Easy',
                                options: ['x = 7', 'x = 6', 'x = 8', 'x = 9'],
                                correctAnswer: 'A',
                                explanation: 'Add 7 to both sides: 3x = 21, then divide by 3: x = 7',
                                status: 'approved',
                                createdBy: 'Dr. Smith',
                                createdAt: '2024-01-15',
                                comments: [],
                            },
                        ],
                    },
                    {
                        id: 'equations',
                        name: 'Linear Equations',
                        questionCount: 18,
                        questions: [
                            {
                                id: '4',
                                question: 'Find the value of x: 3x - 7 = 11',
                                difficulty: 'Easy',
                                options: ['x = 4', 'x = 6', 'x = 5', 'x = 7'],
                                correctAnswer: 'B',
                                explanation: 'Add 7 to both sides: 3x = 18, then divide by 3: x = 6',
                                status: 'approved',
                                createdBy: 'Dr. Lin',
                                createdAt: '2024-01-12',
                                comments: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'geometry',
                name: 'Geometry',
                children: [
                    {
                        id: 'basic-shapes',
                        name: 'Basic Shapes',
                        questionCount: 15,
                        questions: [
                            {
                                id: '6',
                                question: 'How many sides does a hexagon have?',
                                type: 'Multiple Choice',
                                difficulty: 'Easy',
                                options: ['5', '6', '7', '8'],
                                correctAnswer: 'B',
                                explanation: 'A hexagon has 6 sides.',
                                status: 'approved',
                                createdBy: 'Prof. Alice',
                                createdAt: '2024-01-17',
                                comments: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'science',
        name: 'Science',
        children: [
            {
                id: 'physics',
                name: 'Physics',
                children: [
                    {
                        id: 'mechanics',
                        name: 'Mechanics',
                        questionCount: 30,
                        questions: [
                            {
                                id: '3',
                                question: 'Explain Newton first law of motion with an example.',
                                type: 'Long Answer',
                                topic: 'mechanics',
                                difficulty: 'Hard',
                                correctAnswer: 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.',
                                explanation: 'This law describes inertia - the tendency of objects to resist changes in their state of motion.',
                                status: 'needs_review',
                                createdBy: 'Dr. Williams',
                                createdAt: '2024-01-20',
                                comments: [
                                    {
                                        id: '3',
                                        user: 'Reviewer C',
                                        text: 'The question is good but needs more specific criteria for evaluation.',
                                        type: 'needs_edit',
                                        createdAt: '2024-01-21',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export function QuestionBankPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState({});
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                </Badge>;
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </Badge>;
            case 'needs_review':
            default:
                return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                    {status}
                </Badge>;
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const colors = {
            'Easy': 'bg-green-100 text-green-800 border-green-300',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Hard': 'bg-red-100 text-red-800 border-red-300'
        };
        return (
            <Badge variant="outline" className={colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-300'}>
                {difficulty}
            </Badge>
        );
    };

    const getAllQuestions = () => {
        const flattenQuestions = (items) => {
            let questions = [];
            items.forEach(item => {
                if (item.questions) questions = [...questions, ...item.questions];
                if (item.children) questions = [...questions, ...flattenQuestions(item.children)];
            });
            return questions;
        };
        return flattenQuestions(questionBank);
    };

    const filterQuestions = () => {
        const allQuestions = getAllQuestions();
        return allQuestions.filter(question => {
            const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
            const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
            return matchesSearch && matchesStatus && matchesDifficulty;
        });
    };

    const handleReviewAction = async (action, questionId) => {
        try {
            setLoading(true);
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

    const addComment = (questionId) => {
        if (!newComment.trim()) {
            toast({
                title: 'Empty comment',
                description: 'Please write something before submitting',
                variant: "destructive"
            });
            return;
        }

        const comment = {
            id: Date.now().toString(),
            user: 'Current Reviewer',
            text: newComment,
            type: 'comment',
            createdAt: new Date().toISOString().split('T')[0]
        };

        setComments(prev => ({
            ...prev,
            [questionId]: [...(prev[questionId] || []), comment]
        }));

        setNewComment('');

        toast({
            title: 'Comment added',
            description: 'Your comment has been saved',
            variant: "default"
        });
    };

    const filteredQuestions = filterQuestions();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
                    <p className="text-muted-foreground">
                        Browse and manage all approved questions
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <Card className="text-center p-12">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </Card>
                ) : (
                    filteredQuestions.map(question => (
                        <Card key={question.id} className="mb-4">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{question.question}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {getStatusBadge(question.status)}
                                                {getDifficultyBadge(question.difficulty)}
                                                <Badge variant="outline" className="bg-muted/20 border-gray-300">
                                                    {question.type || 'Multiple Choice'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground text-right">
                                            <div className="flex items-center gap-1 justify-end">
                                                <User className="h-4 w-4" />
                                                {question.createdBy}
                                            </div>
                                            <div>{question.createdAt}</div>
                                        </div>
                                    </div>

                                    {question.options && (
                                        <div className="bg-muted/20 p-4 rounded-lg border border-gray-200">
                                            <p className="text-sm font-medium mb-2">Options:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {question.options.map((option, index) => (
                                                    <div
                                                        key={index}
                                                        className={`text-sm p-2 rounded-lg border ${String.fromCharCode(65 + index) === question.correctAnswer ?
                                                                'bg-green-50 text-green-800 border-green-200' :
                                                                'bg-white text-gray-800 border-gray-200'
                                                            }`}
                                                    >
                                                        {String.fromCharCode(65 + index)}. {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-muted/20 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm font-medium">Correct Answer:</p>
                                        <p className="text-sm mt-1 bg-white p-2 rounded-lg border border-gray-200">
                                            {question.correctAnswer}
                                        </p>
                                        <p className="text-sm font-medium mt-3">Explanation:</p>
                                        <p className="text-sm mt-1 bg-white p-2 rounded-lg border border-gray-200">
                                            {question.explanation}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Review Comments</span>
                                        </div>

                                        <div className="space-y-3">
                                            {[...(question.comments || []), ...(comments[question.id] || [])].map((comment) => (
                                                <div key={comment.id} className="bg-muted/20 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium">{comment.user}</span>
                                                        <span className="text-muted-foreground">{comment.createdAt}</span>
                                                    </div>
                                                    <div
                                                        className="text-sm mt-2 prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: comment.text }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <RichTextEditor
                                                content={newComment}
                                                onChange={setNewComment}
                                                placeholder="Add your review comment..."
                                                editorClassName="max-h-[180px] border-gray-300"
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() => addComment(question.id)}
                                                    disabled={!newComment.trim()}
                                                    className="mt-2"
                                                >
                                                    Add Comment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}