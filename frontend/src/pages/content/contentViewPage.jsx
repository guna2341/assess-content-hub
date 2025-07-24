import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    FileText,
    Video,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle,
    XCircle,
    Share2,
    Printer,
    Edit,
    Eye,
    Pencil,
    Bookmark
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
import { useAuthStore } from '@/stores/authStore';

export function ContentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const contentUnits = useAdminContentStore(state => state.content);
    const { user } = useAuthStore();
    const unit = contentUnits.find(u => u.id === id);
    const [localQuestions, setLocalQuestions] = useState(unit?.questions || []);

    const handleQuestionStatusChange = (questionId, newStatus) => {
        setLocalQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.id === questionId ? { ...q, status: newStatus } : q
            )
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'needs edit': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'published': return <CheckCircle className="h-4 w-4 mr-1" />;
            case 'approved': return <CheckCircle className="h-4 w-4 mr-1" />;
            case 'pending': return <Clock className="h-4 w-4 mr-1" />;
            case 'rejected': return <XCircle className="h-4 w-4 mr-1" />;
            case 'needs edit': return <Pencil className="h-4 w-4 mr-1" />;
            default: return <AlertCircle className="h-4 w-4 mr-1" />;
        }
    };

    const handleShareQuestion = (question) => {
        // In a real app, this would generate a shareable link
        console.log("Sharing question:", question.id);
        alert(`Share link generated for question: ${question.id}`);
    };

    const handlePrintQuestion = (question) => {
        // In a real app, this would open print dialog
        console.log("Printing question:", question.id);
        alert(`Printing question: ${question.id}`);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate('/content')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Units
                </Button>
            </div>

            <Card className="bg-gradient-card border-0 shadow-soft">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">{unit.title}</CardTitle>
                            <p className="text-muted-foreground mt-2">{unit.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-muted/20">
                                {unit.code}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <Separator className="mb-6" />

                <CardContent>
                    <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="mt-6">
                            {unit.imageLink && (
                                <div className="flex justify-center my-4">
                                    <img
                                        src={unit.imageLink}
                                        alt="Content image"
                                        className="max-h-[400px] rounded-lg object-contain"
                                    />
                                </div>
                            )}
                            {unit.videoLink && (
                                <div className="aspect-video bg-black rounded-lg my-4">
                                    <video controls className="w-full h-full">
                                        <source src={unit.videoLink} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {unit.content && (
                                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                                    <h4 className="font-medium mb-2">Content</h4>
                                    <div
                                        className="prose dark:prose-invert max-w-none mt-4"
                                        dangerouslySetInnerHTML={{ __html: unit.content }}
                                    />
                                </div>
                            )}
                            {unit.explanation && (
                                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                                    <h4 className="font-medium mb-2">Explanation</h4>
                                    <p>{unit.explanation}</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="questions" className="mt-6">
                            <div className="space-y-6">
                                {localQuestions.length > 0 ? (
                                    localQuestions.map(question => (
                                        <Card key={question.id}>
                                            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="font-medium text-lg mb-2">Question:</h4>
                                                    <p className="text-lg">{question.question}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">{question.type}</Badge>
                                                    <Badge variant="outline" className={
                                                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                            question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }>
                                                        {question.difficulty}
                                                    </Badge>
                                                    <Badge className={getStatusColor(question.status)}>
                                                        {getStatusIcon(question.status)}
                                                        {question.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {question.type === 'Multiple Choice' && (
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Options:</h4>
                                                        <div className="space-y-2">
                                                            {question.options?.map((option, index) => (
                                                                <div
                                                                    key={option.id}
                                                                    className={`py-2.5 pb-3.5 px-3 rounded-2xl border ${question.correctAnswer === String.fromCharCode(97 + index) ? 'border-green-500 bg-green-50 text-green-500' : 'border-muted'}`}
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="font-medium mr-2">
                                                                            {String.fromCharCode(65 + index)}.
                                                                        </span>
                                                                        <p>{option.text}</p>
                                                                        {question.correctAnswer === String.fromCharCode(97 + index) && (
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

                                                {(question.type === 'Short Answer' || question.type === 'Essay') && (
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Answer:</h4>
                                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <p className="text-green-700">{question.correctAnswer}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {question.explanation && (
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Explanation:</h4>
                                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <p className="text-blue-700">{question.explanation}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap justify-between items-center gap-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Topic:</p>
                                                            <p className="font-medium">{question.topic}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Created By:</p>
                                                            <p className="font-medium">{question.createdBy}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {user.role === "admin" && (
                                                            <>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="border-green-500 text-green-700 hover:bg-green-50">
                                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                                            Publish
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Publish Question</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to publish this question? It will be available to students.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleQuestionStatusChange(question.id, 'published')}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Publish
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="border-blue-500 text-blue-700 hover:bg-blue-50">
                                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                                            Approve
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Approve Question</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to approve this question?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleQuestionStatusChange(question.id, 'approved')}
                                                                                className="bg-blue-600 hover:bg-blue-700"
                                                                            >
                                                                                Approve
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShareQuestion(question)}
                                                        >
                                                            <Share2 className="h-4 w-4 mr-1" />
                                                            Share
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePrintQuestion(question)}
                                                        >
                                                            <Printer className="h-4 w-4 mr-1" />
                                                            Print
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No questions available</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}   