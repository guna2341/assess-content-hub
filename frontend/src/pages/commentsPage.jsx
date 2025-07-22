import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Send,
    Edit,
    Trash2,
    User,
    Shield,
    MessageSquare,
    Plus,
    ChevronDown,
    ChevronRight,
    Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function CommentsPage() {
    const { toast } = useToast();
    const [posts, setPosts] = useState([
        {
            id: '1',
            title: 'What is the chemical formula for water?',
            content: 'I need help understanding basic chemistry concepts. Can someone explain the molecular structure of water and why it\'s essential for life?',
            author: {
                id: 'user1',
                name: 'Student123',
                role: 'user',
                avatar: '/avatars/user1.jpg'
            },
            createdAt: '2024-01-20T14:30:00Z',
            comments: [
                {
                    id: 'c1',
                    content: 'The formula is H₂O - two hydrogen atoms and one oxygen atom. This simple structure gives water its unique properties like high surface tension and ability to dissolve many substances.',
                    author: {
                        id: 'user2',
                        name: 'ChemistryTutor',
                        role: 'expert',
                        avatar: '/avatars/user2.jpg'
                    },
                    createdAt: '2024-01-20T15:15:00Z',
                    replies: [
                        {
                            id: 'r1',
                            content: 'Also worth mentioning about heavy water (D₂O) which is used in nuclear reactors. It has deuterium instead of regular hydrogen.',
                            author: {
                                id: 'user3',
                                name: 'ScienceProf',
                                role: 'admin',
                                avatar: '/avatars/user3.jpg'
                            },
                            createdAt: '2024-01-20T16:30:00Z'
                        }
                    ]
                }
            ]
        },
        {
            id: '2',
            title: 'Best resources for learning React?',
            content: 'Looking for recommendations for React tutorials and courses. I\'m particularly interested in hooks and context API.',
            author: {
                id: 'user4',
                name: 'CodeNewbie',
                role: 'user',
                avatar: '/avatars/user4.jpg'
            },
            createdAt: '2024-01-18T09:20:00Z',
            comments: []
        }
    ]);

    const [newPost, setNewPost] = useState({
        title: '',
        content: ''
    });

    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [showPostForm, setShowPostForm] = useState(false);

    const currentUser = {
        id: 'current-user',
        name: 'You',
        role: 'user',
        avatar: '/avatars/current-user.jpg'
    };

    const handleCreatePost = () => {
        if (!newPost.title.trim() || !newPost.content.trim()) {
            toast({
                title: 'Missing information',
                description: 'Please provide both a title and content for your post',
                variant: 'destructive'
            });
            return;
        }

        const post = {
            id: Date.now().toString(),
            title: newPost.title,
            content: newPost.content,
            author: currentUser,
            createdAt: new Date().toISOString(),
            comments: []
        };

        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '' });
        setShowPostForm(false);

        toast({
            title: 'Post created',
            description: 'Your discussion post has been published'
        });
    };

    const handleAddComment = (postId) => {
        if (!newComment.trim()) {
            toast({
                title: 'Empty comment',
                description: 'Please write something before posting',
                variant: 'destructive'
            });
            return;
        }

        const comment = {
            id: `comment-${Date.now()}`,
            content: newComment,
            author: currentUser,
            createdAt: new Date().toISOString(),
            replies: []
        };

        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, comments: [...post.comments, comment] }
                : post
        ));
        setNewComment('');
        setReplyingTo(null);

        toast({
            title: 'Comment added',
            description: 'Your response has been posted'
        });
    };

    const handleAddReply = (postId, commentId) => {
        if (!newComment.trim()) {
            toast({
                title: 'Empty reply',
                description: 'Please write something before posting',
                variant: 'destructive'
            });
            return;
        }

        const reply = {
            id: `reply-${Date.now()}`,
            content: newComment,
            author: currentUser,
            createdAt: new Date().toISOString()
        };

        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                replies: [...comment.replies, reply]
                            };
                        }
                        return comment;
                    })
                };
            }
            return post;
        }));

        setNewComment('');
        setReplyingTo(null);

        toast({
            title: 'Reply added',
            description: 'Your reply has been posted'
        });
    };

    const handleDeleteComment = (postId, commentId, isReply = false, parentCommentId = null) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                if (isReply) {
                    return {
                        ...post,
                        comments: post.comments.map(comment => {
                            if (comment.id === parentCommentId) {
                                return {
                                    ...comment,
                                    replies: comment.replies.filter(reply => reply.id !== commentId)
                                };
                            }
                            return comment;
                        })
                    };
                } else {
                    return {
                        ...post,
                        comments: post.comments.filter(comment => comment.id !== commentId)
                    };
                }
            }
            return post;
        }));

        toast({
            title: 'Comment deleted',
            description: 'The comment has been removed'
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

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Admin
                    </Badge>
                );
            case 'expert':
                return <Badge variant="secondary" className="text-xs">Expert</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto space-y-6 h-fit">
            <div className="flex items-center justify-between scrollbar-none">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Community Discussions</h1>
                    <p className="text-muted-foreground">Ask questions and share knowledge with the community</p>
                </div>
                <Button onClick={() => setShowPostForm(!showPostForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                </Button>
            </div>

            {/* New Post Form */}
            {showPostForm && (
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Create a New Post</h2>
                        <Input
                            placeholder="Post title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            className="text-base"
                        />
                        <RichTextEditor
                            content={newPost.content}
                            onChange={(content) => setNewPost({ ...newPost, content })}
                            placeholder="Write your post content here..."
                            className="min-h-[150px]"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setShowPostForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreatePost}>
                                Post Discussion
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Posts List */}
            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No discussions yet</h3>
                        <p className="text-muted-foreground">Be the first to start a discussion</p>
                        <Button onClick={() => setShowPostForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                        </Button>
                    </div>
                ) : (
                    posts.map(post => (
                        <Card key={post.id} className="overflow-hidden shadow-sm">
                            <CardHeader className="px-6 py-4 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={post.author.avatar} />
                                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-foreground">{post.author.name}</span>
                                            {getRoleBadge(post.author.role)}
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose prose-sm max-w-none mb-6">
                                    {post.content}
                                </div>

                                <Separator className="my-4" />

                                {/* Comments section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium flex items-center gap-2 text-sm">
                                            <MessageSquare className="h-4 w-4" />
                                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                            onClick={() => setReplyingTo(replyingTo === 'post-' + post.id ? null : 'post-' + post.id)}
                                        >
                                            {replyingTo === 'post-' + post.id ? 'Cancel' : 'Add Comment'}
                                        </Button>
                                    </div>

                                    {/* Comment form for the post */}
                                    {replyingTo === 'post-' + post.id && (
                                        <div className="flex gap-3">
                                            <Avatar className="h-9 w-9 mt-1">
                                                <AvatarImage src={currentUser.avatar} />
                                                <AvatarFallback>Y</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-3">
                                                <RichTextEditor
                                                    content={newComment}
                                                    onChange={setNewComment}
                                                    placeholder="Write your comment..."
                                                    className="min-h-[100px]"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setReplyingTo(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAddComment(post.id)}
                                                        disabled={!newComment.trim()}
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Post Comment
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comments list */}
                                    <div className="space-y-6">
                                        {post.comments.map(comment => (
                                            <div key={comment.id} className="space-y-4">
                                                {/* Main comment */}
                                                <div className="flex gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={comment.author.avatar} />
                                                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{comment.author.name}</span>
                                                                {getRoleBadge(comment.author.role)}
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(comment.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 px-2 text-muted-foreground hover:text-primary"
                                                                    onClick={() => {
                                                                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                                        setEditingComment(null);
                                                                    }}
                                                                >
                                                                    Reply
                                                                </Button>
                                                                {comment.author.id === currentUser.id && (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 px-2 text-muted-foreground hover:text-primary"
                                                                            onClick={() => {
                                                                                setEditingComment(comment.id);
                                                                                setNewComment(comment.content);
                                                                                setReplyingTo(null);
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 px-2 text-muted-foreground hover:text-destructive"
                                                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            {editingComment === comment.id ? (
                                                                <div className="space-y-3">
                                                                    <RichTextEditor
                                                                        content={newComment}
                                                                        onChange={setNewComment}
                                                                        className="min-h-[100px]"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                // Handle update logic
                                                                                setEditingComment(null);
                                                                                setNewComment('');
                                                                            }}
                                                                        >
                                                                            Save Changes
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setEditingComment(null)}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Replies */}
                                                {comment.replies.length > 0 && (
                                                    <div className="ml-12 pl-4 border-l-2 border-muted-foreground/20 space-y-4">
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} className="flex gap-3 pt-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={reply.author.avatar} />
                                                                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium text-sm">{reply.author.name}</span>
                                                                            {getRoleBadge(reply.author.role)}
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {formatDate(reply.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                        {reply.author.id === currentUser.id && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                                                                                onClick={() => handleDeleteComment(post.id, reply.id, true, comment.id)}
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-1 text-sm">
                                                                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Reply form */}
                                                {replyingTo === comment.id && (
                                                    <div className="ml-12 pl-4 space-y-3">
                                                        <RichTextEditor
                                                            content={newComment}
                                                            onChange={setNewComment}
                                                            placeholder={`Reply to ${comment.author.name}...`}
                                                            className="min-h-[80px]"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleAddReply(post.id, comment.id)}
                                                            >
                                                                <Send className="h-4 w-4 mr-2" />
                                                                Post Reply
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setReplyingTo(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}