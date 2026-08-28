import pg from 'pg';
import {
  Category,
  UnderCategory,
  Post,
  PostDetails,
  User,
  SubscriptionPlan,
  UserSubscription,
  ParentStudent,
  Formation,
  LiveSession,
  FormationResource,
} from './types';
import bcrypt from 'bcrypt';

const { Pool } = pg;

function getConnectionString() {
  const connString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!connString) return undefined;

  let baseUrl = connString;
  if (baseUrl.includes('?')) {
    baseUrl = `${baseUrl}&uselibpqcompat=true&sslmode=require`;
  } else {
    baseUrl = `${baseUrl}?uselibpqcompat=true&sslmode=require`;
  }
  return baseUrl;
}

const pool = new Pool({
  connectionString: getConnectionString(),
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  query_timeout: 10000,
});

export const sql = pool;
export { pool };

// ─── Categories & Posts (Base) ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await pool.query('SELECT * FROM "Category" ORDER BY id');
    return result.rows as Category[];
  } catch (e) {
    return [
      { id: 1, name: "Tronc Commun Sciences", slug: "tronc-commun-sciences", thumbnail: "", description: "Programme de mathématiques du Tronc Commun Scientifique marocain.", created_at: new Date(), updated_at: new Date() },
      { id: 2, name: "1ère Année BAC SM", slug: "1ere-annee-bac-sciences-maths", thumbnail: "", description: "Programme intensif 1ère BAC Sciences Mathématiques.", created_at: new Date(), updated_at: new Date() },
      { id: 3, name: "1ère Année BAC Sc. Exp", slug: "1ere-annee-bac-sciences-exp", thumbnail: "", description: "Cours et exercices 1ère BAC Sciences Expérimentales.", created_at: new Date(), updated_at: new Date() },
      { id: 4, name: "2ème Année BAC SM", slug: "2eme-annee-bac-sciences-maths", thumbnail: "", description: "Préparation complète au National 2ème BAC Sciences Maths A & B.", created_at: new Date(), updated_at: new Date() },
      { id: 5, name: "2ème Année BAC PC / SVT", slug: "2eme-annee-bac-pc-svt", thumbnail: "", description: "Préparation au National 2ème BAC PC et SVT.", created_at: new Date(), updated_at: new Date() },
      { id: 6, name: "Concours Post-BAC", slug: "concours-post-bac", thumbnail: "", description: "Préparation aux concours ENSA, ENSAM, Médecine, CNC.", created_at: new Date(), updated_at: new Date() },
    ];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const result = await pool.query('SELECT * FROM "Category" WHERE slug = $1', [slug]);
    return (result.rows[0] as Category) ?? null;
  } catch {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) || null;
  }
}

