import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ThumbsUp,
    ThumbsDown,
    Edit,
    Clock,
    Filter,
    Search,
    BookOpen,
    Plus,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuestionStore } from '../../zustand/admin/questionBank';
import { useAuthStore } from '@/stores/authStore';

export function QuestionReviewComponent() {
    const { toast } = useToast();
    const [reviewComments, setReviewComments] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTopics, setExpandedTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('all');
    const { questionBank, updateQuestionStatus } = useQuestionStore();
    const { user } = useAuthStore();

    // Flatten all questions from the question bank
    const flattenQuestions = (items, parentPath = '', parentIds = {}) => {
        let questions = [];

        items.forEach(item => {
            const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name;
            const currentIds = { ...parentIds, [item.id]: true };

            if (item.questions && item.questions.length > 0) {
                const questionsWithPath = item.questions.map(question => ({
                    ...question,
                    topicPath: currentPath,
                    parentIds: currentIds,
                    directParentId: item.id
                }));
                questions.push(...questionsWithPath);
            }

            if (item.children && item.children.length > 0) {
                const childQuestions = flattenQuestions(item.children, currentPath, currentIds);
                questions.push(...childQuestions);
            }
        });

        return questions;
    };

    const allQuestions = flattenQuestions(questionBank);

    const handleReview = (questionId, status) => {
        const question = allQuestions.find(q => q.id === questionId);
        if (!question) return;

        const newReview = {
            reviewer: 'Reviewer', // Replace with actual user
            status: status,
            comment: reviewComments[questionId] || '',
            timestamp: new Date().toISOString().split('T')[0]
        };

        // Find the topic that contains this question
        const topicId = question.directParentId;
        if (!topicId) {
            console.error('Could not find topic for question:', questionId);
            return;
        }

        // Update the question in the store
        updateQuestionStatus(topicId, questionId, status, newReview);

        // Clear the comment for this question
        setReviewComments(prev => ({ ...prev, [questionId]: '' }));

        toast({
            title: 'Review Submitted',
            description: `Question has been marked as ${status.replace('_', ' ')}.`
        });
    };

    const toggleTopic = (topicId) => {
        setExpandedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const filteredQuestions = allQuestions.filter(question => {
        // Status filter
        if (statusFilter !== 'all' && question.status !== statusFilter) return false;

        // Difficulty filter
        if (difficultyFilter !== 'all' && question.difficulty !== difficultyFilter) return false;

        // Type filter
        if (typeFilter !== 'all' && question.type !== typeFilter) return false;

        // Topic filter
        if (selectedTopic !== 'all' &&
            !(selectedTopic in (question.parentIds || {})) &&
            question.directParentId !== selectedTopic) {
            return false;
        }

        // Search filter
        if (searchQuery &&
            !question.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !question.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !question.topicPath.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'needs_review':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Multiple Choice':
                return 'bg-blue-100 text-blue-800';
            case 'Short Answer':
                return 'bg-purple-100 text-purple-800';
            case 'Long Answer':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Recursive function to render the topic hierarchy
    const renderTopicTree = (topics, level = 0) => {
        return topics.map(topic => (
            <div key={topic.id} className={`${level > 0 ? 'ml-4' : ''}`}>
                <div className="flex items-center">
                    {/* Expand/Collapse button */}
                    {topic.children && topic.children.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 mr-1"
                        >
                            {expandedTopics.includes(topic.id) ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    )}

                    {/* Topic selection button */}
                    <Button
                        variant={selectedTopic === topic.id ? 'default' : 'ghost'}
                        className="flex-1 justify-start h-auto p-2 font-normal"
                        onClick={() => {
                            setSelectedTopic(topic.id);
                            toggleTopic(topic.id)
                         }}
                    >
                        {!topic.children?.length && <div className="w-6" />}
                        <span className="truncate">{topic.name}</span>
                        {topic.questionCount && (
                            <Badge variant="outline" className="ml-auto">
                                {topic.questionCount}
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* Render children if expanded */}
                {topic.children && topic.children.length > 0 && expandedTopics.includes(topic.id) && (
                    <div className="mt-1">
                        {renderTopicTree(topic.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Review</h1>
                    <p className="text-muted-foreground">
                        Review and approve questions before they're added to the question bank
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Topic Hierarchy Sidebar */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Topics</CardTitle>
                        <CardDescription>Browse questions by topic</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-1">
                            <Button
                                variant={selectedTopic === 'all' ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setSelectedTopic('all')}
                            >
                                <BookOpen className="h-4 w-4 mr-2" />
                                All Topics ({allQuestions.length})
                            </Button>
                            {renderTopicTree(questionBank)}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search questions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="needs_review">Needs Review</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue placeholder="Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Levels</SelectItem>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                                            <SelectItem value="Short Answer">Short Answer</SelectItem>
                                            <SelectItem value="Long Answer">Long Answer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions List */}
                    <div className="space-y-4">
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map(question => (
                                <Card key={question.id}>
                                    <CardContent className="p-6 space-y-4">
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={getStatusColor(question.status)}>
                                                        {question.status?.replace('_', ' ')}
                                                    </Badge>
                                                    {question.type && (
                                                        <Badge className={getTypeColor(question.type)}>
                                                            {question.type}
                                                        </Badge>
                                                    )}
                                                    {question.difficulty && (
                                                        <Badge className={getDifficultyColor(question.difficulty)}>
                                                            {question.difficulty}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="prose prose-sm max-w-none mb-2">
                                                    <h3 className="text-base font-medium">{question.question}</h3>
                                                </div>

                                                <div className="text-xs text-muted-foreground mb-2">
                                                    {question.topicPath}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>By {question.createdBy || 'Unknown'}</span>
                                                    <span>•</span>
                                                    <span>{question.createdAt || 'No date'}</span>
                                                    <span>•</span>
                                                    <span>{question.reviews?.length || 0} reviews</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MCQ Options */}
                                        {question.type === 'Multiple Choice' && question.options && (
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <h4 className="font-medium text-sm mb-2">Answer Options:</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {question.options.map((option, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <span className={`text-sm font-medium ${question.correctAnswer === String.fromCharCode(65 + index)
                                                                    ? 'text-green-600' : 'text-muted-foreground'
                                                                }`}>
                                                                {String.fromCharCode(65 + index)}.
                                                            </span>
                                                            <span className={
                                                                question.correctAnswer === String.fromCharCode(65 + index)
                                                                    ? 'text-green-600 font-medium' : ''
                                                            }>
                                                                {option}
                                                            </span>
                                                            {question.correctAnswer === String.fromCharCode(65 + index) && (
                                                                <Badge className="bg-green-100 text-green-800 ml-auto">
                                                                    Correct
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Short/Long Answer */}
                                        {(question.type === 'Short Answer' || question.type === 'Long Answer') && question.correctAnswer && (
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <h4 className="font-medium text-sm mb-2">Expected Answer:</h4>
                                                <p className="text-sm">{question.correctAnswer}</p>
                                            </div>
                                        )}

                                        {/* Explanation */}
                                        {question.explanation && (
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <h4 className="font-medium text-sm mb-2">Explanation:</h4>
                                                <p className="text-sm">{question.explanation}</p>
                                            </div>
                                        )}

                                        {/* Review History */}
                                        {question.reviews?.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium">Review History</h4>
                                                {question.reviews.map((review, i) => (
                                                    <div key={i} className="bg-muted/30 p-3 rounded-lg">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{review.reviewer}</span>
                                                            <Badge className={getStatusColor(review.status)}>
                                                                {review.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm">{review.comment}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{review.timestamp}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Review Form */}
                                        <div className="border-t pt-4 space-y-3">
                                            <Textarea
                                                value={reviewComments[question.id] || ''}
                                                onChange={(e) => setReviewComments({
                                                    ...reviewComments,
                                                    [question.id]: e.target.value
                                                })}
                                                placeholder="Add your review comments..."
                                                className="min-h-[100px]"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleReview(question.id, 'approved')}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleReview(question.id, 'rejected')}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    <ThumbsDown className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={() => handleReview(question.id, 'needs_review')}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Needs Review
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold">No questions found</h3>
                                    <p className="text-muted-foreground">
                                        {statusFilter === 'all'
                                            ? "No questions match your search criteria"
                                            : `No ${statusFilter} questions match your search`}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}