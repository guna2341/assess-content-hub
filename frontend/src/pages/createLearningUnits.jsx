import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronDown,
    Search,
    FileText,
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Upload,
    Save,
    X,
    Link as LinkIcon
} from "lucide-react";

export default function CreateLearningUnitsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("All Courses");
    const [selectedType, setSelectedType] = useState("All Types");
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploadOption, setUploadOption] = useState("file");
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        type: "lecture",
        course: "",
        file: null,
        videoLink: ""
    });

    // Sample data - in real app, this would come from an API
    const [studyMaterials, setStudyMaterials] = useState([
        {
            id: "1",
            title: "Introduction to React",
            type: "lecture",
            course: "Web Development",
            uploadDate: "2023-10-15",
            downloadUrl: "#",
            fileSize: "2.5 MB",
            status: "published",
            contentType: "file" // 'file' or 'link'
        },
        {
            id: "2",
            title: "React Hooks Tutorial",
            type: "video",
            course: "Web Development",
            uploadDate: "2023-10-18",
            videoLink: "https://youtube.com/watch?v=example",
            status: "published",
            contentType: "link"
        },
        {
            id: "3",
            title: "Advanced State Management",
            type: "lecture",
            course: "Advanced React",
            uploadDate: "2023-10-20",
            downloadUrl: "#",
            fileSize: "3.8 MB",
            status: "draft",
            contentType: "file"
        },
    ]);

    // Filter materials
    const filteredMaterials = studyMaterials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse === "All Courses" || material.course === selectedCourse;
        const matchesType = selectedType === "All Types" ||
            material.type.toLowerCase() === selectedType.toLowerCase();

        return matchesSearch && matchesCourse && matchesType;
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            file: file
        }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.title || !formData.course) {
            alert("Please fill in all required fields");
            return;
        }

        if (uploadOption === "file" && !formData.file && !editingId) {
            alert("Please select a file to upload");
            return;
        }

        if (uploadOption === "link" && !formData.videoLink) {
            alert("Please provide a video link");
            return;
        }

        const newMaterial = {
            id: editingId || Date.now().toString(),
            title: formData.title,
            type: formData.type,
            course: formData.course,
            uploadDate: new Date().toISOString().split('T')[0],
            status: "published",
            contentType: uploadOption
        };

        if (uploadOption === "file") {
            newMaterial.downloadUrl = "#";
            newMaterial.fileSize = formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB";
        } else {
            newMaterial.videoLink = formData.videoLink;
        }

        if (editingId) {
            setStudyMaterials(prev =>
                prev.map(material =>
                    material.id === editingId ? newMaterial : material
                )
            );
            setEditingId(null);
        } else {
            setStudyMaterials(prev => [...prev, newMaterial]);
        }

        // Reset form
        setFormData({
            title: "",
            type: "lecture",
            course: "",
            file: null,
            videoLink: ""
        });
        setUploadOption("file");
        setIsCreating(false);
    };

    const handleEdit = (material) => {
        setFormData({
            title: material.title,
            type: material.type,
            course: material.course,
            file: null,
            videoLink: material.videoLink || ""
        });
        setUploadOption(material.contentType || "file");
        setEditingId(material.id);
        setIsCreating(true);
    };

    const handleDelete = (materialId) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            setStudyMaterials(prev => prev.filter(material => material.id !== materialId));
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({
            title: "",
            type: "lecture",
            course: "",
            file: null,
            videoLink: ""
        });
        setUploadOption("file");
    };
    
    return (
        <div className="container mx-auto px-4 py-8"
        >
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Manage Learning Materials</h1>

                    {!isCreating &&
                        <div className="flex items-center space-x-4">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search materials..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center"
                            
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Material
                            </Button>
                        </div>
                    }
                </div>

                {isCreating && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingId ? "Edit Learning Material" : "Create New Learning Material"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title *</label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            placeholder="Enter material title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Course *</label>
                                        <Input
                                            value={formData.course}
                                            onChange={(e) => handleInputChange("course", e.target.value)}
                                            placeholder="Enter course name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Type *</label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between bg-white">
                                                    {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                {["lecture", "assignment", "quiz", "video", "reading"].map(type => (
                                                    <DropdownMenuItem
                                                        key={type}
                                                        onClick={() => handleInputChange("type", type)}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Content Type *</label>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant={uploadOption === "file" ? "default" : "outline"}
                                                onClick={() => setUploadOption("file")}
                                                className="flex-1"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload File
                                            </Button>
                                            <Button
                                                variant={uploadOption === "link" ? "default" : "outline"}
                                                onClick={() => setUploadOption("link")}
                                                className="flex-1"
                                            >
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                Video Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {uploadOption === "file" ? (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">File <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.mp4,.mov,.avi"
                                                className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Video Link <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Input
                                                value={formData.videoLink}
                                                onChange={(e) => handleInputChange("videoLink", e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="pl-10"
                                            />
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-2">
                                    <Button onClick={handleSubmit} className="flex items-center">
                                        <Save className="mr-2 h-4 w-4" />
                                        {editingId ? "Update" : "Create"} Material
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel}>
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                {selectedCourse} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {["All Courses", ...new Set(studyMaterials.map(m => m.course))].map(course => (
                                <DropdownMenuItem
                                    key={course}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    {course}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                {selectedType} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {["All Types", "Lecture", "Assignment", "Quiz", "Video", "Reading"].map(type => (
                                <DropdownMenuItem
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMaterials.map((material) => (
                                    <tr key={material.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {material.type === "lecture" && <FileText className="mr-2 h-4 w-4" />}
                                                {material.type === "assignment" && <BookOpen className="mr-2 h-4 w-4" />}
                                                {material.type === "quiz" && <FileText className="mr-2 h-4 w-4" />}
                                                {material.type === "video" && <FileText className="mr-2 h-4 w-4" />}
                                                {material.type === "reading" && <BookOpen className="mr-2 h-4 w-4" />}
                                                <span className="font-medium">{material.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{material.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {material.contentType === "file" ? (
                                                <span>{material.fileSize}</span>
                                            ) : (
                                                <a
                                                    href={material.videoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center"
                                                >
                                                    <LinkIcon className="mr-1 h-4 w-4" />
                                                    Video Link
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={material.status === "published" ? "text-green-600" : "text-orange-600"}
                                            >
                                                {material.status === "published" ? "Published" : "Draft"}
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.uploadDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(material)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(material.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}