export async function getUnderCategories(): Promise<UnderCategory[]> {
  try {
    const result = await pool.query('SELECT * FROM "UnderCategory"');
    return result.rows as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getLatestUnderCategories(limit = 4): Promise<UnderCategory[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM "UnderCategory" ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getUnderCategoriesByCategorySlug(slug: string): Promise<UnderCategory[]> {
  try {
    const result = await pool.query(
      'SELECT uc.* FROM "UnderCategory" uc JOIN "Category" c ON c.id = uc.category_id WHERE c.slug = $1',
      [slug]
    );
    return result.rows as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getUnderCategoryBySlug(slug: string): Promise<UnderCategory | null> {
  try {
    const result = await pool.query('SELECT * FROM "UnderCategory" WHERE slug = $1', [slug]);
    return (result.rows[0] as UnderCategory) ?? null;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const result = await pool.query('SELECT * FROM "Post" ORDER BY semestre, semestre_order NULLS LAST, created_at DESC');
    return result.rows as Post[];
  } catch {
    return [];
  }
}

export async function getLatestPosts(limit = 8): Promise<Post[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM "Post" ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows as Post[];
  } catch {
    return [];
  }
}

export async function getExamPosts(limit = 6): Promise<Post[]> {
  try {
    const result = await pool.query(
      `SELECT *
       FROM "Post"
       WHERE attribute = 'exam'
          OR name ILIKE ANY($1)
          OR description ILIKE ANY($1)
       ORDER BY created_at DESC
       LIMIT $2`,
      [["%examen%", "%national%", "%bac%", "%concours%"], limit]
    );
    return result.rows as Post[];
  } catch {
    return [];
  }
}

export async function getPostsByUnderCategorySlug(slug: string): Promise<Post[]> {
  try {
    const result = await pool.query(
      'SELECT p.* FROM "Post" p JOIN "UnderCategory" uc ON uc.id = p."underCategory_id" WHERE uc.slug = $1 ORDER BY p.semestre, p.semestre_order NULLS LAST, p.created_at DESC',
      [slug]
    );
    return result.rows as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const result = await pool.query('SELECT * FROM "Post" WHERE slug = $1', [slug]);
    return (result.rows[0] as Post) ?? null;
  } catch {
    return null;
  }
}

export async function getPostDetailsByPostSlug(slug: string): Promise<PostDetails[]> {
  try {
    const result = await pool.query(
      'SELECT pd.* FROM "PostDetails" pd JOIN "Post" p ON p.id = pd.post_id WHERE p.slug = $1',
      [slug]
    );
    return result.rows as PostDetails[];
  } catch {
    return [];
  }
}

export async function getAllPostDetails(): Promise<PostDetails[]> {
  try {
    const result = await pool.query('SELECT * FROM "PostDetails"');
    return result.rows as PostDetails[];
  } catch {
    return [];
  }
}

export async function getAllPostDetailsWithPostName(): Promise<(PostDetails & { post_name?: string })[]> {
  try {
    const result = await pool.query(`
      SELECT pd.*, p.name as post_name 
      FROM "PostDetails" pd 
      JOIN "Post" p ON p.id = pd.post_id
    `);
    return result.rows as (PostDetails & { post_name?: string })[];
  } catch {
    return [];
  }
}

export interface PostWithCategory {
  post: Post;
  category: Category | null;
  underCategory: UnderCategory | null;
}

export async function getPostWithCategory(slug: string): Promise<PostWithCategory | null> {
  try {
    const result = await pool.query<{
      p_id: number; p_name: string; p_thumbnail: string; p_description: string;
      p_slug: string; p_underCategoryId: number; p_attribute: string;
      p_semestre: number; p_semestre_order: number; p_created_at: Date; p_updated_at: Date;
      uc_id: number; uc_name: string; uc_thumbnail: string; uc_description: string;
      uc_slug: string; uc_category_id: number; uc_created_at: Date; uc_updated_at: Date;
      c_id: number; c_name: string; c_thumbnail: string; c_description: string;
      c_slug: string; c_created_at: Date; c_updated_at: Date;
    }>(
      `SELECT
         p.id            AS p_id,
         p.name          AS p_name,
         p.thumbnail     AS p_thumbnail,
         p.description   AS p_description,
         p.slug          AS p_slug,
         p."underCategory_id" AS "p_underCategoryId",
         p.attribute     AS p_attribute,
         p.semestre      AS p_semestre,
         p.semestre_order AS p_semestre_order,
         p.created_at    AS p_created_at,
         p.updated_at    AS p_updated_at,
         uc.id           AS uc_id,
         uc.name         AS uc_name,
         uc.thumbnail    AS uc_thumbnail,
         uc.description  AS uc_description,
         uc.slug         AS uc_slug,
         uc.category_id  AS uc_category_id,
         uc.created_at   AS uc_created_at,
         uc.updated_at   AS uc_updated_at,
         c.id            AS c_id,
         c.name          AS c_name,
         c.thumbnail     AS c_thumbnail,
         c.description   AS c_description,
         c.slug          AS c_slug,
         c.created_at    AS c_created_at,
         c.updated_at    AS c_updated_at
       FROM "Post" p
       LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
       LEFT JOIN "Category" c ON c.id = uc.category_id
       WHERE p.slug = $1`,
      [slug]
    );

    if (!result.rows.length) return null;
    const row = result.rows[0];

    return {
      post: {
        id: row.p_id,
        name: row.p_name,
        thumbnail: row.p_thumbnail,
        description: row.p_description,
        slug: row.p_slug,
        underCategoryId: row["p_underCategoryId"],
        attribute: row.p_attribute,
        semestre: row.p_semestre,
        semestre_order: row.p_semestre_order,
        created_at: row.p_created_at,
        updated_at: row.p_updated_at,
      },
      underCategory: row.uc_id
        ? {
            id: row.uc_id,
            name: row.uc_name,
            thumbnail: row.uc_thumbnail,
            description: row.uc_description,
            slug: row.uc_slug,
            category_id: row.uc_category_id,
            created_at: row.uc_created_at,
            updated_at: row.uc_updated_at,
          }
        : null,
      category: row.c_id
        ? {
            id: row.c_id,
            name: row.c_name,
            thumbnail: row.c_thumbnail,
            description: row.c_description,
            slug: row.c_slug,
            created_at: row.c_created_at,
            updated_at: row.c_updated_at,
          }
        : null,
    };
  } catch {
    return null;
  }
}

export async function getRelatedPostsBySlug(slug: string, limit = 6): Promise<Post[]> {
  try {
    const result = await pool.query<Post>(
      `WITH target AS (
         SELECT "underCategory_id" FROM "Post" WHERE slug = $1
       )
       SELECT p.* FROM "Post" p, target
       WHERE p."underCategory_id" = target."underCategory_id"
         AND p.slug <> $1
       ORDER BY p.semestre NULLS LAST, p.semestre_order NULLS LAST, p.created_at DESC
       LIMIT $2`,
      [slug, limit]
    );

    if (result.rows.length > 0) return result.rows;

    const fallback = await pool.query<Post>(
      `SELECT * FROM "Post" WHERE slug <> $1 ORDER BY created_at DESC LIMIT $2`,
      [slug, limit]
    );
    return fallback.rows;
  } catch {
    return [];
  }
}

// ─── Subscriptions & Plans ──────────────────────────────────────────────────

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Pack Tronc Commun Sciences",
    slug: "pack-tronc-commun",
    niveau: "tronc-commun",
    level_label: "Tronc Commun Scientifique",
    price: 199,
    billing_period: "mensuel",
    description: "Accompagnement continu en mathématiques avec lives réguliers, résumés et séries corrigées pas à pas.",
    features: [
      "2 séances Live par semaine (90 min / séance)",
      "Replays vidéo illimités en HD",
      "Téléchargement de tous les cours et résumés PDF",
      "Séries d'exercices avec solutions détaillées",
      "Groupe WhatsApp privé pour questions/réponses",
    ],
    is_popular: false,
    is_active: true,
  },
  {
    id: 2,
    name: "Pack 1ère Année BAC SM & Exp",
    slug: "pack-1bac",
    niveau: "1bac",
    level_label: "1ère Année Baccalauréat (SM / Sc. Exp)",
    price: 249,
    billing_period: "mensuel",
    description: "La formule idéale pour bâtir un socle solide pour le Baccalauréat et l'Examen Régional.",
    features: [
      "3 séances Live interactives par semaine",
      "Replays disponibles 24/7",
      "Préparation aux contrôles continus & devoirs surveillés",
      "Téléchargement illimité des fascicules d'exercices corrigés",
      "Suivi personnalisé et contact direct avec l'enseignant",
    ],
    is_popular: false,
    is_active: true,
  },
  {
    id: 3,
    name: "Pack 2ème BAC Excellence (SM / PC / SVT)",
    slug: "pack-2bac-excellence",
    niveau: "2bac",
    level_label: "2ème Année Baccalauréat (National)",
    price: 349,
    billing_period: "mensuel",
    description: "Notre programme phare de préparation intensive à l'Examen National avec les annales et méthodes clés.",
    features: [
      "4 séances Live par semaine (Cours, Méthodes & Annales)",
      "Correction en direct de plus de 15 années d'Examens Nationaux",
      "Téléchargement de tous les polycopiés et corrigés types",
      "Simulations d'examens blancs notés avec feedback",
      "Groupe d'entraide VIP WhatsApp 7j/7",
      "Rapport mensuel de progression pour les parents",
    ],
    is_popular: true,
    is_active: true,
  },
  {
    id: 4,
    name: "Pack Concours Post-BAC (Médecine, ENSA, ENSAM, CNC)",
    slug: "pack-concours",
    niveau: "concours",
    level_label: "Préparation Concours Post-Baccalauréat",
    price: 449,
    billing_period: "trimestriel",
    description: "Entraînement chronométré aux QCMs, astuces de calcul rapide et résolution des concours précédents.",
    features: [
      "Banque de +1000 QCMs interactifs corrigés",
      "Séances Live dédiées aux astuces et raccourcis de calcul",
      "Corrigés complets des concours de 2015 à aujourd'hui",
      "Fiches de synthèse formulaire & mnémotechniques",
      "Accompagnement jusqu'au jour des épreuves",
    ],
    is_popular: false,
    is_active: true,
  },
];

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const result = await pool.query('SELECT * FROM subscription_plan WHERE is_active = true ORDER BY price ASC');
    if (result.rows.length > 0) return result.rows;
  } catch {}
  return DEFAULT_PLANS;
}

