/**
 * Admin Dev Tools Types
 */

import type { ReactNode } from 'react';

// DataTable column definition
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => ReactNode;
}

// Pagination state
export interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Sort state
export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

// Admin navigation item
export interface AdminNavItem {
  title: string;
  href: string;
  description?: string;
}

// Entity detail sheet props
export interface EntityDetailProps<T> {
  entity: T | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
}

// API Tester types
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  pathParams?: string[];
  hasBody?: boolean;
}

export interface ApiService {
  name: string;
  basePath: string;
  endpoints: ApiEndpoint[];
}

// Quick stat card
export interface QuickStat {
  label: string;
  value: number | string;
  href?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
