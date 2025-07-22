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
    CheckCircle,
    Clock,
    Filter,
    Search,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuestionStore } from '../../zustand/admin/questionBank';

export function QuestionReviewComponent() {
    const { toast } = useToast();
    const [reviewComments, setReviewComments] = useState({});
    const [statusFilter, setStatusFilter] = useState('pending');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTopics, setExpandedTopics] = useState([]);
    const { questionBank, addCommentToQuestion, findTopicIdForQuestion, updateQuestionInTopic } = useQuestionStore();

    // Flatten all questions for filtering
    const flattenQuestions = (items) => {
        let questions = [];
        items.forEach(item => {
            if (item.questions) {
                questions.push(...item.questions);
            }
            if (item.children) {
                questions.push(...flattenQuestions(item.children));
            }
        });
        return questions;
    };

    const allQuestions = flattenQuestions(questionBank);

    const handleReview = (questionId, status) => {
        const question = allQuestions.find(q => q.id === questionId);
        if (!question) return;

        const topicId = findTopicIdForQuestion(questionId);
        if (!topicId) return;

        const newComment = {
            user: 'Reviewer', // Replace with actual user
            text: reviewComments[questionId] || '',
            type: status,
            createdAt: new Date().toISOString().split('T')[0]
        };

        let updatedQuestion = { ...question };

        if (status === 'approved') {
            updatedQuestion.status = 'approved';
        } else if (status === 'rejected') {
            updatedQuestion.status = 'rejected';
        } else if (status === 'needs_edit') {
            updatedQuestion.status = 'needs_review';
        }

        // Add the comment
        updatedQuestion.comments = [...(updatedQuestion.comments || []), newComment];

        // Update the question in the store
        updateQuestionInTopic(topicId, updatedQuestion);
        addCommentToQuestion(topicId, questionId, newComment);

        setReviewComments(prev => ({ ...prev, [questionId]: '' }));

        toast({
            title: 'Review Submitted',
            description: `Question has been marked as ${status.replace('_', ' ')}.`
        });
    };

    const filteredQuestions = allQuestions.filter(question => {
        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'pending' && question.status !== 'pending') return false;
            if (statusFilter === 'approved' && question.status !== 'approved') return false;
            if (statusFilter === 'rejected' && question.status !== 'rejected') return false;
            if (statusFilter === 'needs_review' && question.status !== 'needs_review') return false;
        }

        // Difficulty filter
        if (difficultyFilter !== 'all' &&
            question.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) {
            return false;
        }

        // Search filter
        if (searchQuery &&
            !question.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !question.explanation?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'needs_review': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleTopic = (topicId) => {
        setExpandedTopics(prev =>
            prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
        );
    };

    // Recursive function to render topic tree with questions
    const renderTopicTree = (topics, level = 0) => {
        return topics.map(topic => {
            const hasQuestions = topic.questions && topic.questions.length > 0;
            const hasChildren = topic.children && topic.children.length > 0;
            const isExpanded = expandedTopics.includes(topic.id);

            return (
                <div key={topic.id} className={`${level > 0 ? 'ml-4' : ''} mb-2`}>
                    <div
                        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded"
                        onClick={() => toggleTopic(topic.id)}
                    >
                        {hasChildren && (
                            <div className="mr-2">
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </div>
                        )}
                        <span className="font-medium">{topic.name}</span>
                        {hasQuestions && (
                            <Badge variant="outline" className="ml-auto">
                                {topic.questions.length} questions
                            </Badge>
                        )}
                    </div>

                    {isExpanded && (
                        <div className="mt-1 space-y-2">
                            {hasQuestions && topic.questions.map(question => (
                                <Card key={question.id} className="ml-4">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base">{question.question}</CardTitle>
                                                <CardDescription>
                                                    {topic.name} • {question.difficulty}
                                                </CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(question.status)}>
                                                {question.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {question.options && (
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <h4 className="font-medium text-sm mb-2">Options:</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {question.options.map((option, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <span className={`text-sm font-medium ${question.correctAnswer === String.fromCharCode(65 + index)
                                                                    ? 'text-green-600'
                                                                    : 'text-muted-foreground'
                                                                }`}>
                                                                {String.fromCharCode(65 + index)}.
                                                            </span>
                                                            <span className={
                                                                question.correctAnswer === String.fromCharCode(65 + index)
                                                                    ? 'text-green-600 font-medium'
                                                                    : ''
                                                            }>
                                                                {option}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {question.explanation && (
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <h4 className="font-medium text-sm mb-2">Explanation:</h4>
                                                <p className="text-sm">{question.explanation}</p>
                                            </div>
                                        )}

                                        {question.comments?.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-sm">Review History:</h4>
                                                {question.comments.map((comment, i) => (
                                                    <div key={i} className="bg-muted/30 p-3 rounded-lg">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium text-sm">{comment.user}</span>
                                                            <Badge className={getStatusColor(comment.type)}>
                                                                {comment.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm">{comment.text}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{comment.createdAt}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {question.status !== 'approved' && (
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
                                                        variant="success"
                                                        onClick={() => handleReview(question.id, 'approved')}
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => handleReview(question.id, 'rejected')}
                                                    >
                                                        <ThumbsDown className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => handleReview(question.id, 'needs_edit')}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Needs Edit
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {hasChildren && renderTopicTree(topic.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Review</h1>
                    <p className="text-muted-foreground">
                        Review and approve questions in the question bank
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="needs_review">Needs Review</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
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
                            {renderTopicTree(questionBank)}
                        </div>
                    </CardContent>
                </Card>

                {/* Questions List */}
                <div className="lg:col-span-3 space-y-4">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map(question => (
                            <Card key={question.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base">{question.question}</CardTitle>
                                            <CardDescription>
                                                {question.difficulty} • {question.type}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(question.status)}>
                                            {question.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {question.options && (
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h4 className="font-medium text-sm mb-2">Options:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {question.options.map((option, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span className={`text-sm font-medium ${question.correctAnswer === String.fromCharCode(65 + index)
                                                                ? 'text-green-600'
                                                                : 'text-muted-foreground'
                                                            }`}>
                                                            {String.fromCharCode(65 + index)}.
                                                        </span>
                                                        <span className={
                                                            question.correctAnswer === String.fromCharCode(65 + index)
                                                                ? 'text-green-600 font-medium'
                                                                : ''
                                                        }>
                                                            {option}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {question.explanation && (
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h4 className="font-medium text-sm mb-2">Explanation:</h4>
                                            <p className="text-sm">{question.explanation}</p>
                                        </div>
                                    )}

                                    {question.comments?.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-sm">Review History:</h4>
                                            {question.comments.map((comment, i) => (
                                                <div key={i} className="bg-muted/30 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-sm">{comment.user}</span>
                                                        <Badge className={getStatusColor(comment.type)}>
                                                            {comment.type}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm">{comment.text}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{comment.createdAt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question.status !== 'approved' && (
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
                                                    variant="success"
                                                    onClick={() => handleReview(question.id, 'approved')}
                                                >
                                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleReview(question.id, 'rejected')}
                                                >
                                                    <ThumbsDown className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleReview(question.id, 'needs_edit')}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Needs Edit
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
    );
}