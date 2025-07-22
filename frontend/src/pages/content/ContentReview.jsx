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
    Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminContentStore } from '../../zustand/admin/contentUnits';

export function ContentReviewComponent() {
    const { toast } = useToast();
    const [reviewComments, setReviewComments] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { content, editContent } = useAdminContentStore();

    const handleReview = (contentId, status) => {
        const contentUnit = content.find(item => item.id === contentId);
        if (!contentUnit) return;

        let updates = {
            ...contentUnit,
            reviews: [
                ...(contentUnit.reviews || []),
                {
                    reviewer: 'Reviewer', // Replace with actual user
                    status: status,
                    comment: reviewComments[contentId] || '',
                    timestamp: new Date().toISOString().split('T')[0]
                }
            ]
        };

        if (status === 'approved') {
            const newReviewCount = (contentUnit.totalReviews || 0) + 1;
            updates = {
                ...updates,
                totalReviews: newReviewCount,
                status: newReviewCount >= (contentUnit.minimumReviews || 3) ? 'published' : 'pending'
            };
        } else {
            updates = {
                ...updates,
                status: status,
                totalReviews: 0 // Reset review count for rejected/needs edit
            };
        }

        editContent(updates);
        setReviewComments(prev => ({ ...prev, [contentId]: '' }));

        toast({
            title: 'Review Submitted',
            description: `Content has been marked as ${status.replace('_', ' ')}.`
        });
    };

    const filteredContent = content.filter(item => {
        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Difficulty filter
        if (difficultyFilter !== 'all' &&
            item.questions?.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) {
            return false;
        }

        // Search filter
        if (searchQuery &&
            !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.questions?.question.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'needs_edit': return 'bg-orange-100 text-orange-800';
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

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search content..."
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
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="needs_edit">Needs Edit</SelectItem>
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
                </CardContent>
            </Card>
            <div className="space-y-4">
                {filteredContent.length > 0 ? (
                    filteredContent.map(contentUnit => (
                        <Card key={contentUnit.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{contentUnit.title}</CardTitle>
                                        <CardDescription>{contentUnit.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(contentUnit.status)}>
                                            {contentUnit.status}
                                        </Badge>
                                        {contentUnit.questions?.difficulty && (
                                            <Badge className={getDifficultyColor(contentUnit.questions.difficulty)}>
                                                {contentUnit.questions.difficulty}
                                            </Badge>
                                        )}
                                        <Badge variant="outline">
                                            Reviews: {contentUnit.totalReviews || 0}/{contentUnit.minimumReviews || 3}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contentUnit?.imageLink && 
                                <img src={contentUnit.imageLink} />
                                }
                                {contentUnit?.videoLink && 
                                    <Input
                                    value={contentUnit?.videoLink}
                                    
                                />
                                }
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentUnit.content }} />

                                {contentUnit.questions && (
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">Associated Question</h4>
                                            {contentUnit.questions.difficulty && (
                                                <Badge className={getDifficultyColor(contentUnit.questions.difficulty)}>
                                                    {contentUnit.questions.difficulty}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="font-medium">{contentUnit.questions.question}</p>
                                        {contentUnit.questions.explanation && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                <span className="font-medium">Explanation:</span> {contentUnit.questions.explanation}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {contentUnit.reviews?.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium">Review History</h4>
                                        {contentUnit.reviews.map((review, i) => (
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

                                <div className="border-t pt-4 space-y-3">
                                    <Textarea
                                        value={reviewComments[contentUnit.id] || ''}
                                        onChange={(e) => setReviewComments({
                                            ...reviewComments,
                                            [contentUnit.id]: e.target.value
                                        })}
                                        placeholder="Add your review comments..."
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex gap-2">
                                        {/* Show Approve button only for pending content with incomplete reviews */}
                                        {contentUnit.status === 'pending' &&
                                            (!contentUnit.totalReviews || contentUnit.totalReviews < (contentUnit.minimumReviews || 3)) && (
                                            
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleReview(contentUnit.id, 'approved')}
                                                >
                                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                            )}

                                        {/* Always show Reject and Needs Edit buttons */}
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleReview(contentUnit.id, 'rejected')}
                                        >
                                            <ThumbsDown className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleReview(contentUnit.id, 'needs_edit')}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Needs Edit
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
                            <h3 className="text-lg font-semibold">No content found</h3>
                            <p className="text-muted-foreground">
                                {statusFilter === 'all'
                                    ? "No content matches your search criteria"
                                    : `No ${statusFilter} content matches your search`}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}