import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'video/*': ['.mp4', '.webm', '.ogg'],
    'text/*': ['.txt'],
  },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Simulate upload progress
      acceptedFiles.forEach((file) => {
        const fileId = `${file.name}-${file.size}`;
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
        
        // Simulate upload
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = (prev[fileId] || 0) + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              setUploadedFiles((files) => [...files, file]);
              return { ...prev, [fileId]: 100 };
            }
            return { ...prev, [fileId]: newProgress };
          });
        }, 100);
      });

      onFileSelect(acceptedFiles);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((files) => files.filter((file) => file !== fileToRemove));
    const fileId = `${fileToRemove.name}-${fileToRemove.size}`;
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return File;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to select files
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      </div>

      {/* Upload Progress and Files */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => {
            const fileName = fileId.split('-')[0];
            return (
              <div key={fileId} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate">{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30"
              >
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="h-auto p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}