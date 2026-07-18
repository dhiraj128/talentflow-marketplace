"use client";

import * as React from "react";
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Eye, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onFileSelect: (file: File | null) => void;
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  accept?: string;
  maxSizeMB?: number;
  maxSize?: number;
}

export function FileUpload({ 
  onFileSelect, 
  accept, 
  maxSizeMB = 10,
  maxSize,
  className,
  ...props 
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const limit = maxSize ?? maxSizeMB;
    if (file.size > limit * 1024 * 1024) {
      toast.error(`File is too large. Max size is ${limit}MB`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
    
    if (!extension || !allowed.includes(extension)) {
      toast.error("Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    executeUpload(file);
  };

  const executeUpload = async (file: File) => {
    if (!props.onUpload) {
      // If no upload handler provided, just select the file
      onFileSelect(file);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    
    try {
      await props.onUpload(file, (p) => setProgress(p));
      setProgress(100);
      toast.success("File uploaded successfully");
      onFileSelect(file);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload file");
      clearFile();
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setIsUploading(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReplace = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handlePreview = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      window.open(url, "_blank");
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        {...props}
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept || ".pdf,.doc,.docx,.png,.jpg,.jpeg"}
        onChange={handleChange}
      />
      
      {!selectedFile ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-secondary/20",
            dragActive ? "border-primary bg-secondary/40" : "border-border hover:bg-secondary/40"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1 text-center">Click or drag file to this area to upload</p>
          <p className="text-xs text-muted-foreground text-center">
            Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG (Max {maxSize ?? maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4 border rounded-lg bg-secondary/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon fileType={selectedFile.type} fileName={selectedFile.name} />
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate" title={selectedFile.name}>{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            
            {!isUploading && (
              <div className="flex items-center shrink-0">
                <Button variant="ghost" size="icon" onClick={handlePreview} title="Preview" type="button" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDownload} title="Download" type="button" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReplace} title="Replace" type="button" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={clearFile} className="h-8 w-8 text-destructive hover:text-destructive" title="Delete" type="button">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {!isUploading && progress === 100 && (
             <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload complete</span>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileIcon({ fileType, fileName }: { fileType: string; fileName: string }) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  if (fileType.includes("image") || ['png', 'jpg', 'jpeg'].includes(ext || '')) {
    return <div className="h-10 w-10 bg-blue-100/50 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><ImageIcon className="h-5 w-5" /></div>;
  }
  if (fileType.includes("pdf") || ext === 'pdf') {
    return <div className="h-10 w-10 bg-red-100/50 text-red-600 rounded-lg flex items-center justify-center shrink-0"><FileText className="h-5 w-5" /></div>;
  }
  if (['doc', 'docx'].includes(ext || '')) {
    return <div className="h-10 w-10 bg-blue-100/50 text-blue-800 rounded-lg flex items-center justify-center shrink-0"><FileText className="h-5 w-5" /></div>;
  }
  return <div className="h-10 w-10 bg-gray-100/50 text-gray-600 rounded-lg flex items-center justify-center shrink-0"><File className="h-5 w-5" /></div>;
}
