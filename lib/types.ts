export interface Category {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface UnderCategory {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  underCategoryId: number;
  attribute?: string;
  semestre?: number;
  semestre_order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface PostDetails {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  post_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'etudiant' | 'parent' | 'enseignant' | 'user';
  niveau?: string; // 'tronc-commun' | '1bac-sm' | '1bac-exp' | '2bac-sm' | '2bac-pc' | '2bac-svt' | 'concours'
  phone?: string;
  metadata?: string;
  image?: string;
  created_at: Date;
  needsVerification?: boolean;
}

// ─── Subscriptions & Plans ──────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  niveau: string; // 'tronc-commun' | '1bac' | '2bac' | 'concours' | 'all'
  level_label: string;
  price: number; // in MAD
  billing_period: 'mensuel' | 'trimestriel' | 'annuel';
  description: string;
  features: string[];
  is_popular?: boolean;
  is_active: boolean;
  created_at?: Date;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  plan_id: number;
  plan_name?: string;
  niveau?: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  started_at: Date;
  expires_at: Date;
  payment_method: 'virement' | 'carte' | 'especes' | 'whatsapp';
  notes?: string;
  created_at: Date;
}

// ─── Parent & Student Relationship ──────────────────────────────────────────

export interface ParentStudent {
  id: number;
  parent_id: number;
  student_id: number;
  student_name?: string;
  student_email?: string;
  student_niveau?: string;
  status: 'active' | 'pending';
  created_at: Date;
}

// ─── Formations & Live Sessions ─────────────────────────────────────────────

export interface Formation {
  id: number;
  title: string;
  slug: string;
  description: string;
  niveau: string;
  niveau_label: string;
  category_id?: number;
  thumbnail: string;
  is_premium: boolean;
  instructor_name: string;
  total_hours?: number;
  total_chapters?: number;
  created_at: Date;
}

export interface LiveSession {
  id: number;
  formation_id?: number;
  formation_title?: string;
  title: string;
  description: string;
  niveau: string;
  niveau_label: string;
  instructor_name: string;
  scheduled_at: Date;
  duration_minutes: number;
  meeting_url?: string;
  replay_url?: string;
  status: 'upcoming' | 'live' | 'completed';
  resources_count?: number;
  created_at: Date;
}

export interface FormationResource {
  id: number;
  formation_id: number;
  live_session_id?: number;
  title: string;
  file_url: string;
  file_type: 'cours' | 'exercices' | 'correction' | 'devoir';
  is_premium: boolean;
  created_at: Date;
}
