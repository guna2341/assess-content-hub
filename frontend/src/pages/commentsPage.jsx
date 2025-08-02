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
    Loader2
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
    }, [currentUser.id, selectedConversation]);

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

    // Load messages when conversation is selected
    useEffect(() => {
        if (selectedConversation) {
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
        }
    }, [selectedConversation]);

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

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-7rem)] bg-background">
            {/* Conversations List */}
            <div className={`${selectedConversation ? 'hidden lg:block lg:w-80' : 'w-full'} border-r bg-card/50`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Messages</h2>     
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-120px)]">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        <div className="divide-y">
                            {filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-muted/30' : ''
                                        }`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={conv.avatar} />
                                                <AvatarFallback>
                                                    {conv.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            {conv.is_online && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium truncate">{conv.name}</p>
                                                {conv.unreadCount > 0 && (
                                                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">
                                                        {conv.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conv.department || 'Faculty'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                {searchTerm ? 'No matching contacts found' : 'No conversations yet'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedConversation && (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSelectedConversation(null)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedConversation.avatar} />
                            <AvatarFallback>
                                {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{selectedConversation.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedConversation.is_online ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        onScroll={handleScroll}
                    >
                        {messages.length > 0 ? (
                            <>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-lg p-3 ${msg.sender_id === currentUser.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                                <p className="text-muted-foreground max-w-md">
                                    Start a conversation with {selectedConversation.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="min-h-[60px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || isSending}
                                size="sm"
                                className="h-auto"
                            >
                                {isSending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};