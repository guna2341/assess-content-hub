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
        imageLink: '',
        videoLink: '',
        explanation: '',
        language: 'en',
        status: 'draft',
        contentType: 'html',
        questions: {
            id: '',
            question: '',
            type: 'Short Answer',
            topic: '',
            difficulty: 'Easy',
            correctAnswer: '',
            explanation: '',
            options: []
        }
    });
    
    useEffect(() => {
        if (unit) {
            setFormValues({
                id: unit.id,
                title: unit.title,
                code: unit.code,
                content: unit.content || '',
                description:unit.description,
                imageLink: unit.imageLink || '',
                videoLink: unit.videoLink || '',
                explanation: unit.explanation || '',
                language: unit.language || 'en',
                status: unit.status || 'draft',
                contentType: unit.contentType || 'html',
                questions: unit.questions ? {
                    id: unit.questions.id || '',
                    question: unit.questions.question || '',
                    type: unit.questions.type || 'Short Answer',
                    topic: unit.questions.topic || '',
                    difficulty: unit.questions.difficulty || 'Easy',
                    correctAnswer: unit.questions.correctAnswer || '',
                    explanation: unit.questions.explanation || '',
                    options: unit.questions.options || []
                } : {
                    id: '',
                    question: '',
                    type: 'Short Answer',
                    topic: '',
                    difficulty: 'Easy',
                    correctAnswer: '',
                    explanation: '',
                    options: []
                }
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

    const handleNestedInputChange = (e, parentField) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [name]: value
            }
        }));
    };

    const handleSelectChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNestedSelectChange = (value, parentField, name) => {
        setFormValues(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [name]: value
            }
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

    const handleAddOption = () => {
        if (formValues.questions.options.length >= 6) return;

        setFormValues(prev => ({
            ...prev,
            questions: {
                ...prev.questions,
                options: [
                    ...prev.questions.options,
                    { id: crypto.randomUUID(), text: '', isCorrect: false }
                ]
            }
        }));
    };

    const handleRemoveOption = (index) => {
        if (formValues.questions.options.length <= 2) return;

        const newOptions = formValues.questions.options.filter((_, i) => i !== index);
        setFormValues(prev => ({
            ...prev,
            questions: {
                ...prev.questions,
                options: newOptions,
                correctAnswer: prev.questions.correctAnswer === String.fromCharCode(65 + index) ? '' : prev.questions.correctAnswer
            }
        }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formValues.questions.options];
        newOptions[index] = {
            ...newOptions[index],
            [field]: value
        };

        setFormValues(prev => ({
            ...prev,
            questions: {
                ...prev.questions,
                options: newOptions
            }
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
                                <div className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <HelpCircle className="h-5 w-5" />
                                                Question Editor
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <label>Question Text</label>
                                                <Textarea
                                                    name="question"
                                                    placeholder="Enter the question text"
                                                    className="min-h-[80px]"
                                                    value={formValues.questions.question}
                                                    onChange={(e) => handleNestedInputChange(e, 'questions')}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label>Type</label>
                                                    <Select
                                                        value={formValues.questions.type}
                                                        onValueChange={(value) => {
                                                            handleNestedSelectChange(value, 'questions', 'type');
                                                            if (value !== 'Multiple Choice') {
                                                                setFormValues(prev => ({
                                                                    ...prev,
                                                                    questions: {
                                                                        ...prev.questions,
                                                                        options: []
                                                                    }
                                                                }));
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
                                                        value={formValues.questions.topic}
                                                        onChange={(e) => handleNestedInputChange(e, 'questions')}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label>Difficulty</label>
                                                    <Select
                                                        value={formValues.questions.difficulty}
                                                        onValueChange={(value) => handleNestedSelectChange(value, 'questions', 'difficulty')}
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

                                            {formValues.questions.type === 'Multiple Choice' && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label>Answer Options (Minimum 2, Maximum 6)</label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleAddOption}
                                                            disabled={formValues.questions.options.length >= 6}
                                                        >
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Add Option
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {formValues.questions.options.map((option, index) => (
                                                            <div key={option.id} className="flex items-center gap-2">
                                                                <span className="text-sm font-medium w-6">
                                                                    {String.fromCharCode(65 + index)}.
                                                                </span>
                                                                <Input
                                                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                                    value={option.text}
                                                                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveOption(index)}
                                                                    disabled={formValues.questions.options.length <= 2}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label>Correct Answer</label>
                                                        <Select
                                                            onValueChange={(value) => handleNestedSelectChange(value, 'questions', 'correctAnswer')}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={`${String.fromCharCode(formValues.questions.correctAnswer.charCodeAt(0)-32)}. ${formValues.questions.options[formValues.questions.correctAnswer.charCodeAt(0) - 97].text}`}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {formValues.questions.options.map((option, index) => (
                                                                    <SelectItem
                                                                        key={option.id}
                                                                        value={String.fromCharCode(65 + index)}
                                                                    >
                                                                        {String.fromCharCode(65 + index)}. {option.text}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}

                                            {formValues.questions.type !== 'Multiple Choice' && (
                                                <div className="space-y-2">
                                                    <label>Correct Answer</label>
                                                        <Textarea
                                                            placeholder="Enter the correct answer"
                                                            className="min-h-[60px]"
                                                            value={formValues.questions.correctAnswer}
                                                            onChange={(e) => handleNestedInputChange(e, 'questions')}
                                                        />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label>Explanation</label>
                                                <Textarea
                                                    name="explanation"
                                                    placeholder="Explain why this is the correct answer"
                                                    className="min-h-[80px]"
                                                    value={formValues.questions.explanation}
                                                    onChange={(e) => handleNestedInputChange(e, 'questions')}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
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
                                                {formValues.questions.question && (
                                                    <div className="p-4 bg-muted/20 rounded-lg border">
                                                        <h4 className="font-medium mb-3">Question Preview:</h4>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <h5 className="font-medium">Question:</h5>
                                                                <p>{formValues.questions.question}</p>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="space-y-1">
                                                                    <h5 className="font-medium">Type:</h5>
                                                                    <p>{formValues.questions.type}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <h5 className="font-medium">Topic:</h5>
                                                                    <p>{formValues.questions.topic}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <h5 className="font-medium">Difficulty:</h5>
                                                                    <p>{formValues.questions.difficulty}</p>
                                                                </div>
                                                            </div>

                                                            {formValues.questions.type === 'Multiple Choice' && formValues.questions.options.length > 0 && (
                                                                <div className="space-y-3">
                                                                    <h5 className="font-medium">Options:</h5>
                                                                    <ul className="space-y-2">
                                                                        {formValues.questions.options.map((option, index) => (
                                                                            <li key={option.id} className="flex items-start gap-2">
                                                                                <span className="font-medium">
                                                                                    {String.fromCharCode(65 + index)}.
                                                                                </span>
                                                                                <div>
                                                                                    <p>{option.text}</p>
                                                                                    {formValues.questions.correctAnswer === String.fromCharCode(65 + index)}
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            <div className="space-y-2">
                                                                <h5 className="font-medium">Correct Answer:</h5>
                                                                {formValues.questions.type === 'Multiple Choice' ? (
                                                                    <p>
                                                                        {formValues.questions.correctAnswer}
                                                                    </p>
                                                                ) : (
                                                                    <p>{formValues.questions.correctAnswer}</p>
                                                                )}
                                                            </div>

                                                            {formValues.questions.explanation && (
                                                                <div className="space-y-2">
                                                                    <h5 className="font-medium">Explanation:</h5>
                                                                    <p>{formValues.questions.explanation}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

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