import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    FileText,
    Video,
    Image as ImageIcon,
    BookOpen,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Link,
    Download,
    Share2,
    Bookmark,
    Printer,
    Edit,
    Eye,
    Shield,
    Pencil
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAdminContentStore } from '../../zustand/admin/contentUnits';

// Your actual data structure
export function ContentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adminAction, setAdminAction] = useState(null);
    const contentUnits = useAdminContentStore(state => state.content);
    // Use the mock data instead of Zustand store
    const unit = contentUnits.find(u => u.id === id);
    const [status, setStatus] = useState(unit.status);

    // Mock admin check - in real app, this would come from user context/auth
    const isAdmin = true;

    const handleAdminAction = (action) => {
        if (action === 'approve') {
            setStatus("approved");
            unit.status = 'published';
            unit.correct = 'yes';
            unit.reviewStatus = 'completed';
        } else if (action === 'reject') {
            setStatus("rejected");
            unit.status = 'rejected';
            unit.correct = 'no';
            unit.totalReviews = 0;
            unit.reviewStatus = 'rejected';
        }
        setAdminAction(null);
    };

    if (!unit) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The learning unit you're looking for doesn't exist or may have been removed.
                </p>
                <Button onClick={() => navigate('/content')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Content List
                </Button>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'published': return CheckCircle;
            case 'review': return Clock;
            case 'draft': return AlertCircle;
            default: return AlertCircle;
        }
    };

    const getColor = (status) => {
        switch (status) {
            case 'approved':
            case 'published':
                return 'bg-success/10 text-success';
            case 'pending':
                return 'bg-warning/10 text-warning';
            case 'rejected':
                return 'bg-destructive/10 text-destructive';
            case 'needs edit':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-muted/10 text-muted-foreground';
        }
    };

    function getIcon(status) {
        switch (status) {
            case 'approved':
            case 'published':
                return <CheckCircle className="h-4 w-4 mr-1" />;
            case 'pending':
                return <Clock className="h-4 w-4 mr-1" />
            case 'rejected':
                return <XCircle className="h-4 w-4 mr-1" />;
            case 'needs edit':
                return <Pencil className="h-4 w-4 mr-1" />;
            default:
                return <AlertCircle className="h-4 w-4 mr-1"/>;
        }
    }



    function handleReview() {
        unit.status = "pending";
        setStatus("pending");
    }

    const getContentTypeIcon = (type) => {
        switch (type) {
            case 'video': return Video;
            case 'image': return ImageIcon;
            default: return FileText;
        }
    };
    const ContentIcon = getContentTypeIcon(unit.contentType);
    const StatusIcon = getStatusIcon(unit.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate('/content')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Units
                </Button>

                <div className="flex gap-2">
                    <Badge className={getColor(status)}>
                        {getIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <div className="flex gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Publish
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Approve Content Unit</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to approve this content unit? This will publish the content and make it available to students.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleAdminAction('approve')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Approve
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50 hover:text-red-800">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reject Content Unit</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to reject this content unit? This will mark the content as rejected and prevent it from being published.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleAdminAction('reject')}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Reject
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    {unit.status == "pending" &&
                        <Button variant="outline" onClick={() => navigate(`/reviews`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Review
                        </Button>
                    }
                    {unit.status == "rejected" &&
                        <Button variant="outline" onClick={handleReview}>
                            <Edit className="h-4 w-4 mr-2" />
                            Add to Review
                        </Button>
                    }

                    <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            <Card className="bg-gradient-card border-0 shadow-soft">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">{unit.title}</CardTitle>
                            <p className="text-muted-foreground mt-2">{unit.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="bg-muted/20">
                                {unit.code}
                            </Button>
                            <Button variant="outline">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {unit.status}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <Separator className="mb-6" />

                <CardContent>
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content">
                            {unit?.imageLink &&
                                <div className="flex justify-center my-4">
                                    <img
                                        src={unit?.imageLink}
                                        alt="Content image"
                                        className="max-h-[400px] rounded-lg object-contain"
                                    />
                                </div>
                            }
                            {unit?.videoLink &&
                                <div className="aspect-video bg-black rounded-lg my-4">
                                    <video controls className="w-full h-full">
                                        <source src={unit?.videoLink} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>}
                            {unit?.content &&
                                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                                    <h4 className="font-medium mb-2">Content</h4>
                                    <div
                                        className="prose dark:prose-invert max-w-none mt-4"
                                        dangerouslySetInnerHTML={{ __html: unit.content }}
                                    />
                                </div>
                            }
                            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                                <h4 className="font-medium mb-2">Explanation</h4>
                                <p>{unit.explanation}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview">
                            <div className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Eye className="h-5 w-5" />
                                            Question Preview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {unit.questions ? (
                                            <div className="space-y-6">
                                                {/* Question Header */}
                                                <div className="p-4 bg-muted/20 rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-lg mb-2">Question:</h4>
                                                            <p className="text-lg">{unit.questions.question}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline">{unit.questions.type}</Badge>
                                                            <Badge variant="outline" className={
                                                                unit.questions.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                                    unit.questions.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                            }>
                                                                {unit.questions.difficulty}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Question Type Specific Display */}
                                                {unit.questions.type === 'Multiple Choice' && (
                                                    <div className="p-4 bg-muted/20 rounded-lg">
                                                        <h4 className="font-medium mb-3">Options:</h4>
                                                        <div className="space-y-2">
                                                            {unit.questions.options?.map((option, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`py-2.5 pb-3.5 px-3 rounded-2xl border ${unit.questions.correctAnswer === String.fromCharCode(97 + index) ? 'border-green-500 bg-green-50 text-green-500' : 'border-muted'}`}
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="font-medium mr-2">
                                                                            {String.fromCharCode(65 + index)}.
                                                                        </span>
                                                                        <p>{option.text}</p>
                                                                        {unit.questions.correctAnswer === String.fromCharCode(97 + index) && (
                                                                            <span className="ml-auto text-green-600 flex items-center">
                                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                                Correct Answer
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {(unit.questions.type === 'Short Answer' || unit.questions.type === 'Essay') && (
                                                    <div className="p-4 bg-muted/20 rounded-lg">
                                                        <h4 className="font-medium mb-2">Answer:</h4>
                                                        {unit.questions.type === 'Short Answer' ? (
                                                            <div className="p-3 bg-white rounded-xl border border-muted">
                                                                <p className="text-muted-foreground">[Short text answer input would appear here]</p>
                                                            </div>
                                                        ) : (
                                                            <div className="p-3 bg-white rounded border border-muted min-h-[100px]">
                                                                <p className="text-muted-foreground">[Long form essay answer input would appear here]</p>
                                                            </div>
                                                        )}
                                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <h4 className="font-medium text-green-800 mb-1">Expected Answer:</h4>
                                                            <p className="text-green-700">{unit.questions.correctAnswer}</p>
                                                        </div>
                                                    </div>
                                                )}

                                              
                                                {/* Explanation */}
                                                {unit.questions.explanation && (
                                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                                                        <p className="text-blue-700">{unit.questions.explanation}</p>
                                                    </div>
                                                )}

                                                {/* Metadata */}
                                                <div className="p-4 bg-muted/20 rounded-lg">
                                                    <h4 className="font-medium mb-3">Question Details</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Topic:</p>
                                                            <p className="font-medium">{unit.questions.topic}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Status:</p>
                                                            <Badge variant="outline" className={
                                                                unit.status === 'published' ? 'bg-green-100 text-green-800' :
                                                                    unit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                            }>
                                                                {unit.status}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Created By:</p>
                                                            <p className="font-medium">{unit.createdBy}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Created At:</p>
                                                            <p className="font-medium">{unit.createdAt}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground">No questions available</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}