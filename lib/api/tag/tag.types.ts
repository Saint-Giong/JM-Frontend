/**
 * Skill Tag API Types
 *
 * TypeScript types corresponding to the backend SkillTag service DTOs.
 */

/**
 * Skill tag entity
 */
export interface SkillTag {
  id: number;
  name: string;
}

/**
 * Paginated response for skill tags
 */
export interface SkillTagPage {
  content: SkillTag[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Parameters for listing skill tags
 */
export interface SkillTagListParams {
  page?: number;
  size?: number;
}

/**
 * Parameters for searching skill tags (autocomplete)
 */
export interface SkillTagSearchParams {
  prefix: string;
  limit?: number;
}

/**
 * Request DTO for creating a skill tag
 */
export interface CreateSkillTagRequest {
  name: string;
}

/**
 * Request DTO for updating a skill tag
 */
export interface UpdateSkillTagRequest {
  name: string;
}

/**
 * Generic response wrapper from backend
 */
export interface SkillTagResponse<T = SkillTag> {
  success: boolean;
  message: string;
  data?: T;
}