export async function getPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
  const plans = await getSubscriptionPlans();
  return plans.find((p) => p.slug === slug) || null;
}

export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  try {
    const result = await pool.query(
      `SELECT us.*, sp.name as plan_name, sp.niveau as niveau
       FROM user_subscription us
       LEFT JOIN subscription_plan sp ON sp.id = us.plan_id
       WHERE us.user_id = $1
       ORDER BY us.created_at DESC
       LIMIT 1`,
      [userId]
    );
    if (result.rows.length > 0) return result.rows[0];
  } catch {}
  return null;
}

export async function getAllUserSubscriptions(): Promise<UserSubscription[]> {
  try {
    const result = await pool.query(
      `SELECT us.*, u.name as user_name, u.email as user_email, sp.name as plan_name, sp.niveau as niveau
       FROM user_subscription us
       JOIN users u ON u.id = us.user_id
       LEFT JOIN subscription_plan sp ON sp.id = us.plan_id
       ORDER BY us.created_at DESC`
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function createUserSubscription(data: {
  user_id: number;
  plan_id: number;
  payment_method: string;
  notes?: string;
  durationMonths?: number;
}): Promise<UserSubscription> {
  const durationMonths = data.durationMonths || 1;
  const startedAt = new Date();
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

  try {
    const result = await pool.query(
      `INSERT INTO user_subscription (user_id, plan_id, status, started_at, expires_at, payment_method, notes)
       VALUES ($1, $2, 'active', $3, $4, $5, $6)
       RETURNING *`,
      [data.user_id, data.plan_id, startedAt, expiresAt, data.payment_method, data.notes || null]
    );
    return result.rows[0];
  } catch (e) {
    // Return mock subscription object if DB query fails in local test
    return {
      id: Date.now(),
      user_id: data.user_id,
      plan_id: data.plan_id,
      status: 'active',
      started_at: startedAt,
      expires_at: expiresAt,
      payment_method: data.payment_method as any,
      notes: data.notes,
      created_at: new Date(),
    };
  }
}

export async function updateSubscriptionStatus(id: number, status: 'active' | 'pending' | 'expired' | 'cancelled'): Promise<boolean> {
  try {
    await pool.query('UPDATE user_subscription SET status = $1 WHERE id = $2', [status, id]);
    return true;
  } catch {
    return false;
  }
}

// ─── Formations & Lives ─────────────────────────────────────────────────────

export const DEFAULT_LIVES: LiveSession[] = [
  {
    id: 1,
    title: "Méthodes Clés : Étude de Fonctions & Dérivabilité (2ème BAC)",
    description: "Séance en direct consacrée aux techniques de calcul de dérivées, tangentes et tracé des courbes représentatives.",
    niveau: "2bac",
    niveau_label: "2ème Année BAC SM & PC/SVT",
    instructor_name: "Professeur K. Ennaouri",
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
    duration_minutes: 90,
    meeting_url: "https://meet.google.com/maths-exams-live",
    status: "upcoming",
    resources_count: 3,
    created_at: new Date(),
  },
  {
    id: 2,
    title: "Suites Numériques : Raisonnement par Récurrence et Limites (1ère BAC)",
    description: "Entraînement pas à pas sur les suites arithmétiques, géométriques et les suites récurrentes avec calcul de limites.",
    niveau: "1bac",
    niveau_label: "1ère Année BAC",
    instructor_name: "Professeur A. Benjelloun",
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
    duration_minutes: 90,
    meeting_url: "https://meet.google.com/maths-exams-1bac",
    status: "upcoming",
    resources_count: 2,
    created_at: new Date(),
  },
  {
    id: 3,
    title: "Trigonométrie et Équations : Formules & Astuces (Tronc Commun)",
    description: "Maîtriser le cercle trigonométrique, les formules de transformation et la résolution des équations trigonométriques.",
    niveau: "tronc-commun",
    niveau_label: "Tronc Commun Sciences",
    instructor_name: "Professeur M. Tazi",
    scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
    duration_minutes: 75,
    meeting_url: "https://meet.google.com/maths-exams-tc",
    status: "upcoming",
    resources_count: 2,
    created_at: new Date(),
  },
  {
    id: 4,
    title: "Replay : Examen Blanc N°1 — Intégration et Primitives (2ème BAC SM)",
    description: "Correction détaillée et astuces de rédaction pour l'examen blanc.",
    niveau: "2bac",
    niveau_label: "2ème Année BAC SM",
    instructor_name: "Professeur K. Ennaouri",
    scheduled_at: new Date(Date.now() - 48 * 60 * 60 * 1000), // Passé
    duration_minutes: 105,
    replay_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "completed",
    resources_count: 4,
    created_at: new Date(),
  },
];

export async function getLiveSessions(limit = 10): Promise<LiveSession[]> {
  try {
    const result = await pool.query(
      `SELECT ls.*, f.title as formation_title 
       FROM live_session ls
       LEFT JOIN formation f ON f.id = ls.formation_id
       ORDER BY ls.scheduled_at ASC
       LIMIT $1`,
      [limit]
    );
    if (result.rows.length > 0) return result.rows;
  } catch {}
  return DEFAULT_LIVES;
}

export async function getUpcomingLiveSessions(limit = 6): Promise<LiveSession[]> {
  const all = await getLiveSessions(20);
  return all.filter((s) => s.status !== 'completed').slice(0, limit);
}

export async function createLiveSession(data: {
  title: string;
  description: string;
  niveau: string;
  niveau_label: string;
  instructor_name: string;
  scheduled_at: Date;
  duration_minutes: number;
  meeting_url?: string;
  replay_url?: string;
  formation_id?: number;
}): Promise<LiveSession> {
  try {
    const result = await pool.query(
      `INSERT INTO live_session (title, description, niveau, niveau_label, instructor_name, scheduled_at, duration_minutes, meeting_url, replay_url, formation_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'upcoming')
       RETURNING *`,
      [
        data.title,
        data.description,
        data.niveau,
        data.niveau_label,
        data.instructor_name,
        data.scheduled_at,
        data.duration_minutes,
        data.meeting_url || null,
        data.replay_url || null,
        data.formation_id || null,
      ]
    );
    return result.rows[0];
  } catch {
    return {
      id: Date.now(),
      ...data,
      status: 'upcoming',
      created_at: new Date(),
    };
  }
}

export const DEFAULT_FORMATIONS: Formation[] = [
  {
    id: 1,
    title: "Formation Complète 2ème BAC Sciences Mathématiques",
    slug: "formation-2bac-sm",
    description: "Le programme intégral de mathématiques 2ème BAC SM : limites, continuité, dérivation, suites, fonctions exponentielles et logarithmiques, nombres complexes, intégration, arithmétique et structures algébriques.",
    niveau: "2bac-sm",
    niveau_label: "2ème BAC Sciences Maths",
    thumbnail: "/ThumbnailSerieExponentielle.png",
    is_premium: true,
    instructor_name: "Professeur K. Ennaouri",
    total_hours: 45,
    total_chapters: 12,
    created_at: new Date(),
  },
  {
    id: 2,
    title: "Formation Complète 2ème BAC PC & SVT",
    slug: "formation-2bac-pc-svt",
    description: "Tout le programme de mathématiques pour réussir brillamment l'Examen National : cours structurés, fiches de révision, exercices d'application et annales corrigées pas à pas.",
    niveau: "2bac-pc-svt",
    niveau_label: "2ème BAC PC / SVT",
    thumbnail: "/ThumbnailSerieExponentielle.png",
    is_premium: true,
    instructor_name: "Professeur A. Benjelloun",
    total_hours: 35,
    total_chapters: 9,
    created_at: new Date(),
  },
  {
    id: 3,
    title: "Formation Fondations 1ère BAC Sciences Maths & Exp",
    slug: "formation-1bac",
    description: "Acquérir les méthodes rigoureuses de raisonnement, de dérivation et de géométrie vectorielle indispensables pour la réussite au lycée.",
    niveau: "1bac",
    niveau_label: "1ère Année Baccalauréat",
    thumbnail: "/ThumbnailSerieExponentielle.png",
    is_premium: true,
    instructor_name: "Professeur M. Tazi",
    total_hours: 28,
    total_chapters: 8,
    created_at: new Date(),
  },
  {
    id: 4,
    title: "Pack Entraînement Concours Ingénieurs & Médecine",
    slug: "formation-concours",
    description: "Techniques rapides de résolution de QCM, gestion du temps, révision des pièges classiques et correction des épreuves 2018-2025.",
    niveau: "concours",
    niveau_label: "Concours Post-BAC",
    thumbnail: "/ThumbnailSerieExponentielle.png",
    is_premium: true,
    instructor_name: "Équipe Pédagogique Maths-Exams",
    total_hours: 30,
    total_chapters: 10,
    created_at: new Date(),
  },
];

export async function getFormations(): Promise<Formation[]> {
  try {
    const result = await pool.query('SELECT * FROM formation ORDER BY id ASC');
    if (result.rows.length > 0) return result.rows;
  } catch {}
  return DEFAULT_FORMATIONS;
}

export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  const list = await getFormations();
  return list.find((f) => f.slug === slug) || null;
}

export const DEFAULT_RESOURCES: FormationResource[] = [
  {
    id: 1,
    formation_id: 1,
    title: "Fascicule de Cours & Démonstrations : Limites et Continuité",
    file_url: "/uploads/1776450969294-Cours_Etude_de_fonctions_SM.pdf",
    file_type: "cours",
    is_premium: true,
    created_at: new Date(),
  },
  {
    id: 2,
    formation_id: 1,
    title: "Série d'Exercices N°1 : Dérivabilité et Théorème de Rolle / TAF",
    file_url: "/uploads/1776450969294-Cours_Etude_de_fonctions_SM.pdf",
    file_type: "exercices",
    is_premium: true,
    created_at: new Date(),
  },
  {
    id: 3,
    formation_id: 1,
    title: "Corrigé Détaillé et Barème : Devoir Surveillé N°1 Semestre 1",
    file_url: "/uploads/1776450969294-Cours_Etude_de_fonctions_SM.pdf",
    file_type: "correction",
    is_premium: true,
    created_at: new Date(),
  },
  {
    id: 4,
    formation_id: 2,
    title: "Fiche Méthode : Étude Complète de Fonctions Logarithmes & Exponentielles",
    file_url: "/uploads/1776450969294-Cours_Etude_de_fonctions_SM.pdf",
    file_type: "cours",
    is_premium: true,
    created_at: new Date(),
  },
  {
    id: 5,
    formation_id: 2,
    title: "Série d'Exercices Type Examen National avec Solutions Pas à Pas",
    file_url: "/uploads/1776450969294-Cours_Etude_de_fonctions_SM.pdf",
    file_type: "exercices",
    is_premium: true,
    created_at: new Date(),
  },
];

export async function getFormationResources(formationId: number): Promise<FormationResource[]> {
  try {
    const result = await pool.query('SELECT * FROM formation_resource WHERE formation_id = $1 ORDER BY id ASC', [formationId]);
    if (result.rows.length > 0) return result.rows;
  } catch {}
  return DEFAULT_RESOURCES.filter((r) => r.formation_id === formationId || formationId === 1);
}

// ─── Parent - Student Relationship ──────────────────────────────────────────

export async function getParentStudents(parentId: number): Promise<ParentStudent[]> {
  try {
    const result = await pool.query(
      `SELECT ps.*, u.name as student_name, u.email as student_email, u.niveau as student_niveau
       FROM parent_student ps
       JOIN users u ON u.id = ps.student_id
       WHERE ps.parent_id = $1`,
      [parentId]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function linkParentToStudent(parentId: number, studentEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    const student = await getUserByEmail(studentEmail);
    if (!student) {
      return { success: false, message: "Aucun compte étudiant trouvé avec cet email." };
    }
    if (student.role !== 'etudiant') {
      return { success: false, message: "Ce compte n'est pas un profil étudiant." };
    }

    await pool.query(
      `INSERT INTO parent_student (parent_id, student_id, status)
       VALUES ($1, $2, 'active')
       ON CONFLICT (parent_id, student_id) DO NOTHING`,
      [parentId, student.id]
    );

    return { success: true, message: "L'étudiant a été rattaché à votre compte avec succès !" };
  } catch (e: any) {
    return { success: false, message: e.message || "Erreur lors du rattachement." };
  }
}

// ─── Users (Auth & Management) ───────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0] as User;

    if (!user.password) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    delete (user as any).password;

    if (user.metadata && typeof user.metadata === 'string') {
      try {
        const meta = JSON.parse(user.metadata);
        if (meta?.emailVerified === false) {
          return { ...user, needsVerification: true };
        }
      } catch {}
    }

    return user;
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'etudiant' | 'parent' | 'enseignant' | 'user' = 'etudiant',
  metadata?: string,
  niveau?: string,
  phone?: string
): Promise<User> {
  const hashedPassword = password ? await hashPassword(password) : '';
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role, metadata, niveau, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [email, hashedPassword, name, role, metadata || null, niveau || null, phone || null]
    );
    const user = result.rows[0] as User;
    delete (user as any).password;
    return user;
  } catch {
    return {
      id: Date.now(),
      email,
      name,
      role,
      niveau,
      phone,
      created_at: new Date(),
    };
  }
}

export async function updateUser(
  id: number,
  data: { name?: string; metadata?: string; image?: string; niveau?: string; phone?: string }
): Promise<User | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.metadata !== undefined) {
    updates.push(`metadata = $${paramIndex++}`);
    values.push(data.metadata);
  }
  if (data.image !== undefined) {
    updates.push(`image = $${paramIndex++}`);
    values.push(data.image);
  }
  if (data.niveau !== undefined) {
    updates.push(`niveau = $${paramIndex++}`);
    values.push(data.niveau);
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    values.push(data.phone);
  }

  if (updates.length === 0) return null;

  values.push(id);
  try {
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return null;
    const user = result.rows[0] as User;
    delete (user as any).password;
    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0] as User;
    delete (user as any).password;
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0] as User;
    delete (user as any).password;
    return user;
  } catch {
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await pool.query('SELECT id, email, name, role, niveau, phone, created_at FROM users ORDER BY created_at DESC');
    return result.rows as User[];
  } catch {
    return [];
  }
}
