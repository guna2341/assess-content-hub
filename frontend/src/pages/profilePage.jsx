import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Lock,
    BookOpen,
    BookMarked,
    ClipboardList,
    Shield,
    GraduationCap,
    Eye,
    FileEdit,
    LogOut,
    Calendar,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textArea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

export function ProfilePage() {
    const { user, logout } = useAuthStore();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Mock data - replace with actual API calls
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'student',
        bio: user?.bio || '',
        institution: user?.institution || '',
        department: user?.department || '',
        joinDate: user?.joinDate || new Date().toISOString(),
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        toast({
            title: 'Profile Updated',
            description: 'Your profile information has been updated successfully.',
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'New passwords do not match.',
                variant: 'destructive',
            });
            return;
        }
        toast({
            title: 'Password Changed',
            description: 'Your password has been updated successfully.',
        });
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
    };

    const renderRoleBadge = () => {
        switch (user?.role) {
            case 'admin':
                return <Badge variant="admin"><Shield className="h-3 w-3 mr-1" /> Admin</Badge>;
            case 'reviewer':
                return <Badge variant="reviewer"><Eye className="h-3 w-3 mr-1" /> Reviewer</Badge>;
            default:
                return <Badge variant="student"><GraduationCap className="h-3 w-3 mr-1" /> Student</Badge>;
        }
    };

    const renderRoleSpecificContent = () => {
        switch (user?.role) {
            case 'admin':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Admin Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" onClick={() => navigate('/content')}>
                                Manage Content
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/question-bank')}>
                                Manage QuestionBank
                            </Button>
                        </CardContent>
                    </Card>
                );
            case 'reviewer':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Reviewer Dashboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Pending Reviews
                                    </h3>
                                    <p className="text-2xl font-bold mt-2">12</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <BookMarked className="h-4 w-4" />
                                        Reviewed This Month
                                    </h3>
                                    <p className="text-2xl font-bold mt-2">24</p>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => navigate('/review')}>
                                Go to Review Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                );
            default: // student
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Learning Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Units Completed
                                    </h3>
                                    <p className="text-2xl font-bold mt-2">15</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <BookMarked className="h-4 w-4" />
                                        Current Courses
                                    </h3>
                                    <p className="text-2xl font-bold mt-2">3</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4" />
                                        Average Score
                                    </h3>
                                    <p className="text-2xl font-bold mt-2">87%</p>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => navigate('/learn')}>
                                Continue Learning
                            </Button>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <div className="flex items-center gap-2">
                    {renderRoleBadge()}
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">{profileData.name}</h2>
                                    <p className="text-muted-foreground">{profileData.email}</p>
                                </div>
                                {user?.role === 'student' && (
                                    <div className="text-center space-y-1">
                                        <p className="font-medium">{profileData.institution}</p>
                                        <p className="text-sm text-muted-foreground">{profileData.department}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {renderRoleSpecificContent()}
                </div>

                <div className="lg:col-span-2">
                    <Tabs defaultValue="profile">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {user?.role === 'student' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="institution">Institution</Label>
                                                    <Input
                                                        id="institution"
                                                        value={profileData.institution}
                                                        onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Department</Label>
                                                    <Input
                                                        id="department"
                                                        value={profileData.department}
                                                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                placeholder="Tell us a little about yourself"
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit">
                                                <FileEdit className="h-4 w-4 mr-2" />
                                                Update Profile
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Change Password
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit">
                                                <Lock className="h-4 w-4 mr-2" />
                                                Change Password
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}