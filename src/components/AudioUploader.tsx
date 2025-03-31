import { useState, useRef } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const AudioUploader = ({ onFileSelect, isLoading }: AudioUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please upload an audio file');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please upload an audio file');
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
          transition-all duration-300 ease-in-out`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-700">
            {selectedFile ? 'Selected File:' : 'Upload Audio Call Recording'}
          </h3>

          {selectedFile ? (
            <p className="text-sm text-gray-600">{selectedFile.name}</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag and drop your audio file here, or click to select
            </p>
          )}

          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm 
              ${
                isLoading
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              } 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Select Audio File'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioUploader;
