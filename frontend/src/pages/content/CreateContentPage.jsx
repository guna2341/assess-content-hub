import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileUpload } from '@/components/ui/file-upload';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminContentStore } from '../../zustand/admin/contentUnits';

export function CreateContentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createContent = useAdminContentStore(state => state.createContent);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    content: '',
    imageLink: '',
    videoLink: '',
    language: 'en',
    description: '',
    explanation: '',
    contentType: 'html'
  });

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: '',
      type: 'Short Answer',
      topic: '',
      difficulty: 'Easy',
      correctAnswer: '',
      explanation: '',
      options: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputMethod, setInputMethod] = useState('upload');

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFileSelect = (files, type) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      if (type === "image") {
        setFormData(prev => ({ ...prev, imageLink: fileUrl }));
      } else if (type === "video") {
        setFormData(prev => ({ ...prev, videoLink: fileUrl }));
      }
    }
  };

  const addNewQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        question: '',
        type: 'Short Answer',
        topic: '',
        difficulty: 'Easy',
        correctAnswer: '',
        explanation: '',
        options: []
      }
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestionField = (id, field, value) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          if (field === 'type' && value === 'Multiple Choice' && !q.options) {
            return { ...q, [field]: value, options: ['', '', '', ''], correctAnswer: '' };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const updateQuestionOption = (id, optionIndex, value) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            options: q.options?.map((opt, idx) => (idx === optionIndex ? value : opt))
          };
        }
        return q;
      })
    );
  };

  const addOption = (id) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            options: [...(q.options || []), '']
          };
        }
        return q;
      })
    );
  };

  const removeOption = (id, optionIndex) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            options: q.options?.filter((_, idx) => idx !== optionIndex),
            correctAnswer:
              q.correctAnswer === String.fromCharCode(65 + optionIndex)
                ? ''
                : q.correctAnswer
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate content based on type
    if (formData.contentType === 'html' && !formData.content) {
      toast({
        title: 'Error!',
        description: 'Text content is required',
        variant: "error"
      });
      setLoading(false);
      return;
    }

    if (formData.contentType === 'video' && !formData.videoLink) {
      toast({
        title: 'Error!',
        description: 'Video content is required',
        variant: "error"
      });
      setLoading(false);
      return;
    }

    if (formData.contentType === 'image' && !formData.imageLink) {
      toast({
        title: 'Error!',
        description: 'Image content is required',
        variant: "error"
      });
      setLoading(false);
      return;
    }

    const response = await createContent({
      ...formData,
      questions: questions.map(q => ({
        question: q.question,
        type: q.type,
        topic: q.topic,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        ...(q.type === 'Multiple Choice' && { options: q.options })
      }))
    });
    setLoading(false);

    if (response?.state) {
      toast({
        title: 'Learning Unit Created!',
        description: `"${formData.title}" has been created successfully with ${questions.length} questions and sent for review.`,
        variant: "success"
      });
    } else {
      toast({
        title: 'Error!',
        description: response?.message || 'Failed to create content',
        variant: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/content')}>
          <ArrowLeft className="!h-8 !w-8" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Learning Unit</h1>
          <p className="text-muted-foreground">
            Add new educational content with associated questions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Set up the fundamental details of your learning unit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Unit Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., MATH-101"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter the learning unit title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what students will learn"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Type Selection */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardHeader>
            <CardTitle>Content Type</CardTitle>
            <CardDescription>
              Choose how you want to deliver this learning content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { type: 'html', label: 'Text Content', icon: FileText, desc: 'Written content with rich formatting' },
                { type: 'video', label: 'Video Content', icon: Video, desc: 'Educational videos' },
                { type: 'image', label: 'Image Content', icon: ImageIcon, desc: 'Visual learning materials' },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = formData.contentType === option.type;
                return (
                  <Button
                    key={option.type}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-wrap"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, contentType: option.type }));
                      setInputMethod('upload');
                    }}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    <div className="text-center">
                      <div className="font-medium">{option.label}</div>
                      <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {option.desc}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Content Input Based on Type */}
            {formData.contentType === 'html' && (
              <div className="space-y-2">
                <Label>Text Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your educational content here. Use the toolbar for formatting, code blocks, and mathematical formulas..."
                  className="min-h-[300px] p-0"
                />
              </div>
            )}

            {(formData.contentType === 'video' || formData.contentType === 'image') && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={inputMethod === 'upload' ? 'default' : 'outline'}
                    onClick={() => setInputMethod('upload')}
                  >
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={inputMethod === 'link' ? 'default' : 'outline'}
                    onClick={() => setInputMethod('link')}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Use Link
                  </Button>
                </div>

                {inputMethod === 'upload' ? (
                  formData.contentType === 'video' ? (
                    <div className="space-y-2">
                      <Label>Upload Video *</Label>
                      <FileUpload
                        onFileSelect={(files) => handleFileSelect(files, "video")}
                        accept={{ 'video/*': ['.mp4', '.webm', '.ogg'] }}
                        maxSize={100 * 1024 * 1024} // 100MB
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Selected: {uploadedFiles[0].name}
                        </div>
                      )}
                      {formData.videoLink && (
                        <div className="mt-4">
                          <video controls className="max-h-60 rounded-md">
                            <source src={formData.videoLink} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Upload Image *</Label>
                      {formData.imageLink ? (
                        <img src={formData.imageLink} alt="Preview" className="max-h-60 rounded-md" />
                      ) : (
                        <FileUpload
                          onFileSelect={(files) => handleFileSelect(files, "image")}
                          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                          maxSize={10 * 1024 * 1024} // 10MB
                        />
                      )}
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <Label>{formData.contentType === 'video' ? 'Video URL' : 'Image URL'} *</Label>
                    <Input
                      placeholder={`Enter ${formData.contentType} URL`}
                      value={formData.contentType === 'video' ? formData.videoLink : formData.imageLink}
                      onChange={(e) => {
                        if (formData.contentType === 'video') {
                          setFormData(prev => ({ ...prev, videoLink: e.target.value }));
                        } else {
                          setFormData(prev => ({ ...prev, imageLink: e.target.value }));
                        }
                      }}
                    />
                    {formData.contentType === 'video' && formData.videoLink && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Note: The video should be embeddable (YouTube, Vimeo, etc.)
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (formData.contentType === 'video') {
                        setFormData(p => ({ ...p, videoLink: "" }));
                      } else {
                        setFormData(p => ({ ...p, imageLink: "" }));
                      }
                      setUploadedFiles([]);
                    }}
                  >
                    Remove {formData.contentType}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 mt-4">
              <Label>Explanation</Label>
              <Textarea
                placeholder="Explain the key concepts of this content"
                value={formData.explanation}
                onChange={(e) => setFormData(p => ({ ...p, explanation: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Associated Questions ({questions.length})
              </CardTitle>
              <Button
                type="button"
                onClick={addNewQuestion}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>
            <CardDescription>
              Add questions that students will answer after reviewing the content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-4 border rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length <= 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <h3 className="font-medium">Question {index + 1}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={q.type}
                      onValueChange={(value) => updateQuestionField(q.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short Answer">Short Answer</SelectItem>
                        <SelectItem value="Long Answer">Long Answer</SelectItem>
                        <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input
                      placeholder="Enter topic (e.g., variables)"
                      value={q.topic}
                      onChange={(e) => updateQuestionField(q.id, 'topic', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={q.difficulty}
                      onValueChange={(value) => updateQuestionField(q.id, 'difficulty', value)}
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

                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    placeholder="Enter your question here..."
                    value={q.question}
                    onChange={(e) => updateQuestionField(q.id, 'question', e.target.value)}
                    rows={3}
                  />
                </div>

                {q.type === 'Multiple Choice' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Answer Options</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(q.id)}
                        disabled={q.options?.length >= 6}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    {q.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-6">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          value={option}
                          onChange={(e) => updateQuestionOption(q.id, optIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(q.id, optIndex)}
                          disabled={q.options?.length <= 2}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={q.correctAnswer}
                        onValueChange={(value) => updateQuestionField(q.id, 'correctAnswer', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options?.map((option, optIndex) => (
                            option && (
                              <SelectItem
                                key={optIndex}
                                value={String.fromCharCode(65 + optIndex)}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </SelectItem>
                            )
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {(q.type === 'Short Answer' || q.type === 'Long Answer') && (
                  <div className="space-y-2">
                    <Label>Expected Answer</Label>
                    <Textarea
                      placeholder="Provide the expected answer"
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestionField(q.id, 'correctAnswer', e.target.value)}
                      rows={q.type === 'Long Answer' ? 4 : 2}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Explanation</Label>
                  <Textarea
                    placeholder="Explain why this is the correct answer"
                    value={q.explanation}
                    onChange={(e) => updateQuestionField(q.id, 'explanation', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex items-center justify-between p-6 bg-gradient-card rounded-lg border shadow-soft">
          <div>
            <p className="font-medium">Ready to create learning unit?</p>
            <p className="text-sm text-muted-foreground">
              This will be sent for review by 3 reviewers before being available to students.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Loading..." : "Create Unit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}