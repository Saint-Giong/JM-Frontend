'use client';

import { formatTimeAgo, toLocalDateTime } from '@/lib/utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { Activity, ActivityFormData } from './stores';

export interface UseActivityPostOptions {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

export interface UseActivityPostReturn {
  activity: Activity;
  timeAgo: string;
  hasImage: boolean;
  cardProps: {
    'data-activity-id': string;
    role: 'article';
    'aria-label': string;
  };
  timestampProps: {
    dateTime: string;
    title: string;
  };
  handleEdit: () => void;
  handleDelete: () => void;
}

/**
 * Hook for managing individual activity post display and interactions
 */
export function useActivityPost({
  activity,
  onEdit,
  onDelete,
}: UseActivityPostOptions): UseActivityPostReturn {
  const createdAtDate = useMemo(
    () => new Date(activity.createdAt),
    [activity.createdAt]
  );

  const timeAgo = useMemo(() => formatTimeAgo(createdAtDate), [createdAtDate]);

  const hasImage = Boolean(activity.imageUrl);

  const cardProps = {
    'data-activity-id': activity.id,
    role: 'article' as const,
    'aria-label': `Activity posted ${timeAgo}`,
  };

  const timestampProps = {
    dateTime: activity.createdAt,
    title: createdAtDate.toLocaleString(),
  };

  const handleEdit = useCallback(() => {
    onEdit?.(activity);
  }, [activity, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(activity.id);
  }, [activity.id, onDelete]);

  return {
    activity,
    timeAgo,
    hasImage,
    cardProps,
    timestampProps,
    handleEdit,
    handleDelete,
  };
}

export interface UseActivityFormOptions {
  initialData?: Partial<ActivityFormData>;
  onSubmit?: (data: ActivityFormData) => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseActivityFormReturn {
  formData: ActivityFormData;
  isSubmitting: boolean;
  errors: Partial<Record<keyof ActivityFormData, string>>;
  isValid: boolean;
  isDirty: boolean;
  imagePreview: string | null;
  setContent: (content: string) => void;
  setImageUrl: (url: string) => void;
  handleImageFileChange: (file: File | null) => void;
  clearImagePreview: () => void;
  contentProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  };
  imageUrlProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type: 'url';
  };
  imageFileProps: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept: string;
    type: 'file';
  };
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  reset: () => void;
}

const defaultFormData: ActivityFormData = {
  content: '',
  imageUrl: '',
};

/**
 * Hook for managing activity post form state and validation
 */
export function useActivityForm({
  initialData,
  onSubmit,
  onCancel,
}: UseActivityFormOptions = {}): UseActivityFormReturn {
  const initialFormData = useMemo(
    () => ({ ...defaultFormData, ...initialData }),
    [initialData]
  );

  const [formData, setFormData] = useState<ActivityFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ActivityFormData, string>>
  >({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const initialDataRef = useRef(initialFormData);

  const isDirty = useMemo(() => {
    return (
      formData.content !== initialDataRef.current.content ||
      formData.imageUrl !== initialDataRef.current.imageUrl
    );
  }, [formData]);

  const isValid = useMemo(() => {
    return formData.content.trim().length > 0;
  }, [formData.content]);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ActivityFormData, string>> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.imageUrl && !formData.imageUrl.match(/^(https?:\/\/|\/)/i)) {
      newErrors.imageUrl = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const setContent = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    setErrors((prev) => ({ ...prev, content: undefined }));
  }, []);

  const setImageUrl = useCallback((imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    // Clear preview when URL is set manually
    if (imageUrl) {
      setImagePreview(null);
      imageFileRef.current = null;
    }
  }, []);

  const handleImageFileChange = useCallback((file: File | null) => {
    if (!file) {
      setImagePreview(null);
      imageFileRef.current = null;
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: 'Please select an image file',
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: 'Image size must be less than 5MB',
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      imageFileRef.current = file;
      // Set a temporary URL for preview (in real app, this would be uploaded first)
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        imageUrl: 'Failed to read image file',
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const clearImagePreview = useCallback(() => {
    setImagePreview(null);
    imageFileRef.current = null;
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  }, []);

  const contentProps = {
    value: formData.content,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setContent(e.target.value),
    placeholder: 'Write your activity post...',
    'aria-invalid': Boolean(errors.content),
    'aria-describedby': errors.content ? 'content-error' : undefined,
  };

  const imageUrlProps = {
    value: formData.imageUrl,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setImageUrl(e.target.value),
    placeholder: 'https://example.com/image.jpg',
    type: 'url' as const,
  };

  const imageFileProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleImageFileChange(file);
    },
    accept: 'image/*',
    type: 'file' as const,
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      try {
        await onSubmit?.(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, onSubmit]
  );

  const handleCancel = useCallback(() => {
    setFormData(initialDataRef.current);
    setErrors({});
    setImagePreview(null);
    imageFileRef.current = null;
    onCancel?.();
  }, [onCancel]);

  const reset = useCallback(() => {
    setFormData({ ...defaultFormData });
    setErrors({});
    setImagePreview(null);
    imageFileRef.current = null;
    initialDataRef.current = { ...defaultFormData };
  }, []);

  return {
    formData,
    isSubmitting,
    errors,
    isValid,
    isDirty,
    imagePreview,
    setContent,
    setImageUrl,
    handleImageFileChange,
    clearImagePreview,
    contentProps,
    imageUrlProps,
    imageFileProps,
    handleSubmit,
    handleCancel,
    reset,
  };
}

export interface UseActivityListOptions {
  activities: Activity[];
  onAdd?: (activity: Activity) => void;
  onUpdate?: (id: string, data: ActivityFormData) => void;
  onDelete?: (id: string) => void;
}

export interface UseActivityListReturn {
  activities: Activity[];
  isEmpty: boolean;
  count: number;
  listProps: {
    role: 'feed';
    'aria-label': string;
  };
  /** Create a new activity from form data */
  createActivity: (data: ActivityFormData) => Activity;
}

/**
 * Hook for managing a list of activity posts
 */
export function useActivityList({
  activities,
}: UseActivityListOptions): UseActivityListReturn {
  const isEmpty = activities.length === 0;
  const count = activities.length;

  const listProps = {
    role: 'feed' as const,
    'aria-label': `Activity feed with ${count} ${count === 1 ? 'post' : 'posts'}`,
  };

  const createActivity = useCallback((data: ActivityFormData): Activity => {
    return {
      id: crypto.randomUUID(),
      content: data.content,
      imageUrl: data.imageUrl || undefined,
      createdAt: toLocalDateTime(new Date()),
    };
  }, []);

  return {
    activities,
    isEmpty,
    count,
    listProps,
    createActivity,
  };
}
