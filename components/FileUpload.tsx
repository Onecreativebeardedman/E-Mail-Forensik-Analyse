import React, { useState, useCallback, DragEvent } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analyze a suspicious E-Mail</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Upload an `.eml` file to begin the forensic analysis. Your file is processed securely and is not stored after analysis.</p>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 transition-colors duration-200 ${
          isDragging ? 'border-brand-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".eml"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <UploadIcon className={`h-12 w-12 transition-colors duration-200 ${isDragging ? 'text-brand-primary' : 'text-slate-400'}`} />
          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">.EML files only (Max 10MB)</p>
        </label>
      </div>
    </div>
  );
};