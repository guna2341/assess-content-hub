import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Send,
    Edit, 
    MessageSquare,
    Clock,
    ThumbsUp,
    AlertCircle,
    Check,
    X,
    Mail,
    Search,
    ArrowLeft,
    FileText,
    Users,
    Calendar,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export const CommentsPage = () => {
    const { toast } = useToast();
    const [faculties, setFaculties] = useState([
        {
            id: '1',
            name: 'Dr. Sarah Smith',
            email: 'dr.smith@university.edu',
            avatar: '/avatars/faculty1.jpg',
            department: 'Chemistry',
            status: 'active',
            isOnline: true,
            lastActive: '2024-01-20T14:30:00Z',
            questionsCount: 8,
            approvedQuestions: 6,
            questions: [
                {
                    id: 'q1',
                    question: 'What is the chemical formula for water and explain its molecular structure?',
                    type: 'Multiple Choice',
                    status: 'approved',
                    createdAt: '2024-01-18T09:20:00Z',
                    difficulty: 'Easy',
                    category: 'Basic Chemistry',
                    comments: [
                        {
                            id: 'c1',
                            text: 'Excellent question for basic chemistry knowledge. The explanation is clear and comprehensive.',
                            user: 'admin',
                            type: 'approved',
                            createdAt: '2024-01-18T10:30:00Z'
                        }
                    ]
                },
                {
                    id: 'q2',
                    question: 'Explain the concept of covalent bonding with examples',
                    type: 'Long Answer',
                    status: 'needs_revision',
                    createdAt: '2024-01-15T11:45:00Z',
                    difficulty: 'Medium',
                    category: 'Chemical Bonding',
                    comments: [
                        {
                            id: 'c1',
                            text: 'Please provide more specific examples and include diagrams for better understanding.',
                            user: 'admin',
                            type: 'needs_edit',
                            createdAt: '2024-01-15T13:20:00Z'
                        }
                    ]
                }
            ],
            messages: [
                {
                    id: 'm1',
                    text: 'Hi Admin, I wanted to follow up on my question about covalent bonding. I have made the requested changes.',
                    sender: 'faculty',
                    createdAt: '2024-01-20T10:15:00Z',
                    read: true
                },
                {
                    id: 'm2',
                    text: 'I\'ve added the molecular diagrams and additional examples as requested. Please review when you get a chance.',
                    sender: 'faculty',
                    createdAt: '2024-01-20T11:30:00Z',
                    read: false
                }
            ]
        },
        {
            id: '2',
            name: 'Prof. Michael Johnson',
            email: 'prof.johnson@university.edu',
            avatar: '/avatars/faculty2.jpg',
            department: 'Physics',
            status: 'active',
            isOnline: false,
            lastActive: '2024-01-19T16:45:00Z',
            questionsCount: 12,
            approvedQuestions: 10,
            questions: [
                {
                    id: 'q3',
                    question: 'Describe Newton\'s laws of motion with real-world applications',
                    type: 'Essay',
                    status: 'pending_review',
                    createdAt: '2024-01-19T14:20:00Z',
                    difficulty: 'Hard',
                    category: 'Classical Mechanics',
                    comments: []
                }
            ],
            messages: [
                {
                    id: 'm3',
                    text: 'Good afternoon! I\'ve submitted a new question about Newton\'s laws. Looking forward to your feedback.',
                    sender: 'faculty',
                    createdAt: '2024-01-19T14:25:00Z',
                    read: true
                }
            ]
        }
    ]);

    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('messages');
    const [commentText, setCommentText] = useState('');
    const [commentType, setCommentType] = useState('suggestion');

    const currentUser = {
        id: 'admin',
        name: 'Admin',
        role: 'admin',
        avatar: '/avatars/admin.jpg'
    };

    useEffect(() => {
        if (selectedFaculty) {
            setFaculties(faculties.map(faculty => {
                if (faculty.id === selectedFaculty.id) {
                    return {
                        ...faculty,
                        messages: faculty.messages.map(msg => ({ ...msg, read: true }))
                    };
                }
                return faculty;
            }));
        }
    }, [selectedFaculty]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            toast({
                title: 'Empty message',
                description: 'Please write something before sending',
                variant: 'destructive'
            });
            return;
        }

        const message = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'admin',
            createdAt: new Date().toISOString(),
            read: true
        };

        setFaculties(faculties.map(faculty =>
            faculty.id === selectedFaculty.id
                ? { ...faculty, messages: [...faculty.messages, message] }
                : faculty
        ));

        setNewMessage('');
        toast({
            title: 'Message sent successfully',
            description: 'Your message has been delivered'
        });
    };

    const handleAddComment = (questionId) => {
        if (!commentText.trim()) {
            toast({
                title: 'Empty comment',
                description: 'Please write something before posting',
                variant: 'destructive'
            });
            return;
        }

        const comment = {
            id: `comment-${Date.now()}`,
            text: commentText,
            user: currentUser.id,
            type: commentType,
            createdAt: new Date().toISOString()
        };

        setFaculties(faculties.map(faculty => {
            if (faculty.id === selectedFaculty.id) {
                return {
                    ...faculty,
                    questions: faculty.questions.map(q =>
                        q.id === questionId
                            ? { ...q, comments: [...q.comments, comment] }
                            : q
                    )
                };
            }
            return faculty;
        }));

        setCommentText('');
        toast({
            title: 'Feedback submitted',
            description: 'Your comment has been added successfully'
        });
    };

    const updateQuestionStatus = (questionId, status) => {
        setFaculties(faculties.map(faculty => {
            if (faculty.id === selectedFaculty.id) {
                return {
                    ...faculty,
                    questions: faculty.questions.map(q =>
                        q.id === questionId
                            ? { ...q, status }
                            : q
                    )
                };
            }
            return faculty;
        }));

        toast({
            title: 'Status updated',
            description: `Question ${status.replace('_', ' ')} successfully`
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending_review':
                return 'secondary';
            case 'needs_revision':
                return 'outline';
            case 'rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <Check className="h-3 w-3" />;
            case 'needs_revision':
                return <Edit className="h-3 w-3" />;
            case 'rejected':
                return <X className="h-3 w-3" />;
            default:
                return <Clock className="h-3 w-3" />;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-success';
            case 'Medium':
                return 'text-warning';
            case 'Hard':
                return 'text-destructive';
            default:
                return 'text-muted-foreground';
        }
    };

    const filteredFaculties = faculties.filter(faculty =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getUnreadCount = (faculty) => {
        return faculty.messages.filter(m => !m.read && m.sender === 'faculty').length;
    };

    return (
        <div className="flex h-[calc(100vh-7rem)] bg-background">
            {/* Faculty List Sidebar */}
            <div className={`${selectedFaculty ? 'hidden lg:block lg:w-70' : 'w-full'} border-r bg-card/50 backdrop-blur-sm`}>
                <div className="p-6 border-b bg-card/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">Faculty</h2>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {filteredFaculties.length} members
                        </Badge>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculty members..."
                            className="pl-10 bg-background/50 border-border/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-140px)]">
                    {filteredFaculties.length > 0 ? (
                        <div className="p-2">
                            {filteredFaculties.map((faculty) => {
                                const unreadCount = getUnreadCount(faculty);
                                return (
                                    <div
                                        key={faculty.id}
                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${selectedFaculty?.id === faculty.id
                                                ? 'bg-primary/10 border border-primary/20 shadow-soft'
                                                : 'hover:shadow-soft'
                                            }`}
                                        onClick={() => setSelectedFaculty(faculty)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 ring-2 ring-background shadow-soft">
                                                    <AvatarImage src={faculty.avatar} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {faculty.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {faculty.isOnline && (
                                                    <div className="absolute -bottom-0 bg-green-500 -right-[-3px] h-2.5 w-2.5 bg-status-online rounded-full border-2 border-background"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium truncate text-foreground">{faculty.name}</p>
                                                    {unreadCount > 0 && (
                                                        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                                            {unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">{faculty.department}</p>
                                               
                                            </div>
                                        </div>
                                       
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground font-medium">No faculty members found</p>
                            <p className="text-sm text-muted-foreground/70">Try adjusting your search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Communication Panel */}
            {selectedFaculty &&
                <div className="flex-1 flex flex-col bg-background">
                    {/* Header */}
                    <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSelectedFaculty(null)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="relative">
                                <Avatar className="h-12 w-12 ring-2 ring-background shadow-soft">
                                    <AvatarImage src={selectedFaculty.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {selectedFaculty.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {selectedFaculty.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-status-online rounded-full border-2 border-background"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">{selectedFaculty.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-muted-foreground">{selectedFaculty.department}</p>
                                    <Badge variant="outline" className="h-5 text-xs">
                                        {selectedFaculty.isOnline ? 'Online' : 'Offline'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={activeTab === 'messages' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveTab('messages')}
                                    className="transition-all duration-200"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Messages
                                    {getUnreadCount(selectedFaculty) > 0 && (
                                        <Badge variant="destructive" className="ml-2 h-4 w-4 rounded-full p-1 pl-[5px] text-xs">
                                            {getUnreadCount(selectedFaculty)}
                                        </Badge>
                                    )}
                                </Button>
                                <Button
                                    variant={activeTab === 'questions' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveTab('questions')}
                                    className="transition-all duration-200"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Questions
                                    <Badge variant="secondary" className="ml-2 h-4 w-4 rounded-full p-1 text-xs">
                                        {selectedFaculty.questions.length}
                                    </Badge>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'messages' ? (
                            <div className="p-6 space-y-4">
                                {selectedFaculty.messages.length > 0 ? (
                                    selectedFaculty.messages.map((message, index) => (
                                        <div
                                            key={message.id}
                                            className={`flex animate-fade-in ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl p-4 shadow-soft transition-all duration-200 hover:shadow-medium ${message.sender === 'admin'
                                                        ? 'bg-message-sent text-message-sent-foreground'
                                                        : 'bg-message-received text-message-received-foreground border border-border/50'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{message.text}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className={`text-xs ${message.sender === 'admin'
                                                            ? 'text-message-sent-foreground/70'
                                                            : 'text-muted-foreground'
                                                        }`}>
                                                        {formatTime(message.createdAt)}
                                                    </p>
                                                    {message.sender === 'admin' && (
                                                        <Check className={`h-3 w-3 ${message.read ? 'text-message-sent-foreground/70' : 'text-message-sent-foreground/50'
                                                            }`} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <div className="relative">
                                            <Mail className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                            <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary/20 rounded-full animate-pulse-soft"></div>
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Start a conversation with {selectedFaculty.name} to discuss questions, provide feedback, or share updates.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {selectedFaculty.questions.length > 0 ? (
                                    selectedFaculty.questions.map((question, index) => (
                                        <Card
                                            key={question.id}
                                            className="shadow-soft hover:shadow-medium transition-all duration-200 border-border/50 animate-fade-in"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    {/* Question Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <Badge
                                                                    variant={getStatusVariant(question.status)}
                                                                    className="gap-1"
                                                                >
                                                                    {getStatusIcon(question.status)}
                                                                    {question.status.replace('_', ' ')}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {question.type}
                                                                </Badge>
                                                                <span className={`text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                                    {question.difficulty}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="h-4 w-4" />
                                                                {formatDate(question.createdAt)}
                                                                <Separator orientation="vertical" className="h-4" />
                                                                <span className="bg-muted/50 px-2 py-1 rounded text-xs">
                                                                    {question.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant={question.status === 'approved' ? 'default' : 'ghost'}
                                                                size="sm"
                                                                onClick={() => updateQuestionStatus(question.id, 'approved')}
                                                                className="transition-all duration-200"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant={question.status === 'needs_revision' ? 'default' : 'ghost'}
                                                                size="sm"
                                                                onClick={() => updateQuestionStatus(question.id, 'needs_revision')}
                                                                className="transition-all duration-200"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant={question.status === 'rejected' ? 'destructive' : 'ghost'}
                                                                size="sm"
                                                                onClick={() => updateQuestionStatus(question.id, 'rejected')}
                                                                className="transition-all duration-200"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Question Content */}
                                                    <div className="bg-muted/20 rounded-lg p-4">
                                                        <h4 className="font-medium text-base leading-relaxed text-foreground">
                                                            {question.question}
                                                        </h4>
                                                    </div>

                                                    {/* Comments Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-medium text-sm flex items-center gap-2">
                                                                <MessageSquare className="h-4 w-4" />
                                                                Feedback ({question.comments?.length || 0})
                                                            </h5>
                                                        </div>

                                                        {question.comments?.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className={`rounded-xl p-4 text-sm border transition-all duration-200 hover:shadow-soft ${comment.type === 'approved'
                                                                        ? 'bg-success-light border-success/20'
                                                                        : comment.type === 'needs_edit'
                                                                            ? 'bg-warning-light border-warning/20'
                                                                            : comment.type === 'rejected'
                                                                                ? 'bg-destructive-light border-destructive/20'
                                                                                : 'bg-muted/30 border-border/50'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-foreground">
                                                                            {comment.user === 'admin' ? 'You' : selectedFaculty.name}
                                                                        </span>
                                                                        {comment.type === 'approved' && (
                                                                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                                                Approved
                                                                            </Badge>
                                                                        )}
                                                                        {comment.type === 'needs_edit' && (
                                                                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                                Needs Edit
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatTime(comment.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-foreground leading-relaxed">{comment.text}</p>
                                                            </div>
                                                        ))}


                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <div className="relative">
                                            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                            <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary/20 rounded-full animate-pulse-soft"></div>
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground mb-2">No questions submitted</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            {selectedFaculty.name} hasn't submitted any questions yet. They can submit new questions for review.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Message Input (only shown in messages tab) */}
                    {activeTab === 'messages' && (
                        <div className="p-6 border-t bg-card/30 backdrop-blur-sm">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedFaculty.name}...`}
                                        className="min-h-[80px] bg-background/50 border-border/50 resize-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="h-fit px-6 transition-all duration-200 hover:shadow-medium"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Press Enter to send, Shift + Enter for new line
                            </p>
                        </div>
                    )}
                </div>
            
            }
        </div>
    );
}