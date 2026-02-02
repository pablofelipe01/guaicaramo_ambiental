'use client';

import { useState, useRef } from 'react';

interface UploadFormProps {
  area: string;
  acceptedFiles: string;
  acceptedFilesLabel: string;
  multiple?: boolean;
  onSuccess?: () => void;
}

export default function UploadForm({
  area,
  acceptedFiles,
  acceptedFilesLabel,
  multiple = false,
  onSuccess,
}: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [comentarios, setComentarios] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (multiple) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    } else {
      setFiles(droppedFiles.slice(0, 1));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (multiple) {
        setFiles((prev) => [...prev, ...selectedFiles]);
      } else {
        setFiles(selectedFiles.slice(0, 1));
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setUploadStatus({ type: 'error', message: 'Por favor seleccione al menos un archivo' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('area', area);
      formData.append('comentarios', comentarios);
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivos');
      }

      setUploadStatus({ type: 'success', message: '¡Archivos subidos correctamente!' });
      setFiles([]);
      setComentarios('');
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading:', error);
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al subir archivos',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <label
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragging
            ? 'border-green-500 bg-green-500/10'
            : 'border-white/10 hover:border-green-500/50 hover:bg-green-500/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          className="w-12 h-12 text-gray-500 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="text-gray-400 mb-1">
          Arrastra tus archivos aquí o haz clic para seleccionar
        </span>
        <span className="text-sm text-gray-600">{acceptedFilesLabel}</span>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFiles}
          multiple={multiple}
          onChange={handleFileSelect}
        />
      </label>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-2">Archivos seleccionados:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="overflow-hidden">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Comentarios (opcional)
        </label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
          rows={3}
          placeholder="Agregue notas o comentarios sobre los archivos..."
        />
      </div>

      {/* Status Message */}
      {uploadStatus.type && (
        <div
          className={`p-4 rounded-xl ${
            uploadStatus.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {uploadStatus.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{uploadStatus.message}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isUploading || files.length === 0}
        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Subiendo...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Subir {files.length > 0 ? `(${files.length} archivo${files.length > 1 ? 's' : ''})` : 'archivos'}
          </>
        )}
      </button>
    </div>
  );
}
