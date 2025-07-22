import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  Video, 
  Image as ImageIcon,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pencil
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminContentStore } from '../../zustand/admin/contentUnits';

export function ContentListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const contentUnits = useAdminContentStore(state => state.content);
  const deleteContent = useAdminContentStore(state => state.deleteContent);

  function handleDeleteUnit(action,id) { 
    if (action === "delete") {
      deleteContent(id);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-secondary/10 text-secondary';
      case 'image': return 'bg-accent/10 text-accent';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'published':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      case 'needs edit':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'published':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      case 'needs edit':
        return Pencil;
      default:
        return AlertCircle;
    }
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case 'hi': return 'हिंदी';
      case 'ta': return 'தமிழ்';
      default: return 'English';
    }
  };

  const filteredUnits = contentUnits.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         unit.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || unit.language === languageFilter;
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    
    return matchesSearch && matchesLanguage && matchesStatus;
  });

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
      <Card className="bg-gradient-card border-0 shadow-soft">
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
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">In Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>  
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Units</span>
            </div>
            <p className="text-2xl font-bold mt-1">{contentUnits.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Published</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {contentUnits.filter(u => u.status === 'published').length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">In Review</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {contentUnits.filter(u => u.reviewStatus != "completed").length}
            </p>
          </CardContent>
        </Card>
        
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {filteredUnits.map((unit) => {
          const ContentIcon = getContentTypeIcon(unit.contentType);
          const StatusIcon = getStatusIcon(unit.status);
          
          return (
            <Card key={unit.id} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="bg-muted/20">
                        {unit.code}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(unit.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {unit.status}
                      </Badge>
                      <Badge variant="outline">
                        {getLanguageLabel(unit.language)}
                      </Badge>
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
                    </div>
                  </div>
                  
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
                            onClick={() => handleDeleteUnit('delete',unit.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUnits.length === 0 && (
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