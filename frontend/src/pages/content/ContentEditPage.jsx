import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    ArrowLeft,
    Save,
    Video,
    Image as ImageIcon,
    X,
    AlertCircle,
    Eye,
    Trash2,
    HelpCircle,
    Plus,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAdminContentStore } from '../../zustand/admin/contentUnits';
import { Badge } from '@/components/ui/badge';

export function ContentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        image: false,
        video: false
    });

    const contentUnits = useAdminContentStore(state => state.content);
    const unit = contentUnits.find(u => u.id === id);
    const editContent = useAdminContentStore(state => state.editContent);

    const [formValues, setFormValues] = useState({
        id: '',
        title: '',
        code: '',
        content: '',
        description: '',
        imageLink: '',
        videoLink: '',
        explanation: '',
        language: 'en',
        status: 'draft',
        contentType: 'html',
        questions: []
    });

    useEffect(() => {
        if (unit) {
            setFormValues({
                id: unit.id,
                title: unit.title,
                code: unit.code,
                content: unit.content || '',
                description: unit.description || '',
                imageLink: unit.imageLink || '',
                videoLink: unit.videoLink || '',
                explanation: unit.explanation || '',
                language: unit.language || 'en',
                contentType: unit.contentType || 'html',
                questions: unit.questions?.length > 0 ? unit.questions.map(q => ({
                    id: q.id || crypto.randomUUID(),
                    question: q.question || '',
                    type: q.type || 'Short Answer',
                    topic: q.topic || '',
                    difficulty: q.difficulty || 'Easy',
                    correctAnswer: q.correctAnswer || '',
                    explanation: q.explanation || '',
                    options: q.options?.length > 0 ? q.options.map(opt => ({
                        id: opt.id || crypto.randomUUID(),
                        text: opt.text || '',
                        isCorrect: opt.isCorrect || false
                    })) : []
                })) : [{
                    id: crypto.randomUUID(),
                    question: '',
                    type: 'Short Answer',
                    topic: '',
                    difficulty: 'Easy',
                    correctAnswer: '',
                    explanation: '',
                    options: []
                }]
            });
        }
    }, [unit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestionChange = (questionIndex, field, value) => {
        setFormValues(prev => {
            const updatedQuestions = [...prev.questions];
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                [field]: value
            };
            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        setFormValues(prev => {
            const updatedQuestions = [...prev.questions];
            const updatedOptions = [...updatedQuestions[questionIndex].options];

            updatedOptions[optionIndex] = {
                ...updatedOptions[optionIndex],
                [field]: value
            };

            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: updatedOptions
            };

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    const handleSelectChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(prev => ({ ...prev, image: true }));
            const imageUrl = URL.createObjectURL(file);
            setFormValues(prev => ({
                ...prev,
                imageLink: imageUrl,
                contentType: 'mixed'
            }));
            setLoading(prev => ({ ...prev, image: false }));
        }
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(prev => ({ ...prev, video: true }));
            const videoUrl = URL.createObjectURL(file);
            setFormValues(prev => ({
                ...prev,
                videoLink: videoUrl,
                contentType: 'mixed'
            }));
            setLoading(prev => ({ ...prev, video: false }));
        }
    };

    const handleRemoveImage = () => {
        setFormValues(prev => ({
            ...prev,
            imageLink: '',
            contentType: !prev.videoLink && !prev.content ? 'html' : prev.contentType
        }));
    };

    const handleRemoveVideo = () => {
        setFormValues(prev => ({
            ...prev,
            videoLink: '',
            contentType: !prev.imageLink && !prev.content ? 'html' : prev.contentType
        }));
    };

    const handleAddOption = (questionIndex) => {
        setFormValues(prev => {
            const updatedQuestions = [...prev.questions];
            if (updatedQuestions[questionIndex].options.length >= 6) return prev;

            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: [
                    ...updatedQuestions[questionIndex].options,
                    { id: crypto.randomUUID(), text: '', isCorrect: false }
                ]
            };

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        setFormValues(prev => {
            const updatedQuestions = [...prev.questions];
            if (updatedQuestions[questionIndex].options.length <= 2) return prev;

            const newOptions = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);

            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: newOptions,
                correctAnswer: updatedQuestions[questionIndex].correctAnswer === String.fromCharCode(97 + optionIndex) ? '' : updatedQuestions[questionIndex].correctAnswer
            };

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    const handleAddQuestion = () => {
        setFormValues(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: crypto.randomUUID(),
                    question: '',
                    type: 'Short Answer',
                    topic: '',
                    difficulty: 'Easy',
                    correctAnswer: '',
                    explanation: '',
                    options: []
                }
            ]
        }));
    };

    const handleRemoveQuestion = (questionIndex) => {
        if (formValues.questions.length <= 1) {
            toast({
                title: "Cannot remove last question",
                description: "Each unit must have at least one question",
                variant: "destructive"
            });
            return;
        }

        setFormValues(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== questionIndex)
        }));
    };

    const handleContentChange = (content) => {
        setFormValues(prev => ({
            ...prev,
            content
        }));
    };

    const onSubmit = () => {
        editContent(formValues);
        toast({
            title: "Content updated successfully",
            description: `"${formValues.title}" has been saved.`,
        });
    };

    if (!unit) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    The learning unit you're trying to edit doesn't exist or may have been removed.
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
                <Button variant="outline" onClick={() => navigate(`/content`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setFormValues(unit)}>
                        <X className="h-4 w-4 mr-2" />
                        Discard Changes
                    </Button>
                    <Button onClick={onSubmit}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-gradient-card border-0 shadow-soft">
                    <CardHeader>
                        <div className="flex flex-col flex-wrap md:hidden gap-2 items">
                            <p className='text-md font-semibold'>Code:</p>
                            <Input
                                name="code"
                                placeholder="Code"
                                className="w-auto"
                                value={formValues.code}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                                <div className='flex flex-col gap-2'>
                                    <p className='text-xl font-semibold border-none shadow-none focus-visible:ring-0'>Title:</p>
                                    <Input
                                        name="title"
                                        placeholder="Learning unit title"
                                        className="text-2xl font-semibold border-none shadow-none focus-visible:ring-0"
                                        value={formValues.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-md'>SubHeading:</p>
                                    <div className='w-[500px]'>
                                        <Textarea
                                            name="description"
                                            placeholder="Brief description of the content"
                                            className="border-none w-full shadow-none focus-visible:ring-0 resize-none text-muted-foreground"
                                            value={formValues.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex md:flex-col gap-2">
                                <p className='text-md font-semibold'>Code:</p>
                                <Input
                                    name="code"
                                    placeholder="Code"
                                    className="w-auto"
                                    value={formValues.code}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <Separator className="mb-6" />

                    <CardContent>
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="content">Content</TabsTrigger>
                                <TabsTrigger value="questions">Questions</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="mt-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label>Image Content</label>
                                        <div className="space-y-2">
                                            {formValues.imageLink && (
                                                <div className="border rounded-lg p-4 bg-muted/20 flex flex-col items-center justify-center">
                                                    {loading.image && <ImageIcon className="h-24 w-24 text-muted-foreground mx-auto" />}
                                                    <img
                                                        src={formValues.imageLink}
                                                        alt="Content image"
                                                        className="max-w-full max-h-[400px] object-contain"
                                                        onLoad={() => setLoading(prev => ({ ...prev, image: false }))}
                                                        onError={() => setLoading(prev => ({ ...prev, image: false }))}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="flex-1"
                                                />
                                                {formValues.imageLink && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label>Video Content</label>
                                        <div className="space-y-2">
                                            {formValues.videoLink && (
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                    {loading.video && (
                                                        <div className="h-full flex items-center justify-center">
                                                            <Video className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <video
                                                        controls
                                                        className="w-full h-full"
                                                        src={formValues.videoLink}
                                                        onCanPlay={() => setLoading(prev => ({ ...prev, video: false }))}
                                                        onError={() => setLoading(prev => ({ ...prev, video: false }))}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoUpload}
                                                    className="flex-1"
                                                />
                                                {formValues.videoLink && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={handleRemoveVideo}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label>Text Content</label>
                                        <RichTextEditor
                                            key={formValues.id}
                                            content={formValues.content}
                                            onChange={handleContentChange}
                                            placeholder="Enter your learning content here (supports HTML)"
                                            className="min-h-[300px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label>Explanation</label>
                                        <Textarea
                                            name="explanation"
                                            placeholder="Provide a detailed explanation of the content"
                                            className="min-h-[100px]"
                                            value={formValues.explanation}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="questions">
                                <div className="mt-4 space-y-6">
                                    {formValues.questions.map((question, qIndex) => (
                                        <Card key={question.id}>
                                            <CardHeader className="flex flex-row justify-between items-center">
                                                <CardTitle className="flex items-center gap-2">
                                                    <HelpCircle className="h-5 w-5" />
                                                    Question {qIndex + 1}
                                                </CardTitle>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveQuestion(qIndex)}
                                                    disabled={formValues.questions.length <= 1}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <label>Question Text</label>
                                                    <Textarea
                                                        name="question"
                                                        placeholder="Enter the question text"
                                                        className="min-h-[80px]"
                                                        value={question.question}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <label>Type</label>
                                                        <Select
                                                            value={question.type}
                                                            onValueChange={(value) => {
                                                                handleQuestionChange(qIndex, 'type', value);
                                                                if (value !== 'Multiple Choice') {
                                                                    handleQuestionChange(qIndex, 'options', []);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select question type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Short Answer">Short Answer</SelectItem>
                                                                <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                                                                <SelectItem value="Long Answer">Long Answer</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label>Topic</label>
                                                        <Input
                                                            name="topic"
                                                            placeholder="Enter topic"
                                                            value={question.topic}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'topic', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label>Difficulty</label>
                                                        <Select
                                                            value={question.difficulty}
                                                            onValueChange={(value) => handleQuestionChange(qIndex, 'difficulty', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select difficulty" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Easy">Easy</SelectItem>
                                                                <SelectItem value="Medium">Medium</SelectItem>
                                                                <SelectItem value="Hard">Hard</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {question.type === 'Multiple Choice' && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label>Answer Options (Minimum 2, Maximum 6)</label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAddOption(qIndex)}
                                                                disabled={question.options.length >= 6}
                                                            >
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Add Option
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {question.options.map((option, optIndex) => (
                                                                <div key={option.id} className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium w-6">
                                                                        {String.fromCharCode(65 + optIndex)}.
                                                                    </span>
                                                                    <Input
                                                                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                                        value={option.text}
                                                                        onChange={(e) => handleOptionChange(qIndex, optIndex, 'text', e.target.value)}
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveOption(qIndex, optIndex)}
                                                                        disabled={question.options.length <= 2}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label>Correct Answer</label>
                                                            <Select
                                                                value={question.correctAnswer}
                                                                onValueChange={(value) => handleQuestionChange(qIndex, 'correctAnswer', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select correct answer" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {question.options.map((option, optIndex) => (
                                                                        <SelectItem
                                                                            key={option.id}
                                                                            value={String.fromCharCode(97 + optIndex)}
                                                                        >
                                                                            {String.fromCharCode(65 + optIndex)}. {option.text}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}

                                                {question.type !== 'Multiple Choice' && (
                                                    <div className="space-y-2">
                                                        <label>Correct Answer</label>
                                                        <Textarea
                                                            placeholder="Enter the correct answer"
                                                            className="min-h-[60px]"
                                                            value={question.correctAnswer}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <label>Explanation</label>
                                                    <Textarea
                                                        name="explanation"
                                                        placeholder="Explain why this is the correct answer"
                                                        className="min-h-[80px]"
                                                        value={question.explanation}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Button
                                        onClick={handleAddQuestion}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Question
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="preview">
                                <div className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="h-5 w-5" />
                                                Content Preview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {formValues.content && (
                                                    <div className="p-4 bg-muted/20 rounded-lg">
                                                        <h4 className="font-medium mb-3">Text Content:</h4>
                                                        <div
                                                            className="prose dark:prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: formValues.content }}
                                                        />
                                                    </div>
                                                )}

                                                {formValues.imageLink && (
                                                    <div className="p-4 bg-muted/20 rounded-lg">
                                                        <h4 className="font-medium mb-3">Image Content:</h4>
                                                        <div className="flex justify-center">
                                                            <img
                                                                src={formValues.imageLink}
                                                                alt="Content preview"
                                                                className="max-w-full max-h-[500px] object-contain rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {formValues.videoLink && (
                                                    <div className="p-4 bg-muted/20 rounded-lg">
                                                        <h4 className="font-medium mb-3">Video Content:</h4>
                                                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                            <video
                                                                controls
                                                                className="w-full h-full"
                                                                src={formValues.videoLink}
                                                            >
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </div>
                                                    </div>
                                                )}

                                                {formValues.explanation && (
                                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <h4 className="font-medium mb-2 text-blue-800">Explanation:</h4>
                                                        <p className="text-blue-700">{formValues.explanation}</p>
                                                    </div>
                                                )}

                                                {/* Questions Preview Section */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-lg">Questions:</h4>
                                                    {formValues.questions.map((question, qIndex) => (
                                                        <div key={question.id} className="space-y-6">
                                                            {/* Question Header */}
                                                            <div className="p-4 bg-muted/20 rounded-lg">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium text-lg mb-2">Question {qIndex + 1}:</h4>
                                                                        <p className="text-lg">{question.question}</p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Badge variant="outline">{question.type}</Badge>
                                                                        <Badge variant="outline" className={
                                                                            question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                                                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-red-100 text-red-800'
                                                                        }>
                                                                            {question.difficulty}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Question Type Specific Display */}
                                                            {question.type === 'Multiple Choice' && (
                                                                <div className="p-4 bg-muted/20 rounded-lg">
                                                                    <h4 className="font-medium mb-3">Options:</h4>
                                                                    <div className="space-y-2">
                                                                        {question.options?.map((option, index) => (
                                                                            <div
                                                                                key={index}
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
                                                                <div className="p-4 bg-muted/20 rounded-lg">
                                                                    <h4 className="font-medium mb-2">Answer:</h4>
                                                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                        <h4 className="font-medium text-green-800 mb-1">Expected Answer:</h4>
                                                                        <p className="text-green-700">{question.correctAnswer}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Explanation */}
                                                            {question.explanation && (
                                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                                    <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                                                                    <p className="text-blue-700">{question.explanation}</p>
                                                                </div>
                                                            )}

                                                            {/* Metadata */}
                                                            <div className="p-4 bg-muted/20 rounded-lg">
                                                                <h4 className="font-medium mb-3">Question Details</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground">Topic:</p>
                                                                        <p className="font-medium">{question.topic}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground">Status:</p>
                                                                        <Badge variant="outline" className={
                                                                            question.status === 'published' ? 'bg-green-100 text-green-800' :
                                                                                question.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-red-100 text-red-800'
                                                                        }>
                                                                            {question.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-4 bg-muted/20 rounded-lg">
                                                    <h4 className="font-medium mb-2">Content Details:</h4>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <p>Code: {formValues.code}</p>
                                                        <p>Type: {formValues.contentType}</p>
                                                        <p>Status: {formValues.status}</p>
                                                        <p>Language: {formValues.language}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}