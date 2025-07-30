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
    HelpCircle
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
      videoLink:'',
      language: 'en',
      description: '',
      explanation:''
    });

    const [question, setQuestion] = useState({
      question: '',
      type: 'Short Answer',
      topic: '',
      difficulty: 'Easy',
      correctAnswer: '',
      explanation: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleContentChange = (content) => {
      setFormData(prev => ({ ...prev, content }));
    };

    const handleFileSelect = (files,type) => {
      setUploadedFiles(files);
      if (files.length > 0) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        if (type == "image") {
            setFormData(prev => ({ ...prev, imageLink: imageUrl }));
        }
      }
    };

    const updateQuestionField = (field, value) => {
      setQuestion(prev => {
        if (field === 'type' && value === 'Multiple Choice' && !prev.options) {
          return { ...prev, [field]: value, options: ['', '', '', ''] };
        }
        return { ...prev, [field]: value };
      });
    };

    const updateQuestionOption = (optionIndex, value) => {
      setQuestion(prev => ({
        ...prev,
        options: prev.options?.map((opt, idx) => idx === optionIndex ? value : opt)
      }));
    };

    const addOption = () => {
      setQuestion(prev => ({
        ...prev,
        options: [...(prev.options || []), '']
      }));
    };

    const removeOption = (optionIndex) => {
      setQuestion(prev => ({
        ...prev,
        options: prev.options?.filter((_, idx) => idx !== optionIndex),
        // Reset correct answer if it was the removed option
        correctAnswer: prev.correctAnswer === String.fromCharCode(65 + optionIndex)
          ? ''
          : prev.correctAnswer
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
        createContent({
          ...formData,
          questions: {
            question: question.question,
            type: question.type,
            topic: question.topic,
            difficulty: question.difficulty,
            correctAnswer: question.correctAnswer,
            ...(question.type === 'Multiple Choice' && { options: question.options })
          }
        });

        toast({
          title: 'Learning Unit Created!',
          description: `"${formData.title}" has been created successfully and sent for review.`,
        });
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
              Add new educational content with associated question
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
                  { type: 'video', label: 'Video Content', icon: Video, desc: 'Upload educational videos' },
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
                      onClick={() => setFormData(prev => ({ ...prev, contentType: option.type }))}
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

              {formData.contentType === 'video' && (
                <div className="space-y-2">
                  <Label>Upload Video *</Label>
                  <FileUpload

                    onFileSelect={handleFileSelect}
                    accept={{ 'video/*': ['.mp4', '.webm', '.ogg'] }}
                    maxSize={100 * 1024 * 1024} // 100MB
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {uploadedFiles[0].name}
                    </div>
                  )}
                </div>
              )}

              {formData.contentType === 'image' && (
                <div className="space-y-2">
                  <Label>Upload Image *</Label>
                  {
                    formData.imageLink ? <img src={formData.imageLink} /> :
                      <FileUpload
                        onFileSelect={(e) => handleFileSelect(e, "image")}
                        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                        maxSize={10 * 1024 * 1024} // 10MB
                      />
                  }
                  <div className='flex justify-end'>
                  <Button
                      type="button"
                      variant="destructive"
                    onClick={() => setFormData(p => ({...p,imageLink:""}))}
                  >
                   Remove image
                    </Button>
                  </div>
                  {formData.imageLink && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {formData.imageLink}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2 mt-2">
                <Label>Explanation</Label>
                <Textarea
                  placeholder="Explain why this is the correct answer"
                  value={formData.explanation}
                  onChange={(e) => setFormData(p => ({...p,explanation:e.target.value}))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Question Section */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Associated Question
              </CardTitle>
              <CardDescription>
                Add the question that students will answer after reviewing the content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestionField('type', value)}
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
                    value={question.topic}
                    onChange={(e) => updateQuestionField('topic', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={question.difficulty}
                    onValueChange={(value) => updateQuestionField('difficulty', value)}
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
                  value={question.question}
                  onChange={(e) => updateQuestionField('question', e.target.value)}
                  rows={3}
                />
              </div>

              {question.type === 'Multiple Choice' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Answer Options</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      disabled={question.options?.length >= 6}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-6">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        value={option}
                        onChange={(e) => updateQuestionOption(optIndex, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(optIndex)}
                        disabled={question.options?.length <= 2}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) => updateQuestionField('correctAnswer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option, optIndex) => (
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

              {(question.type === 'Short Answer' || question.type === 'Long Answer') && (
                <div className="space-y-2">
                  <Label>Expected Answer</Label>
                  <Textarea
                    placeholder="Provide the expected answer"
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestionField('correctAnswer', e.target.value)}
                    rows={question.type === 'Long Answer' ? 4 : 2}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Explanation</Label>
                <Textarea
                  placeholder="Explain why this is the correct answer"
                  value={question.explanation}
                  onChange={(e) => updateQuestionField('explanation', e.target.value)}
                  rows={3}
                />
              </div>
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
              <Button type="button" variant="outline" onClick={() => navigate('/content')}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Unit
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }