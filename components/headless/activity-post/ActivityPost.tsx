/* eslint-disable @next/next/no-img-element */
'use client';

import {
  createContext,
  type ElementType,
  type ReactNode,
  useContext,
} from 'react';
import { useActivityForm, useActivityList, useActivityPost } from './hooks';
import type { Activity, ActivityFormData } from './stores';

interface ActivityPostContextValue {
  activity: Activity;
  timeAgo: string;
  hasImage: boolean;
  cardProps: Record<string, unknown>;
  timestampProps: { dateTime: string; title: string };
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActivityPostContext = createContext<ActivityPostContextValue | null>(
  null
);

function useActivityPostContext() {
  const context = useContext(ActivityPostContext);
  if (!context) {
    throw new Error(
      'ActivityPost.* components must be used within ActivityPost.Root'
    );
  }
  return context;
}

interface RootProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

function Root({
  activity,
  onEdit,
  onDelete,
  children,
  as: Component = 'article',
  className,
}: RootProps) {
  const postData = useActivityPost({ activity, onEdit, onDelete });

  return (
    <ActivityPostContext.Provider
      value={{
        ...postData,
        onEdit: postData.handleEdit,
        onDelete: postData.handleDelete,
      }}
    >
      <Component className={className} {...postData.cardProps}>
        {children}
      </Component>
    </ActivityPostContext.Provider>
  );
}

interface TimestampProps {
  children?: (timeAgo: string) => ReactNode;
  as?: ElementType;
  className?: string;
}

function Timestamp({
  children,
  as: Component = 'time',
  className,
}: TimestampProps) {
  const { timeAgo, timestampProps } = useActivityPostContext();

  return (
    <Component className={className} {...timestampProps}>
      {children ? children(timeAgo) : timeAgo}
    </Component>
  );
}

interface ContentProps {
  children?: (content: string) => ReactNode;
  as?: ElementType;
  className?: string;
}

function Content({ children, as: Component = 'p', className }: ContentProps) {
  const { activity } = useActivityPostContext();

  return (
    <Component className={className}>
      {children ? children(activity.content) : activity.content}
    </Component>
  );
}

interface ImageProps {
  children?: (imageUrl: string) => ReactNode;
  fallback?: ReactNode;
  className?: string;
}

function Image({ children, fallback, className }: ImageProps) {
  const { activity, hasImage } = useActivityPostContext();

  if (!hasImage) {
    return fallback ?? null;
  }

  if (children) {
    return children(activity.imageUrl!);
  }

  // Note: Using img for flexibility with external URLs
  return (
    // biome-ignore lint/performance/noImgElement: Preview images from blob URLs
    <img src={activity.imageUrl} alt="Activity media" className={className} />
  );
}

interface EditButtonProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

function EditButton({
  children,
  as: Component = 'button',
  className,
}: EditButtonProps) {
  const { onEdit } = useActivityPostContext();

  return (
    <Component className={className} onClick={onEdit}>
      {children ?? 'Edit'}
    </Component>
  );
}

interface DeleteButtonProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

function DeleteButton({
  children,
  as: Component = 'button',
  className,
}: DeleteButtonProps) {
  const { onDelete } = useActivityPostContext();

  return (
    <Component className={className} onClick={onDelete}>
      {children ?? 'Delete'}
    </Component>
  );
}

interface ActivityListContextValue {
  activities: Activity[];
  isEmpty: boolean;
  count: number;
  listProps: Record<string, unknown>;
  createActivity: (data: ActivityFormData) => Activity;
}

const ActivityListContext = createContext<ActivityListContextValue | null>(
  null
);

function useActivityListContext() {
  const context = useContext(ActivityListContext);
  if (!context) {
    throw new Error(
      'ActivityList.* components must be used within ActivityList.Root'
    );
  }
  return context;
}

interface ListRootProps {
  activities: Activity[];
  onAdd?: (activity: Activity) => void;
  onUpdate?: (id: string, data: ActivityFormData) => void;
  onDelete?: (id: string) => void;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

function ListRoot({
  activities,
  onAdd,
  onUpdate,
  onDelete,
  children,
  as: Component = 'div',
  className,
}: ListRootProps) {
  const listData = useActivityList({ activities, onAdd, onUpdate, onDelete });

  return (
    <ActivityListContext.Provider value={listData}>
      <Component className={className} {...listData.listProps}>
        {children}
      </Component>
    </ActivityListContext.Provider>
  );
}

interface ListItemsProps {
  children: (activity: Activity, index: number) => ReactNode;
}

function ListItems({ children }: ListItemsProps) {
  const { activities } = useActivityListContext();

  return <>{activities.map((activity, index) => children(activity, index))}</>;
}

interface ListEmptyProps {
  children: ReactNode;
}

function ListEmpty({ children }: ListEmptyProps) {
  const { isEmpty } = useActivityListContext();

  if (!isEmpty) return null;

  return <>{children}</>;
}

interface ListCountProps {
  children: (count: number) => ReactNode;
}

function ListCount({ children }: ListCountProps) {
  const { count } = useActivityListContext();

  return <>{children(count)}</>;
}

type ActivityFormContextValue = ReturnType<typeof useActivityForm>;

const ActivityFormContext = createContext<ActivityFormContextValue | null>(
  null
);

function useActivityFormContext() {
  const context = useContext(ActivityFormContext);
  if (!context) {
    throw new Error(
      'ActivityForm.* components must be used within ActivityForm.Root'
    );
  }
  return context;
}

interface FormRootProps {
  initialData?: Partial<ActivityFormData>;
  onSubmit?: (data: ActivityFormData) => void | Promise<void>;
  onCancel?: () => void;
  children: ReactNode;
  className?: string;
}

function FormRoot({
  initialData,
  onSubmit,
  onCancel,
  children,
  className,
}: FormRootProps) {
  const formData = useActivityForm({ initialData, onSubmit, onCancel });

  return (
    <ActivityFormContext.Provider value={formData}>
      <form className={className} onSubmit={formData.handleSubmit}>
        {children}
      </form>
    </ActivityFormContext.Provider>
  );
}

interface FormContentInputProps {
  as?: 'textarea' | 'input';
  className?: string;
}

function FormContentInput({
  as: Component = 'textarea',
  className,
}: FormContentInputProps) {
  const { contentProps } = useActivityFormContext();

  if (Component === 'textarea') {
    return <textarea className={className} {...contentProps} />;
  }

  const inputProps = {
    ...contentProps,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: e.target.value },
      } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
      contentProps.onChange(syntheticEvent);
    },
  };

  return <input className={className} {...inputProps} />;
}

interface FormImageInputProps {
  className?: string;
}

function FormImageInput({ className }: FormImageInputProps) {
  const { imageUrlProps } = useActivityFormContext();

  return <input className={className} {...imageUrlProps} />;
}

interface FormImageFileInputProps {
  className?: string;
}

function FormImageFileInput({ className }: FormImageFileInputProps) {
  const { imageFileProps } = useActivityFormContext();

  return <input className={className} {...imageFileProps} />;
}

interface FormImagePreviewProps {
  className?: string;
  fallback?: ReactNode;
}

function FormImagePreview({ className, fallback }: FormImagePreviewProps) {
  const { imagePreview, formData } = useActivityFormContext();
  const imageUrl = imagePreview || formData.imageUrl;

  if (!imageUrl) {
    return fallback ?? null;
  }

  return (
    <div className={className}>
      {/** biome-ignore lint/performance/noImgElement: Preview images from blob URLs */}
      <img
        src={imageUrl}
        alt="Preview"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

interface FormErrorProps {
  field: keyof ActivityFormData;
  children?: (error: string) => ReactNode;
  className?: string;
}

function FormError({ field, children, className }: FormErrorProps) {
  const { errors } = useActivityFormContext();
  const error = errors[field];

  if (!error) return null;

  if (children) {
    return <>{children(error)}</>;
  }

  return <span className={className}>{error}</span>;
}

interface FormSubmitProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

function FormSubmit({
  children,
  as: Component = 'button',
  className,
}: FormSubmitProps) {
  const { isSubmitting, isValid } = useActivityFormContext();

  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isValid}
      className={className}
    >
      {children ?? (isSubmitting ? 'Saving...' : 'Save')}
    </Component>
  );
}

interface FormCancelProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

function FormCancel({
  children,
  as: Component = 'button',
  className,
}: FormCancelProps) {
  const { handleCancel } = useActivityFormContext();

  return (
    <Component type="button" onClick={handleCancel} className={className}>
      {children ?? 'Cancel'}
    </Component>
  );
}

export const ActivityPost = {
  Root,
  Timestamp,
  Content,
  Image,
  EditButton,
  DeleteButton,
};

export const ActivityList = {
  Root: ListRoot,
  Items: ListItems,
  Empty: ListEmpty,
  Count: ListCount,
};

export const ActivityForm = {
  Root: FormRoot,
  ContentInput: FormContentInput,
  ImageInput: FormImageInput,
  ImageFileInput: FormImageFileInput,
  ImagePreview: FormImagePreview,
  Error: FormError,
  Submit: FormSubmit,
  Cancel: FormCancel,
};
