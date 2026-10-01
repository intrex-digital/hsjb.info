/**
 * Standard API error structure from the backend.
 */
export interface ApiErrorResponse {
  status: "error";
  code: string;
  message: string;
  detail?: Record<string, string[]> | null;
}

/**
 * Standard paginated response envelope from the backend.
 */
export interface PaginatedResponse<T> {
  status: "ok";
  count: number | null;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Custom Error class that encapsulates our standard backend error format.
 */
export class ApiError extends Error {
  public code: string;
  public detail?: Record<string, string[]> | null;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.code = response.code;
    this.detail = response.detail;
  }
}

export interface Profile {
  name: string;
  headline: string;
  short_bio: string;
  hero_image_url: string;
  about_text: string;
  about_image_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  resume_url: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  icon_url: string;
  proficiency: number;
  order: number;
  category: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  order: number;
  skills: Skill[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  order: number;
}

export interface Training {
  id: number;
  title: string;
  institution: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  order: number;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string;
  credential_url: string;
  order: number;
}

export interface IndustrialProject {
  id: number;
  title: string;
  role: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  link: string;
  image_url: string;
  technologies: string;
  order: number;
}

export interface TrainingProject {
  id: number;
  title: string;
  role: string;
  institution: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  link: string;
  technologies: string;
  order: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  price_range: string;
  order: number;
  is_active: boolean;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  status: "draft" | "published";
  published_at: string | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  created_at: string;
  updated_at: string;
}
