import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Send,
    ArrowLeft,
    Mail,
    Users,
    Search,
    Loader2,
    MessageCircle,
    Clock,
    FileQuestion,
    CheckCircle,
    XCircle,
    AlertCircle,
    Upload,
    Filter
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CHAT_SERVICES from '../api/services/chat';
import USER_SERVICES from '../api/services/user';
import secureLocalStorage from 'react-secure-storage';
import { useAuthStore } from '@/stores/authStore';
import io from 'socket.io-client';

export const CommentsPage = () => {
    const { toast } = useToast();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [isNearBottom, setIsNearBottom] = useState(true);

    // Chat/Questions view toggle for selected faculty
    const [facultyViewMode, setFacultyViewMode] = useState('messages'); // 'messages' or 'questions'

    // Questions related states
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionFilter, setQuestionFilter] = useState('all'); // all, pending, approved, rejected

    const { user } = useAuthStore();

    // Socket.IO reference
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const currentUser = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role
    };

    // Check if user is near bottom of chat
    const checkIfNearBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const threshold = 100; // pixels from bottom
            const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;
            setIsNearBottom(nearBottom);
            return nearBottom;
        }
        return true;
    };

    // Scroll to bottom function
    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Handle scroll events
    const handleScroll = () => {
        checkIfNearBottom();
    };

    // Auto scroll logic - only scroll if user is near bottom or it's a new conversation
    useEffect(() => {
        if (shouldAutoScroll || isNearBottom) {
            scrollToBottom('smooth');
        }
        // Reset shouldAutoScroll after first scroll
        if (shouldAutoScroll) {
            setShouldAutoScroll(false);
        }
    }, [messages]);

    // Initialize Socket.IO connection
    useEffect(() => {
        // Connect to socket server
        socketRef.current = io('http://localhost:5000');

        // Register user with socket server
        socketRef.current.emit('registerUser', currentUser.id);

        // Listen for new messages
        socketRef.current.on('newMessage', (message) => {
            // Only update if the message is for current conversation
            if (selectedConversation &&
                (message.sender_id === selectedConversation.id ||
                    message.receiver_id === selectedConversation.id)) {

                // Check if message already exists to prevent duplicates
                setMessages(prev => {
                    const existingMessage = prev.find(m => m.id === message.id);
                    if (existingMessage) {
                        return prev; // Don't add if already exists
                    }
                    return [...prev, message];
                });

                // If the message is from the current user to the selected conversation,
                // mark it as read immediately
                if (message.sender_id === selectedConversation.id &&
                    message.receiver_id === currentUser.id) {
                    // Mark as read via socket
                    socketRef.current.emit('markMessagesAsRead', {
                        senderId: message.sender_id,
                        receiverId: currentUser.id
                    });
                }
            }

            // Update last message in conversations list
            setConversations(prev => prev.map(conv => {
                if (conv.id === message.sender_id || conv.id === message.receiver_id) {
                    const isCurrentConversation = selectedConversation &&
                        (conv.id === selectedConversation.id);

                    return {
                        ...conv,
                        lastMessage: message.message,
                        lastMessageTime: message.created_at,
                        // Don't increment unread count if this is the current conversation
                        // and the user is not the sender
                        unreadCount: isCurrentConversation && message.sender_id !== currentUser.id
                            ? conv.unreadCount || 0
                            : message.sender_id === currentUser.id
                                ? conv.unreadCount || 0
                                : (conv.unreadCount || 0) + 1
                    };
                }
                return conv;
            }));
        });

        // Listen for question status updates (these will come as special messages)
        socketRef.current.on('questionStatusUpdate', (data) => {
            // This will be handled when you implement the backend
            console.log('Question status update:', data);

            // Reload questions if we're viewing the questions for this faculty
            if (selectedConversation && selectedConversation.id === data.facultyId && facultyViewMode === 'questions') {
                loadFacultyQuestions(selectedConversation.id);
            }

            // You can add a toast notification here
            toast({
                title: `Question ${data.status}`,
                description: `Question "${data.questionTitle}" has been ${data.status.toLowerCase()}`,
                variant: data.status === 'approved' ? 'default' : data.status === 'rejected' ? 'destructive' : 'default'
            });
        });

        // Listen for unread count updates
        socketRef.current.on('unreadCountUpdate', ({ senderId, count }) => {
            setConversations(prev => prev.map(conv =>
                conv.id === senderId
                    ? { ...conv, unreadCount: count }
                    : conv
            ));
        });

        // Listen for messages marked as read
        socketRef.current.on('messagesMarkedAsRead', ({ receiverId }) => {
            // Update conversation to show messages as read
            setConversations(prev => prev.map(conv =>
                conv.id === receiverId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [currentUser.id, selectedConversation, facultyViewMode]);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                // Get appropriate chat partners based on role
                const response = await USER_SERVICES.getChatPartners(currentUser.role, currentUser.id);

                // Handle the response based on your original controller format
                if (response.data) {
                    // If your controller returns { data: [...] }
                    setConversations(Array.isArray(response.data) ? response.data : []);
                } else if (Array.isArray(response)) {
                    // If your controller returns the array directly
                    setConversations(response);
                } else {
                    console.error('Unexpected response format:', response);
                    setConversations([]);
                }

                // Load unread counts
                const unreadResponse = await CHAT_SERVICES.getUnreadCount(currentUser.id);

                // Handle unread response (your original controller returns array directly)
                if (unreadResponse.data && Array.isArray(unreadResponse.data)) {
                    updateUnreadCounts(unreadResponse.data);
                } else if (Array.isArray(unreadResponse)) {
                    updateUnreadCounts(unreadResponse);
                }

            } catch (error) {
                console.error('Error loading data:', error);
                toast({
                    title: 'Error loading conversations',
                    description: error.response?.data?.message || 'Could not fetch your chat list',
                    variant: 'destructive'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser.id) {
            loadData();
        }
    }, [currentUser.id]);

    // Load messages or questions when conversation is selected or view mode changes
    useEffect(() => {
        if (selectedConversation) {
            if (facultyViewMode === 'messages') {
                // Set auto-scroll to true for new conversation
                setShouldAutoScroll(true);
                setIsNearBottom(true);

                loadMessages(selectedConversation.id);
                markMessagesAsRead(selectedConversation.id);

                // Join the chat room for this conversation
                if (socketRef.current) {
                    socketRef.current.emit('joinChatRoom', {
                        userId1: currentUser.id,
                        userId2: selectedConversation.id
                    });
                }
            } else if (facultyViewMode === 'questions') {
                loadFacultyQuestions(selectedConversation.id);
            }
        }
    }, [selectedConversation, facultyViewMode]);

    const loadMessages = async (userId) => {
        try {
            const response = await CHAT_SERVICES.getChatHistory(
                currentUser.id,
                userId
            );

            // Your original controller returns messages directly, not wrapped in { success, data }
            if (response.data && Array.isArray(response.data)) {
                // Remove duplicates based on message id
                const uniqueMessages = response.data.filter((message, index, self) =>
                    index === self.findIndex(m => m.id === message.id)
                );

                setMessages(uniqueMessages);
            } else {
                console.error('Failed to load messages:', response);
                toast({
                    title: 'Error loading messages',
                    description: 'Could not fetch chat history',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            toast({
                title: 'Error loading messages',
                description: error.response?.data?.message || 'Could not fetch chat history',
                variant: 'destructive'
            });
        }
    };

    const loadFacultyQuestions = async (facultyId) => {
        try {
            setQuestionsLoading(true);
            // TODO: Implement API call to load questions for specific faculty
            // const response = await QUESTION_SERVICES.getFacultyQuestions(facultyId);
            // setQuestions(response.data || []);

            // For now, set empty array - you'll implement this later
            setQuestions([]);
        } catch (error) {
            console.error('Error loading faculty questions:', error);
            toast({
                title: 'Error loading questions',
                description: 'Could not fetch questions for this faculty',
                variant: 'destructive'
            });
        } finally {
            setQuestionsLoading(false);
        }
    };

    const markMessagesAsRead = async (userId) => {
        console.log("Marking messages as read from:", userId, "to:", currentUser.id);

        try {
            // Mark as read via API
            await CHAT_SERVICES.markMessagesAsRead(
                userId,
                currentUser.id
            );

            // Also mark as read via socket for real-time updates
            if (socketRef.current) {
                socketRef.current.emit('markMessagesAsRead', {
                    senderId: userId,
                    receiverId: currentUser.id
                });
            }

            // Update local state
            setConversations(prev => prev.map(conv =>
                conv.id === userId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            toast({
                title: 'Empty message',
                description: 'Please write something before sending',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsSending(true);

            // Force scroll to bottom when user sends a message
            setIsNearBottom(true);

            // ONLY send via Socket.IO - let the server handle database saving
            if (socketRef.current) {
                socketRef.current.emit('sendMessage', {
                    senderId: currentUser.id,
                    receiverId: selectedConversation.id,
                    message: newMessage
                });
            }

            // Clear the input immediately
            setNewMessage('');

        } catch (error) {
            toast({
                title: 'Error sending message',
                description: 'Could not send your message',
                variant: 'destructive'
            });
        } finally {
            setIsSending(false);
        }
    };

    const updateUnreadCounts = (unreadData) => {
        setConversations(prev => prev.map(conv => {
            const unread = unreadData.find(item => item.sender_id === conv.id);
            return {
                ...conv,
                unreadCount: unread ? unread.count : 0
            };
        }));
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredQuestions = questions.filter(question => {
        if (questionFilter === 'all') return true;
        return question.status === questionFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <AlertCircle className="h-3 w-3" />;
            case 'approved':
                return <CheckCircle className="h-3 w-3" />;
            case 'rejected':
                return <XCircle className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    const renderFacultyQuestions = () => (
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">

            {/* Questions Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {questionsLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm text-gray-500">Loading questions...</p>
                        </div>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredQuestions.map((question) => (
                            <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
                                                {question.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(question.created_at)}
                                                </span>
                                                <span>•</span>
                                                <span>{question.subject}</span>
                                            </div>
                                        </div>
                                        <Badge
                                            className={`${getStatusColor(question.status)} border font-medium`}
                                        >
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(question.status)}
                                                <span className="capitalize">{question.status}</span>
                                            </div>
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {question.description}
                                    </p>
                                    {question.feedback && (
                                        <div className="mt-4 p-3 bg-blue-50/80 rounded-lg border border-blue-200/50">
                                            <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                                            <p className="text-sm text-blue-800">{question.feedback}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                            <FileQuestion className="h-16 w-16 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-3">
                            {questionFilter === 'all'
                                ? `No questions from ${selectedConversation?.name}`
                                : `No ${questionFilter} questions from ${selectedConversation?.name}`}
                        </h3>
                        <p className="text-gray-500 max-w-md leading-relaxed">
                            {questionFilter === 'all'
                                ? `${selectedConversation?.name} hasn't uploaded any questions yet.`
                                : `${selectedConversation?.name} doesn't have any ${questionFilter} questions.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-7.5rem)] bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl overflow-hidden border border-slate-200/60">
            <div className="flex flex-1 overflow-hidden">
                {/* Conversations List - Always visible */}
                <div className={`${selectedConversation ? 'hidden lg:block lg:w-80' : 'w-full'} bg-white/80 backdrop-blur-sm border-r border-slate-200/60`}>
                    <div className="p-6 border-b border-slate-200/60 bg-white/90">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Faculties</h2>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search faculties..."
                                className="pl-10 bg-white/70 border-slate-200/80 focus:bg-white focus:border-blue-300 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto h-[calc(100%-140px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    <p className="text-sm text-gray-500">Loading faculties...</p>
                                </div>
                            </div>
                        ) : filteredConversations.length > 0 ? (
                            <div className="p-2">
                                {filteredConversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`p-4 mb-2 cursor-pointer rounded-xl transition-all duration-200 hover:bg-blue-50/80 hover:shadow-sm group ${selectedConversation?.id === conv.id
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm border border-blue-200/50'
                                                : 'hover:translate-x-1'
                                            }`}
                                        onClick={() => {
                                            setSelectedConversation(conv);
                                            setFacultyViewMode('messages'); // Default to messages when selecting a faculty
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                                                    <AvatarImage src={conv.avatar} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                                        {conv.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {conv.is_online && (
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                                                        {conv.name}
                                                    </p>
                                                    {conv.unreadCount > 0 && (
                                                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs font-bold shadow-sm">
                                                            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conv.department || 'Faculty'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                                        <Users className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-600 mb-1">
                                            {searchTerm ? 'No matching faculties' : 'No faculties available'}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {searchTerm ? 'Try a different search term' : 'Faculty list will appear here'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat/Questions Area */}
                {selectedConversation ? (
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Faculty Header with Message/Questions Toggle */}
                        <div className="p-4 pt-6 border-b border-slate-200/60 bg-gradient-to-r flex justify-between items-center from-white to-blue-50/30">
                            <div className="flex items-center gap-4 mb-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden hover:bg-blue-100 rounded-xl"
                                    onClick={() => setSelectedConversation(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-12 w-12 ring-2 ring-blue-200/50 shadow-sm">
                                    <AvatarImage src={selectedConversation.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                        {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{selectedConversation.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`h-2 w-2 rounded-full ${selectedConversation.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <p className="text-sm text-gray-500">
                                            {selectedConversation.is_online ? 'Active now' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center h-fit gap-1 bg-gray-100/80 rounded-lg p-1 w-fit">
                                <button
                                    onClick={() => setFacultyViewMode('messages')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${facultyViewMode === 'messages'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                                        }`}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Messages
                                </button>
                                <button
                                    onClick={() => setFacultyViewMode('questions')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${facultyViewMode === 'questions'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                                        }`}
                                >
                                    <FileQuestion className="h-4 w-4" />
                                    Questions
                                </button>
                            </div>
                        </div>

                        {/* Content Area - Messages or Questions */}
                        {facultyViewMode === 'messages' ? (
                            <>
                                {/* Messages */}
                                <div
                                    ref={messagesContainerRef}
                                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-100/30 to-blue-50/30 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                                    onScroll={handleScroll}
                                >
                                    {messages.length > 0 ? (
                                        <>
                                            {messages.map((msg, index) => {
                                                const isCurrentUser = msg.sender_id === currentUser.id;
                                                const showTime = index === 0 ||
                                                    (new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime()) > 300000; // 5 minutes

                                                return (
                                                    <div key={msg.id} className="space-y-2">
                                                        {showTime && (
                                                            <div className="flex justify-center">
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full shadow-sm border border-gray-200/50">
                                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-500 font-medium">
                                                                        {formatTime(msg.created_at)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-[75%] group ${isCurrentUser ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                                                                <div
                                                                    className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${isCurrentUser
                                                                            ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-br-md'
                                                                            : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-md'
                                                                        }`}
                                                                >
                                                                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                            <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                                                <Mail className="h-16 w-16 text-blue-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-700 mb-3">No messages yet</h3>
                                            <p className="text-gray-500 max-w-md leading-relaxed">
                                                Start a conversation with <span className="font-semibold text-blue-600">{selectedConversation.name}</span>.
                                                Say hello and break the ice!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-slate-200/60 bg-white">
                                    <div className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <Textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="min-h-[50px] max-h-32 resize-none bg-gray-50/80 border-gray-200/80 focus:bg-white focus:border-blue-300 transition-all duration-200 rounded-xl"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="pb-1.5">
                                            <Button
                                                onClick={handleSendMessage}
                                                disabled={!newMessage.trim() || isSending}
                                                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                            >
                                                {isSending ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Send className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            renderFacultyQuestions()
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
                        <div className="text-center p-12">
                            <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-8 inline-block">
                                <Users className="h-24 w-24 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Select a Faculty</h2>
                            <p className="text-gray-500 max-w-md leading-relaxed">
                                Choose a faculty from the sidebar to start chatting or view their questions.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};