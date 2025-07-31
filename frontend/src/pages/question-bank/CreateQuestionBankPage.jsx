import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Minus,
  Save,
  Eye,
  X,
  BookOpen,
  FileText,
  CheckCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Folder,
  User,
  MessageSquare
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuestionStore } from '../../zustand/questionBank/questionBank';

function TopicModal({
  isOpen,
  onClose,
  onSubmit,
  topicName,
  setTopicName,
  isSubTopic = false
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSubTopic ? (
              <>
                <FolderPlus className="h-5 w-5" />
                Add New Subtopic
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add New Topic
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">
              {isSubTopic ? "Subtopic Name" : "Topic Name"}
            </Label>
            <Input
              id="topic-name"
              placeholder={`Enter ${isSubTopic ? 'subtopic' : 'topic'} name...`}
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!topicName.trim()}>
              {isSubTopic ? 'Add Subtopic' : 'Add Topic'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function QuestionCreator() {
  const { 
    questionBank, 
    addTopic, 
    addQuestionToTopic, 
    updateQuestionInTopic, 
    deleteQuestionFromTopic, 
    deleteTopicFromBank,
    addCommentToQuestion
  } = useQuestionStore();
  
  const [activeTopic, setActiveTopic] = useState(questionBank[0]?.id || '');
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'Multiple Choice',
    difficulty: 'Easy',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    comments: []
  });

  // Initialize expanded topics with the first level
  if (expandedTopics.length === 0 && questionBank.length > 0) {
    setExpandedTopics(questionBank.map(topic => topic.id));
  }

  const findTopicById = (topics, id) => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      if (topic.children) {
        const found = findTopicById(topic.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getTopicPath = (topics, targetId, path= []) => {
    for (const topic of topics) {
      const currentPath = [...path, topic];
      if (topic.id === targetId) {
        return currentPath;
      }
      if (topic.children) {
        const found = getTopicPath(topic.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const countQuestions = (topic) => {
    let count = topic.questions?.length || 0;
    if (topic.children) {
      count += topic.children.reduce((sum, child) => sum + countQuestions(child), 0);
    }
    return count;
  };

  const handleAddTopic = (parentId) => {
    setCurrentParentId(parentId);
    setNewTopicName('');
    setShowTopicModal(true);
  };

  const submitTopic = () => {
    if (!newTopicName.trim()) return;

    const newTopic = {
      id: `${currentParentId || 'root'}-${Date.now()}`,
      name: newTopicName,
      questions: [],
      children: []
    };

    addTopic(newTopic, currentParentId);
    setShowTopicModal(false);
    setActiveTopic(newTopic.id);
    if (currentParentId) {
      setExpandedTopics(prev => [...prev, currentParentId]);
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const resetForm = () => {
    setQuestionForm({
      question: '',
      type: 'Multiple Choice',
      difficulty: 'Easy',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      comments: []
    });
    setEditingQuestion(null);
  };

  const addQuestion = () => {
    if (!questionForm.question.trim()) return;

    const newQuestion = {
      id: Date.now().toString(),
      ...questionForm,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };

    addQuestionToTopic(activeTopic, newQuestion);
    resetForm();
  };

  const editQuestion = (questionny) => {
    setQuestionForm({
      question: question.question,
      type: question.type,
      difficulty: question.difficulty,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      comments: [...(question.comments || [])]
    });
    setEditingQuestion(question.id);
  };

  const updateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestion = {
      ...questionForm,
      id: editingQuestion,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };

    updateQuestionInTopic(activeTopic, updatedQuestion);
    resetForm();
  };

  const deleteQuestion = (questionId) => {
    deleteQuestionFromTopic(activeTopic, questionId);
  };

  const deleteTopic = (topicId) => {
    const topicToDelete = findTopicById(questionBank, topicId);
    if (!topicToDelete) return;

    const hasContent = (topicToDelete.questions?.length > 0) || (topicToDelete.children?.length > 0);

    if (hasContent && !confirm('This topic contains questions or subtopics. Are you sure you want to delete it?')) {
      return;
    }

    deleteTopicFromBank(topicId);

    if (activeTopic === topicId) {
      if (questionBank.length > 0) {
        setActiveTopic(questionBank[0].id);
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    if (questionForm.options.length < 6) {
      setQuestionForm({
        ...questionForm,
        options: [...questionForm.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (questionForm.options.length > 2) {
      const newOptions = questionForm.options.filter((_, i) => i !== index);
      setQuestionForm({ ...questionForm, options: newOptions });

      const correctIndex = questionForm.correctAnswer.charCodeAt(0) - 65;
      if (correctIndex === index) {
        setQuestionForm(prev => ({ ...prev, correctAnswer: '' }));
      } else if (correctIndex > index) {
        setQuestionForm(prev => ({
          ...prev,
          correctAnswer: String.fromCharCode(65 + correctIndex - 1)
        }));
      }
    }
  };

  const handleAddComment = (questionId) => {
    if (!newComment.trim()) return;
    addCommentToQuestion(activeTopic, questionId, newComment);
    setNewComment('');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Multiple Choice':
        return 'bg-blue-100 text-blue-800';
      case 'Short Answer':
        return 'bg-green-100 text-green-800';
      case 'Long Answer':
        return 'bg-purple-100 text-purple-800';
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

  const getCommentTypeColor = (type) => {
    switch (type) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      case 'needs_edit':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTopicTree = (topics, level = 0) => {
    return topics.map(topic => {
      const hasHiddenChildren = topic.children?.length > 0 && !expandedTopics.includes(topic.id);

      return (
        <div key={topic.id} className={`${level > 0 ? 'ml-2 pl-4 border-gray-200' : ''}`}>
          <div className="flex items-center gap-1 group py-1">
            <Collapsible
              open={expandedTopics.includes(topic.id)}
              onOpenChange={() => toggleTopic(topic.id)}
              className="flex-1 min-w-0 w-full"
            >
              <div className="flex items-center gap-1 min-w-0">
                <CollapsibleTrigger asChild>
                  <Button
                    variant={activeTopic === topic.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-auto p-2 font-normal min-w-0 ${level > 0 ? 'pl-2' : ''}`}
                    onClick={() => setActiveTopic(topic.id)}
                  >
                    <div className="flex items-center min-w-0">
                      {topic.children?.length > 0 && (
                        expandedTopics.includes(topic.id) ? (
                          <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                        )
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate">{topic.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>{topic.name}</TooltipContent>
                      </Tooltip>
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <div className="hidden opacity-0 group-hover:opacity-100 group-hover:flex transition-opacity space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTopic(topic.id);
                    }}
                    className="bg-white h-8 w-8 p-0"
                    title="Add subtopic"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTopic(topic.id);
                    }}
                    className="h-8 w-8 p-0 bg-white text-red-500 hover:text-red-700"
                    title="Delete topic"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {hasHiddenChildren && (
                <Tooltip>
                  <TooltipContent
                    side="right"
                    align="start"
                    className="z-[100] bg-background border border-gray-200 shadow-lg"
                    onPointerDownOutside={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-col gap-1 py-1">
                      {topic.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                          {child.children?.length > 0 ? (
                            <Folder className="h-3 w-3 flex-shrink-0 text-gray-500" />
                          ) : (
                            <FileText className="h-3 w-3 flex-shrink-0 text-gray-500" />
                          )}
                          <span className="text-sm">{child.name}</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
              {topic.children?.length > 0 && expandedTopics.includes(topic.id) && (
                <CollapsibleContent className="mt-1">
                  {renderTopicTree(topic.children, level + 1)}
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        </div>
      );
    });
  };

  const activeTopicData = findTopicById(questionBank, activeTopic);
  const topicPath = getTopicPath(questionBank, activeTopic);
  const totalQuestions = questionBank.reduce((sum, topic) => sum + countQuestions(topic), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <TopicModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        onSubmit={submitTopic}
        topicName={newTopicName}
        setTopicName={setNewTopicName}
        isSubTopic={!!currentParentId}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Question Creator</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and organize questions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Total Questions: <span className="font-medium">{totalQuestions}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="w-full sm:w-auto bg-gray-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topics Hierarchy
              </CardTitle>
              <CardDescription>Manage your nested topic structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddTopic()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Root Topic
              </Button>

                            <div className="space-y-1 overflow-y-auto overflow-x-auto max-h-[calc(100vh-300px)] scrollbar-none">
                                {renderTopicTree(questionBank)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

        <div className="lg:col-span-3 space-y-6">
          {topicPath && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-1">
                  <span>Current Topic:</span>
                  <div className="flex items-center flex-wrap gap-1">
                    {topicPath.map((topic, index) => (
                      <div key={topic.id} className="flex items-center">
                        {index > 0 && <span className="mx-1">/</span>}
                        <div
                          onClick={() => setActiveTopic(topic.id)}
                          className="h-auto p-1 font-medium text-primary hover:text-primary cursor-pointer"
                        >
                          {topic.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!previewMode ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    {editingQuestion ? 'Edit Question' : 'Create New Question'}
                  </CardTitle>
                  <CardDescription>
                    Add questions to <strong>{activeTopicData?.name}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your question here..."
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Question Type</Label>
                      <Select
                        value={questionForm.type}
                        onValueChange={(value) => setQuestionForm({ ...questionForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                          <SelectItem value="Short Answer">Short Answer</SelectItem>
                          <SelectItem value="Long Answer">Long Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={questionForm.difficulty}
                        onValueChange={(value) => setQuestionForm({ ...questionForm, difficulty: value })}
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

                  {questionForm.type === 'Multiple Choice' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Answer Options</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                          disabled={questionForm.options.length >= 6}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="font-medium text-sm w-6">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                              disabled={questionForm.options.length <= 2}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <Select
                          value={questionForm.correctAnswer}
                          onValueChange={(value) => setQuestionForm({ ...questionForm, correctAnswer: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionForm.options.map((option, index) => (
                              option.trim() && (
                                <SelectItem key={index} value={String.fromCharCode(65 + index)}>
                                  {String.fromCharCode(65 + index)}. {option}
                                </SelectItem>
                              )
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {(questionForm.type === 'Short Answer' || questionForm.type === 'Long Answer') && (
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Expected Answer</Label>
                      <Textarea
                        id="correctAnswer"
                        placeholder="Enter the expected answer or key points..."
                        value={questionForm.correctAnswer}
                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                        className={questionForm.type === 'Long Answer' ? 'min-h-[120px]' : 'min-h-[80px]'}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Provide an explanation for the answer..."
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={editingQuestion ? updateQuestion : addQuestion}
                      disabled={!questionForm.question.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingQuestion ? 'Update Question' : 'Save Question'}
                    </Button>

                    {editingQuestion && (
                      <Button variant="outline" onClick={resetForm}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Questions in {activeTopicData?.name} ({activeTopicData?.questions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeTopicData?.questions || activeTopicData.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No questions created yet in this topic.</p>
                  <p className="text-sm">Start by creating your first question above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTopicData.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium text-sm">#{index + 1}</span>
                            <Badge className={getTypeColor(question.type)}>
                              {question.type}
                            </Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            {question.status && (
                              <Badge variant="outline">
                                {question.status.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{question.question}</p>
                        </div>

                        {!previewMode && (
                          <div className="flex gap-2 sm:self-start">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editQuestion(question)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteQuestion(question.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {question.type === 'Multiple Choice' && question.options && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <p className="font-medium text-sm">Options:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${question.correctAnswer === String.fromCharCode(65 + optIndex)
                                  ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className={
                                  question.correctAnswer === String.fromCharCode(65 + optIndex)
                                    ? 'text-green-600 font-medium' : 'text-gray-700'
                                }>
                                  {option}
                                </span>
                                {question.correctAnswer === String.fromCharCode(65 + optIndex) && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type !== 'Multiple Choice' && question.correctAnswer && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm mb-1">Expected Answer:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.correctAnswer}</p>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="font-medium text-sm mb-1">Explanation:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.explanation}</p>
                        </div>
                      )}

                      {question.comments && question.comments.length > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="h-4 w-4" />
                            <h4 className="font-medium">Comments ({question.comments.length})</h4>
                          </div>
                          <div className="space-y-3">
                            {question.comments.map((comment, commentIndex) => (
                              <div key={commentIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="bg-gray-100 rounded-full p-1">
                                  <User className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{comment.user}</span>
                                    {comment.type && comment.type !== 'comment' && (
                                      <Badge className={getCommentTypeColor(comment.type)}>
                                        {comment.type.replace('_', ' ')}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newComment.trim()) {
                                handleAddComment(question.id);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleAddComment(question.id)}
                            disabled={!newComment.trim()}
                          >
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}