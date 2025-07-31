import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Pencil,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminContentStore } from '../../zustand/admin/contentUnits';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export function ContentListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const contentUnits = useAdminContentStore(state => state.content);
  const deleteContent = useAdminContentStore(state => state.deleteContent);
  const { user } = useAuthStore();
  const { getContent } = useAdminContentStore();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);
        const response = await getContent();

        if (!response.state) {
          setError(response.message || 'Failed to load content units');
          toast({
            title: 'Error!',
            description: response.message,
            variant: "destructive"
          });
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        toast({
          title: 'Error!',
          description: 'Failed to load content units',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleDeleteUnit = async (action, id) => {
    if (action === "delete") {
      try {
        setLoading(true);
        await deleteContent(id);
        toast({
          title: 'Success',
          description: 'Content unit deleted successfully',
          variant: "default"
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete content unit',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case 'hi': return 'हिंदी';
      case 'ta': return 'தமிழ்';
      default: return 'English';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>;
      case 'needs edit':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">
          <Pencil className="h-3 w-3 mr-1" />
          Needs Edit
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">
          <Pencil className="h-3 w-3 mr-1" />
          Draft
        </Badge>;
    }
  };

  // Filter content units based on search, language and status filters
  const filteredUnits = contentUnits.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || unit.language === languageFilter;
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesLanguage && matchesStatus;
  });

  // Calculate stats
  const totalUnits = contentUnits.length;
  const publishedUnits = contentUnits.filter(u => u.status === 'published').length;
  const pendingUnits = contentUnits.filter(u => u.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading content units...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load content</h3>
        <p className="text-muted-foreground max-w-md text-center">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Units</h1>
          <p className="text-muted-foreground">
            Manage educational content and associated questions
          </p>
        </div>
        <Button onClick={() => navigate('/content/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Unit
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search units by title or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="needs edit">Needs Edit</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card border shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Units</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Published</span>
            </div>
            <p className="text-2xl font-bold mt-1">{publishedUnits}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingUnits}</p>
          </CardContent>
        </Card>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className="bg-gradient-card border shadow-soft hover:shadow-medium transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-muted/20">
                      {unit.code}
                    </Badge>
                    <Badge variant="outline">
                      {getLanguageLabel(unit.language)}
                    </Badge>
                    {unit.status && getStatusBadge(unit.status)}
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{unit.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{unit.description}</p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span>By {unit.createdBy}</span>
                    </div>
                    <div>
                      <span>Updated {unit.updatedAt}</span>
                    </div>
                    <div>
                      <span>{unit.questions?.length || 0} questions</span>
                    </div>
                  </div>
                </div>

                {user.role === "admin" ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/content/${unit.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/content/${unit.id}/edit`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this content unit?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUnit('delete', unit.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/reviews`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUnits.length === 0 && !loading && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No learning units found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || languageFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Create your first learning unit to get started'
              }
            </p>
            {!searchQuery && languageFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => navigate('/content/create')} variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Create First Unit
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}