import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Eye,
  MessageSquare,
  ThumbsUp,
  Edit,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useQuestionStore } from '../../zustand/admin/questionBank';

export function QuestionBankPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('suggestion');
  const [expandedTopics, setExpandedTopics] = useState(['math', 'algebra', 'science', 'physics']);

  // Get question bank and actions from Zustand store
  const { questionBank, addCommentToQuestion, findTopicIdForQuestion } = useQuestionStore();

  // Recursively flatten all questions from the question bank with their path info
  const flattenQuestions = (items, parentPath = '', parentIds = {}) => {
    let questions = [];

    items.forEach(item => {
      const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name;
      const currentIds = { ...parentIds, [item.id]: true };

      // Add questions from current level
      if (item.questions && item.questions.length > 0) {
        const questionsWithPath = item.questions.map(question => ({
          ...question,
          topicPath: currentPath,
          parentIds: currentIds,
          directParentId: item.id
        }));
        questions.push(...questionsWithPath);
      }

      // Recursively process children
      if (item.children && item.children.length > 0) {
        const childQuestions = flattenQuestions(item.children, currentPath, currentIds);
        questions.push(...childQuestions);
      }
    });

    return questions;
  };

  const allQuestions = flattenQuestions(questionBank);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs_review':
        return 'bg-red-100 text-red-800';
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

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleAddComment = (questionId) => {
    if (!commentText.trim()) return;

    // Find the topic ID that contains this question
    const topicId = findTopicIdForQuestion(questionId);
    if (!topicId) {
      console.error('Could not find topic for question:', questionId);
      return;
    }

    const newComment = {
      user: 'Current User', // Replace with actual user from auth
      text: commentText,
      type: commentType,
    };

    // Add the comment to the question in the store
    addCommentToQuestion(topicId, questionId, newComment);

    // Reset the comment input
    setCommentText('');
    setCommentType('suggestion');
    setShowCommentBox(null);
  };

  // Recursive function to render the topic hierarchy
  const renderTopicTree = (topics, level = 0) => {
    return topics.map(topic => (
      <div key={topic.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center">
          {/* Expand/Collapse button - separate from selection */}
          {topic.children && topic.children.length > 0 && (
            <div className='mr-2'>
              {expandedTopics.includes(topic.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}

          {/* Topic selection button */}
          <Button
            variant={selectedTopic === topic.id ? 'default' : 'ghost'}
            className="flex-1 justify-start h-auto p-2 font-normal"
            onClick={() => {
              setSelectedTopic(topic.id)
              toggleTopic(topic.id);
            }}
          >
            {!topic.children?.length && <div className="w-8" />}
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

  // Filter questions based on search and filters
  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if selected topic matches any parent in the hierarchy
    const matchesTopic = selectedTopic === 'all' ||
      selectedTopic in (question.parentIds || {}) ||
      question.directParentId === selectedTopic;

    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || question.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || question.status === selectedStatus;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesType && matchesStatus;
  });

  // Get unique question types for filter
  const questionTypes = [...new Set(allQuestions.map(q => q.type).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">
            Organize and manage questions by topic hierarchy ({allQuestions.length} total questions)
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
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
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

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {questionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <Card key={question.id || index}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {question.type && (
                              <Badge className={getTypeColor(question.type)}>
                                {question.type}
                              </Badge>
                            )}
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge className={getStatusColor(question.status)}>
                              {question.status?.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="prose prose-sm max-w-none mb-2">
                            <h3 className="text-base font-medium">{question.question}</h3>
                          </div>

                          <div className="text-xs text-muted-foreground mb-2">
                            {question.topicPath}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {question.createdBy}</span>
                            <span>•</span>
                            <span>{question.createdAt}</span>
                            <span>•</span>
                            <span>{question.comments?.length || 0} comments</span>
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

                      {/* Comments Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Comments ({question.comments?.length || 0})</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCommentBox(showCommentBox === question.id ? null : question.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Add Comment
                          </Button>
                        </div>

                        {/* Existing Comments */}
                        {question.comments?.map((comment) => (
                          <div key={comment.id} className="bg-muted/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                                {comment.type === 'approved' && <ThumbsUp className="h-3 w-3 text-green-600" />}
                                {comment.type === 'needs_edit' && <Edit className="h-3 w-3 text-yellow-600" />}
                                {comment.type === 'suggestion' && <MessageSquare className="h-3 w-3 text-blue-600" />}
                              </div>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        ))}

                        {/* Add Comment Box */}
                        {showCommentBox === question.id && (
                          <div className="space-y-3">
                            <Select
                              value={commentType}
                              onValueChange={setCommentType}
                              defaultValue="suggestion"
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Comment type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="suggestion">Suggestion</SelectItem>
                                <SelectItem value="approved">Approval</SelectItem>
                                <SelectItem value="needs_edit">Needs Edit</SelectItem>
                              </SelectContent>
                            </Select>
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add your review comment..."
                              className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => {
                                setShowCommentBox(null);
                                setCommentText('');
                              }}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleAddComment(question.id)}>
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-muted-foreground">
                    No questions found matching your criteria
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}