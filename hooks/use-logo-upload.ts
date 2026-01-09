'use client';

import { mediaApi, validateLogoFile } from '@/lib/api/media';
import { useCallback, useState } from 'react';

interface UseLogoUploadState {
  isUploading: boolean;
  uploadedUrl: string | null;
  error: string | null;
  previewUrl: string | null;
}

interface UseLogoUploadReturn extends UseLogoUploadState {
  /**
   * Select a file for upload (validates and creates preview)
   */
  selectFile: (file: File) => boolean;
  /**
   * Upload the selected file
   */
  upload: () => Promise<string | null>;
  /**
   * Reset all state
   */
  reset: () => void;
  /**
   * Currently selected file
   */
  selectedFile: File | null;
}

/**
 * Hook for managing company logo upload
 *
 * Provides file selection, validation, preview, and upload functionality
 *
 * @param companyId - The company ID to upload the logo for
 */
export function useLogoUpload(companyId: string): UseLogoUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState<UseLogoUploadState>({
    isUploading: false,
    uploadedUrl: null,
    error: null,
    previewUrl: null,
  });

  const selectFile = useCallback(
    (file: File): boolean => {
      // Validate file
      const validation = validateLogoFile(file);
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, error: validation.error ?? null }));
        return false;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Clean up old preview URL if exists
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }

      setSelectedFile(file);
      setState({
        isUploading: false,
        uploadedUrl: null,
        error: null,
        previewUrl,
      });

      return true;
    },
    [state.previewUrl]
  );

  const upload = useCallback(async (): Promise<string | null> => {
    if (!selectedFile) {
      setState((prev) => ({ ...prev, error: 'No file selected' }));
      return null;
    }

    if (!companyId) {
      setState((prev) => ({ ...prev, error: 'Company ID is required' }));
      return null;
    }

    setState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      const response = await mediaApi.uploadLogo({
        companyId,
        file: selectedFile,
      });

      if (response.success && response.url) {
        setState((prev) => ({
          ...prev,
          isUploading: false,
          uploadedUrl: response.url,
          error: null,
        }));
        return response.url;
      }
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: 'Upload failed. Please try again.',
      }));
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [companyId, selectedFile]);

  const reset = useCallback(() => {
    // Clean up preview URL
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    setSelectedFile(null);
    setState({
      isUploading: false,
      uploadedUrl: null,
      error: null,
      previewUrl: null,
    });
  }, [state.previewUrl]);

  return {
    ...state,
    selectedFile,
    selectFile,
    upload,
    reset,
  };
}
