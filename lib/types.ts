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

// ─── Progression Étudiant ────────────────────────────────────────────────────

export interface UserProgress {
  id: number;
  user_id: number;
  post_id: number;
  post_slug: string;
  post_name?: string;
  category_name?: string;
  category_slug?: string;
  viewed_at: Date;
}

export interface UserProgressStats {
  total_viewed: number;
  recent: UserProgress[];
  by_category: {
    category_name: string;
    category_slug: string;
    viewed: number;
    total: number;
    percent: number;
  }[];
  streak_days: number;
}

// ─── QCM Interactif ───────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  explanation?: string;
  position: number;
  choices: string[];
  correct_index: number;
  created_at: Date;
}

export interface Quiz {
  id: number;
  post_id: number;
  title: string;
  description?: string;
  time_limit: number;
  is_active: boolean;
  questions: QuizQuestion[];
  created_at: Date;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  answers: { question_id: number; chosen_index: number }[];
  score: number;
  total: number;
  completed: boolean;
  started_at: Date;
  completed_at?: Date;
}

// ─── Calendrier des Examens ────────────────────────────────────────────────────

export interface ExamEvent {
  id: number;
  title: string;
  event_date: Date;
  event_time?: string;
  end_date?: Date;
  type: 'examen_national' | 'examen_regional' | 'concours' | 'devoir_surveille' | 'autre';
  niveau?: string;
  niveau_label?: string;
  description?: string;
  location?: string;
  pdf_url?: string;
  source_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
