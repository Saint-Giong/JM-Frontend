'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from '@saint-giong/bamboo-ui';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useLogoUpload } from '@/hooks';

interface LogoUploadProps {
  /**
   * Current logo URL (if exists)
   */
  currentLogoUrl?: string;
  /**
   * Company ID for upload
   */
  companyId: string;
  /**
   * Callback when upload completes successfully
   */
  onUploadComplete: (url: string) => void;
  /**
   * Company initials for fallback display
   */
  initials?: string;
  /**
   * Whether the upload is disabled
   */
  disabled?: boolean;
}

/**
 * Logo upload component with drag-and-drop support and preview
 */
export function LogoUpload({
  currentLogoUrl,
  companyId,
  onUploadComplete,
  initials = 'CO',
  disabled = false,
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isUploading,
    uploadedUrl,
    error,
    previewUrl,
    selectedFile,
    selectFile,
    upload,
    reset,
  } = useLogoUpload(companyId);

  // Determine which image to display
  const displayUrl = uploadedUrl || previewUrl || currentLogoUrl;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        selectFile(file);
      }
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [selectFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        selectFile(file);
      }
    },
    [disabled, isUploading, selectFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleUpload = useCallback(async () => {
    const url = await upload();
    if (url) {
      onUploadComplete(url);
    }
  }, [upload, onUploadComplete]);

  const handleTriggerSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveSelection = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Avatar with preview */}
      <button
        type="button"
        className={`relative cursor-pointer transition-opacity ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'}`}
        onClick={!disabled && !isUploading ? handleTriggerSelect : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={disabled || isUploading}
      >
        <Avatar className="h-24 w-24 border-2 border-muted-foreground/30 border-dashed md:h-32 md:w-32">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt="Company logo" />
          ) : null}
          <AvatarFallback className="bg-muted text-2xl md:text-3xl">
            {displayUrl ? (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            ) : (
              initials
            )}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </button>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {selectedFile && !uploadedUrl ? (
          <>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleUpload}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-3 w-3" />
                  Upload
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveSelection}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTriggerSelect}
            disabled={disabled || isUploading}
          >
            {currentLogoUrl || uploadedUrl ? 'Change Logo' : 'Upload Logo'}
          </Button>
        )}
      </div>

      {/* Selected file info */}
      {selectedFile && !uploadedUrl && (
        <p className="text-muted-foreground text-xs">
          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="max-w-[200px] text-center text-destructive text-sm">
          {error}
        </p>
      )}

      {/* Helper text */}
      {!selectedFile && !error && (
        <p className="text-center text-muted-foreground text-xs">
          PNG, JPG, or WebP (max 2MB)
        </p>
      )}
    </div>
  );
}
