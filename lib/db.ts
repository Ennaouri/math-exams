import prisma from './prisma';
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
  UserProgress,
  UserProgressStats,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  ExamEvent,
} from './types';
import bcrypt from 'bcrypt';

// Polyfill for legacy @vercel/postgres pool.query calls in API routes
export const pool = {
  query: async (text: string, values?: any[]) => {
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(text, ...(values || []));
      return { rows: Array.isArray(rows) ? rows : [], rowCount: Array.isArray(rows) ? rows.length : 0 };
    } catch (e: any) {
      // Prisma raw queries that don't return rows might return a number (affected rows)
      if (typeof e === 'number') return { rows: [], rowCount: e };
      throw e;
    }
  }
};

// ─── Categories & Posts (Base) ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    return (await prisma.category.findMany({ orderBy: { id: 'asc' } })) as Category[];
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
    const category = await prisma.category.findUnique({ where: { slug } });
    if (category) return category as Category;
    const all = await getCategories();
    return all.find((c) => c.slug === slug) || null;
  } catch {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) || null;
  }
}

export async function getUnderCategories(): Promise<UnderCategory[]> {
  try {
    return (await prisma.underCategory.findMany()) as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getLatestUnderCategories(limit = 4): Promise<UnderCategory[]> {
  try {
    return (await prisma.underCategory.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
    })) as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getUnderCategoriesByCategorySlug(slug: string): Promise<UnderCategory[]> {
  try {
    return (await prisma.underCategory.findMany({
      where: { Category: { slug } },
    })) as UnderCategory[];
  } catch {
    return [];
  }
}

export async function getUnderCategoryBySlug(slug: string): Promise<UnderCategory | null> {
  try {
    return (await prisma.underCategory.findUnique({ where: { slug } })) as UnderCategory | null;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    return (await prisma.post.findMany({
      orderBy: [
        { semestre: 'asc' },
        { semestre_order: 'asc' },
        { created_at: 'desc' }
      ]
    })) as Post[];
  } catch {
    return [];
  }
}

export async function getLatestPosts(limit = 8): Promise<Post[]> {
  try {
    return (await prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
    })) as Post[];
  } catch {
    return [];
  }
}

export async function getExamPosts(limit = 6): Promise<Post[]> {
  try {
    return (await prisma.post.findMany({
      where: {
        OR: [
          { name: { contains: 'examen', mode: 'insensitive' } },
          { name: { contains: 'national', mode: 'insensitive' } },
          { name: { contains: 'bac', mode: 'insensitive' } },
          { name: { contains: 'concours', mode: 'insensitive' } },
          { description: { contains: 'examen', mode: 'insensitive' } },
          { description: { contains: 'national', mode: 'insensitive' } },
          { description: { contains: 'bac', mode: 'insensitive' } },
          { description: { contains: 'concours', mode: 'insensitive' } }
        ]
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    })) as unknown as Post[];
  } catch {
    return [];
  }
}

export async function getPostsByUnderCategorySlug(slug: string): Promise<Post[]> {
  try {
    return (await prisma.post.findMany({
      where: { UnderCategory: { slug } },
      orderBy: [
        { semestre: 'asc' },
        { semestre_order: 'asc' },
        { created_at: 'desc' }
      ]
    })) as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return (await prisma.post.findUnique({ where: { slug } })) as Post | null;
  } catch {
    return null;
  }
}

export async function getPostDetailsByPostSlug(slug: string): Promise<PostDetails[]> {
  try {
    return (await prisma.postDetails.findMany({
      where: { Post: { slug } }
    })) as PostDetails[];
  } catch {
    return [];
  }
}

export async function getAllPostDetails(): Promise<PostDetails[]> {
  try {
    return (await prisma.postDetails.findMany()) as PostDetails[];
  } catch {
    return [];
  }
}

export async function getAllPostDetailsWithPostName(): Promise<(PostDetails & { post_name?: string })[]> {
  try {
    const details = await prisma.postDetails.findMany({
      include: { Post: { select: { name: true } } }
    });
    return details.map(d => ({
      ...d,
      post_name: d.Post?.name
    })) as (PostDetails & { post_name?: string })[];
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
    const p = await prisma.post.findUnique({
      where: { slug },
      include: {
        UnderCategory: {
          include: {
            Category: true
          }
        }
      }
    });

    if (!p) return null;

    const underCategory = p.UnderCategory;
    const category = underCategory?.Category || null;

    const { UnderCategory: _uc, ...postData } = p;
    let ucData: any = null;
    if (underCategory) {
      const { Category: _c, ...ucRest } = underCategory;
      ucData = ucRest;
    }

    return {
      post: postData as Post,
      underCategory: ucData as UnderCategory | null,
      category: category as Category | null,
    };
  } catch {
    return null;
  }
}

export async function getRelatedPostsBySlug(slug: string, limit = 6): Promise<Post[]> {
  try {
    const targetPost = await prisma.post.findUnique({ where: { slug }, select: { underCategory_id: true } });
    if (targetPost?.underCategory_id) {
      const related = await prisma.post.findMany({
        where: {
          underCategory_id: targetPost.underCategory_id,
          slug: { not: slug }
        },
        orderBy: [
          { semestre: 'asc' },
          { semestre_order: 'asc' },
          { created_at: 'desc' }
        ],
        take: limit
      });
      if (related.length > 0) return related as Post[];
    }

    const fallback = await prisma.post.findMany({
      where: { slug: { not: slug } },
      orderBy: { created_at: 'desc' },
      take: limit
    });
    return fallback as Post[];
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
    const plans = await prisma.subscriptionPlan.findMany({
      where: { is_active: true },
      orderBy: { price: 'asc' }
    });
    if (plans.length > 0) return plans.map(p => ({ ...p, price: Number(p.price), features: p.features as any })) as SubscriptionPlan[];
  } catch {}
  return DEFAULT_PLANS;
}

export async function getPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
  const plans = await getSubscriptionPlans();
  return plans.find((p) => p.slug === slug) || null;
}

export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  try {
    const us = await prisma.userSubscription.findFirst({
      where: { user_id: userId },
      include: {
        Plan: { select: { name: true, niveau: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    if (us) {
      return {
        ...us,
        plan_name: us.Plan?.name,
        niveau: us.Plan?.niveau,
      } as UserSubscription;
    }
  } catch {}
  return null;
}

export async function getAllUserSubscriptions(): Promise<UserSubscription[]> {
  try {
    const subs = await prisma.userSubscription.findMany({
      include: {
        User: { select: { name: true, email: true } },
        Plan: { select: { name: true, niveau: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    return subs.map(us => ({
      ...us,
      user_name: us.User?.name,
      user_email: us.User?.email,
      plan_name: us.Plan?.name,
      niveau: us.Plan?.niveau,
    })) as UserSubscription[];
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
    const us = await prisma.userSubscription.create({
      data: {
        user_id: data.user_id,
        plan_id: data.plan_id,
        status: 'active',
        started_at: startedAt,
        expires_at: expiresAt,
        payment_method: data.payment_method,
        notes: data.notes || null
      }
    });
    return us as UserSubscription;
  } catch (e) {
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
    await prisma.userSubscription.update({
      where: { id },
      data: { status }
    });
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
    const sessions = await prisma.liveSession.findMany({
      include: {
        Formation: { select: { title: true } }
      },
      orderBy: { scheduled_at: 'asc' },
      take: limit
    });
    if (sessions.length > 0) {
      return sessions.map(s => ({
        ...s,
        formation_title: s.Formation?.title
      })) as LiveSession[];
    }
  } catch {}
  return DEFAULT_LIVES;
}

export async function getUpcomingLiveSessions(limit = 6): Promise<LiveSession[]> {
  const all = await getLiveSessions(20);
  return all.filter((s) => s.status !== 'completed').slice(0, limit);
}

// We'll put some users funcs in db_3 or db_4, wait... I'll put all users funcs in db_3

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
    const ls = await prisma.liveSession.create({
      data: {
        title: data.title,
        description: data.description,
        niveau: data.niveau,
        niveau_label: data.niveau_label,
        instructor_name: data.instructor_name,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes,
        meeting_url: data.meeting_url,
        replay_url: data.replay_url,
        formation_id: data.formation_id,
        status: 'upcoming'
      }
    });
    return ls as LiveSession;
  } catch {
    return {
      id: Date.now(),
      ...data,
      status: 'upcoming',
      created_at: new Date(),
    } as LiveSession;
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
    const formations = await prisma.formation.findMany({ orderBy: { id: 'asc' } });
    if (formations.length > 0) return formations as Formation[];
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
    const resources = await prisma.formationResource.findMany({
      where: { formation_id: formationId },
      orderBy: { id: 'asc' }
    });
    if (resources.length > 0) return resources as FormationResource[];
  } catch {}
  return DEFAULT_RESOURCES.filter((r) => r.formation_id === formationId || formationId === 1);
}

// ─── Parent - Student Relationship ──────────────────────────────────────────

export async function getParentStudents(parentId: number): Promise<ParentStudent[]> {
  try {
    const relations = await prisma.parentStudent.findMany({
      where: { parent_id: parentId },
      include: {
        Student: { select: { name: true, email: true, niveau: true } }
      }
    });
    return relations.map(r => ({
      ...r,
      student_name: r.Student?.name,
      student_email: r.Student?.email,
      student_niveau: r.Student?.niveau,
    })) as ParentStudent[];
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

    const existing = await prisma.parentStudent.findUnique({
      where: {
        parent_id_student_id: {
          parent_id: parentId,
          student_id: student.id
        }
      }
    });

    if (!existing) {
      await prisma.parentStudent.create({
        data: {
          parent_id: parentId,
          student_id: student.id,
          status: 'active'
        }
      });
    }

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
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() } // Prisma handles case if citext, else we should use insensitive 
    }) || await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (!user) return null;
    if (!user.password) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    delete (user as any).password;

    if (user.metadata && typeof user.metadata === 'string') {
      try {
        const meta = JSON.parse(user.metadata);
        if (meta?.emailVerified === false) {
          return { ...user, needsVerification: true } as User;
        }
      } catch {}
    }

    return user as User;
  } catch {
    return null;
  }
}

export async function createUser(data: {
  email: string;
  password?: string;
  name: string;
  role?: 'admin' | 'etudiant' | 'parent' | 'enseignant' | 'user';
  metadata?: string;
  niveau?: string;
  phone?: string;
}): Promise<User> {
  const hashedPassword = data.password ? await hashPassword(data.password) : '';
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'etudiant',
        metadata: data.metadata,
        niveau: data.niveau,
        phone: data.phone
      }
    });
    delete (user as any).password;
    return user as User;
  } catch {
    return {
      id: Date.now(),
      email: data.email,
      name: data.name,
      role: data.role || 'etudiant',
      niveau: data.niveau,
      phone: data.phone,
      created_at: new Date(),
    } as User;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });
    if (!user) return null;
    delete (user as any).password;
    return user as User;
  } catch {
    return null;
  }
}

// Continuation of Users (Auth & Management)

export async function updateUser(
  id: number,
  data: { name?: string; metadata?: string; image?: string; niveau?: string; phone?: string }
): Promise<User | null> {
  const updates: any = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.metadata !== undefined) updates.metadata = data.metadata;
  if (data.image !== undefined) updates.image = data.image;
  if (data.niveau !== undefined) updates.niveau = data.niveau;
  if (data.phone !== undefined) updates.phone = data.phone;

  if (Object.keys(updates).length === 0) return null;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates
    });
    delete (user as any).password;
    return user as User;
  } catch {
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    delete (user as any).password;
    return user as User;
  } catch {
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        niveau: true,
        phone: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });
    return users as User[];
  } catch {
    return [];
  }
}

// ─── Progression Étudiant ─────────────────────────────────────────────────────

export async function trackPostView(
  userId: number,
  postId: number,
  postSlug: string,
  postName?: string,
  categoryName?: string,
  categorySlug?: string
): Promise<void> {
  try {
    const existing = await prisma.userProgress.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId
        }
      }
    });

    if (existing) {
      await prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          viewed_at: new Date(),
          post_name: postName || existing.post_name,
          category_name: categoryName || existing.category_name,
          category_slug: categorySlug || existing.category_slug,
        }
      });
    } else {
      await prisma.userProgress.create({
        data: {
          user_id: userId,
          post_id: postId,
          post_slug: postSlug,
          post_name: postName,
          category_name: categoryName,
          category_slug: categorySlug,
          viewed_at: new Date()
        }
      });
    }
  } catch {
    // silently fail — tracking is non-critical
  }
}

export async function getUserProgress(userId: number, limit = 10): Promise<UserProgress[]> {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { user_id: userId },
      orderBy: { viewed_at: 'desc' },
      take: limit
    });
    return progress as UserProgress[];
  } catch {
    return [];
  }
}

export async function getUserProgressStats(userId: number): Promise<UserProgressStats> {
  const empty: UserProgressStats = {
    total_viewed: 0,
    recent: [],
    by_category: [],
    streak_days: 0,
  };

  try {
    // Total posts viewed
    const total_viewed = await prisma.userProgress.count({
      where: { user_id: userId }
    });

    // Recent 5
    const recentRes = await prisma.userProgress.findMany({
      where: { user_id: userId },
      orderBy: { viewed_at: 'desc' },
      take: 5
    });

    // Per-category stats using raw query for complex GROUP BY
    // Since Prisma is now used, we can do raw query or complex aggregations.
    // It's easier to use raw query for this exact Postgres feature:
    const catRes = await prisma.$queryRawUnsafe<any[]>(
      `SELECT
         c.name         AS category_name,
         c.slug         AS category_slug,
         COUNT(DISTINCT p.id)::int AS total,
         COUNT(DISTINCT up.post_id)::int AS viewed
       FROM "Category" c
       JOIN "UnderCategory" uc ON uc.category_id = c.id
       JOIN "Post" p ON p."underCategory_id" = uc.id
       LEFT JOIN user_progress up
         ON up.post_id = p.id AND up.user_id = $1
       GROUP BY c.id, c.name, c.slug
       ORDER BY c.id`,
      userId
    );

    const by_category = catRes.map((row) => ({
      category_name: row.category_name,
      category_slug: row.category_slug,
      viewed: row.viewed,
      total: row.total,
      percent: row.total > 0 ? Math.round((row.viewed / row.total) * 100) : 0,
    }));

    // Streak : count consecutive days
    const streakRes = await prisma.$queryRawUnsafe<any[]>(
      `WITH daily AS (
         SELECT DISTINCT date_trunc('day', viewed_at AT TIME ZONE 'UTC') AS day
         FROM user_progress
         WHERE user_id = $1
       ),
       numbered AS (
         SELECT day, ROW_NUMBER() OVER (ORDER BY day DESC) AS rn FROM daily
       )
       SELECT COUNT(*) AS streak
       FROM numbered
       WHERE day = CURRENT_DATE - (rn - 1) * INTERVAL '1 day'`,
      userId
    );
    const streak_days = parseInt(streakRes[0]?.streak?.toString() || '0', 10);

    return {
      total_viewed,
      recent: recentRes as UserProgress[],
      by_category,
      streak_days,
    };
  } catch {
    return empty;
  }
}

// ─── Notifications Lives ──────────────────────────────────────────────────────

export async function subscribeLiveNotification(
  liveId: number,
  userId: number,
  email: string,
  userName?: string
): Promise<{ success: boolean; alreadySubscribed?: boolean }> {
  try {
    const existing = await prisma.liveNotification.findUnique({
      where: {
        live_id_user_id: {
          live_id: liveId,
          user_id: userId
        }
      }
    });

    if (!existing) {
      await prisma.liveNotification.create({
        data: {
          live_id: liveId,
          user_id: userId,
          email,
          user_name: userName
        }
      });
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function unsubscribeLiveNotification(
  liveId: number,
  userId: number
): Promise<boolean> {
  try {
    await prisma.liveNotification.deleteMany({
      where: {
        live_id: liveId,
        user_id: userId
      }
    });
    return true;
  } catch {
    return false;
  }
}

export async function isSubscribedToLive(liveId: number, userId: number): Promise<boolean> {
  try {
    const count = await prisma.liveNotification.count({
      where: { live_id: liveId, user_id: userId }
    });
    return count > 0;
  } catch {
    return false;
  }
}

export async function getUserLiveSubscriptions(userId: number): Promise<number[]> {
  try {
    const notifs = await prisma.liveNotification.findMany({
      where: { user_id: userId },
      select: { live_id: true }
    });
    return notifs.map(n => n.live_id).filter(id => id !== null) as number[];
  } catch {
    return [];
  }
}

export async function getPendingLiveNotifications(hoursAhead = 24): Promise<
  { email: string; user_name: string; live_id: number; live_title: string; scheduled_at: Date; niveau_label: string; meeting_url: string; notif_id: number }[]
> {
  try {
    // using raw query since we need date interval arithmetic
    const result = await prisma.$queryRawUnsafe<any[]>(
      `SELECT
         ln.id           AS notif_id,
         ln.email,
         ln.user_name,
         ln.live_id,
         ls.title        AS live_title,
         ls.scheduled_at,
         ls.niveau_label,
         ls.meeting_url
       FROM live_notification ln
       JOIN live_session ls ON ls.id = ln.live_id
       WHERE ln.notified = false
         AND ls.status = 'upcoming'
         AND ls.scheduled_at BETWEEN NOW() AND NOW() + ($1 || ' hours')::INTERVAL`,
      hoursAhead
    );
    return result;
  } catch {
    return [];
  }
}

export async function markNotificationSent(notifId: number): Promise<void> {
  try {
    await prisma.liveNotification.update({
      where: { id: notifId },
      data: { notified: true }
    });
  } catch {}
}

// ─── QCM Interactif ───────────────────────────────────────────────────────────

export async function getQuizByPostId(postId: number): Promise<Quiz | null> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { post_id: postId }
    });
    if (!quiz || !quiz.is_active) return null;

    const questions = await prisma.quizQuestion.findMany({
      where: { quiz_id: quiz.id },
      orderBy: { position: 'asc' }
    });

    return {
      ...quiz,
      questions: questions.map(q => ({
        ...q,
        choices: Array.isArray(q.choices) ? q.choices : JSON.parse(q.choices as any)
      }))
    } as Quiz;
  } catch {
    return null;
  }
}

export async function getQuizAttempt(quizId: number, userId: number): Promise<QuizAttempt | null> {
  try {
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        quiz_id_user_id: {
          quiz_id: quizId,
          user_id: userId
        }
      }
    });
    if (attempt) {
      // the answers field is JSONB, we ensure it's typed
      return {
        ...attempt,
        answers: attempt.answers as any
      } as QuizAttempt;
    }
    return null;
  } catch {
    return null;
  }
}

export async function upsertQuizAttempt(
  quizId: number,
  userId: number,
  answers: { question_id: number; chosen_index: number }[],
  score: number,
  total: number,
  completed: boolean
): Promise<QuizAttempt> {
  try {
    const attempt = await prisma.quizAttempt.upsert({
      where: {
        quiz_id_user_id: {
          quiz_id: quizId,
          user_id: userId
        }
      },
      update: {
        answers: answers as any,
        score,
        total,
        completed,
        completed_at: completed ? new Date() : null
      },
      create: {
        quiz_id: quizId,
        user_id: userId,
        answers: answers as any,
        score,
        total,
        completed,
        completed_at: completed ? new Date() : null
      }
    });
    return attempt as unknown as QuizAttempt;
  } catch (e: any) {
    throw e;
  }
}

// Admin: create or update a quiz for a post
export async function upsertQuiz(
  postId: number,
  title: string,
  description: string,
  timeLimit: number
): Promise<number> {
  const quiz = await prisma.quiz.upsert({
    where: { post_id: postId },
    update: {
      title,
      description,
      time_limit: timeLimit
    },
    create: {
      post_id: postId,
      title,
      description,
      time_limit: timeLimit
    }
  });
  return quiz.id;
}

export async function upsertQuizQuestion(
  quizId: number,
  questionText: string,
  choices: string[],
  correctIndex: number,
  explanation: string,
  position: number,
  id?: number
): Promise<number> {
  if (id) {
    const q = await prisma.quizQuestion.update({
      where: { id },
      data: {
        question_text: questionText,
        choices: choices as any,
        correct_index: correctIndex,
        explanation,
        position
      }
    });
    return q.id;
  }
  const q = await prisma.quizQuestion.create({
    data: {
      quiz_id: quizId,
      question_text: questionText,
      choices: choices as any,
      correct_index: correctIndex,
      explanation,
      position
    }
  });
  return q.id;
}

export async function deleteQuizQuestion(questionId: number): Promise<void> {
  await prisma.quizQuestion.delete({ where: { id: questionId } });
}

// ─── Calendrier des Examens ───────────────────────────────────────────────────

export async function getExamEvents(filters?: {
  niveau?: string;
  type?: string;
  year?: number;
  month?: number;
}): Promise<ExamEvent[]> {
  try {
    const where: any = { is_active: true };

    if (filters?.niveau) {
      where.OR = [
        { niveau: filters.niveau },
        { niveau: 'all' }
      ];
    }
    if (filters?.type) {
      where.type = filters.type;
    }

    let events = await prisma.examEvent.findMany({
      where,
      orderBy: { event_date: 'asc' }
    });

    if (filters?.year) {
      events = events.filter(e => new Date(e.event_date).getFullYear() === filters.year);
    }
    if (filters?.month) {
      events = events.filter(e => (new Date(e.event_date).getMonth() + 1) === filters.month);
    }

    return events as ExamEvent[];
  } catch {
    return [];
  }
}

export async function getUpcomingExamEvents(limit = 5): Promise<ExamEvent[]> {
  try {
    const events = await prisma.examEvent.findMany({
      where: {
        is_active: true,
        event_date: {
          gte: new Date()
        }
      },
      orderBy: { event_date: 'asc' },
      take: limit
    });
    return events as ExamEvent[];
  } catch {
    return [];
  }
}

export async function createExamEvent(data: {
  title: string;
  event_date: string | Date;
  event_time?: string;
  end_date?: string | Date;
  type: string;
  niveau?: string;
  niveau_label?: string;
  description?: string;
  location?: string;
  pdf_url?: string;
  source_url?: string;
}): Promise<ExamEvent> {
  const e = await prisma.examEvent.create({
    data: {
      title: data.title,
      event_date: new Date(data.event_date),
      event_time: data.event_time,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      type: data.type,
      niveau: data.niveau,
      niveau_label: data.niveau_label,
      description: data.description,
      location: data.location,
      pdf_url: data.pdf_url,
      source_url: data.source_url
    }
  });
  return e as ExamEvent;
}

export async function updateExamEvent(id: number, data: Partial<{
  title: string; event_date: string | Date; event_time: string; end_date: string | Date;
  type: string; niveau: string; niveau_label: string; description: string;
  location: string; pdf_url: string; source_url: string; is_active: boolean;
}>): Promise<ExamEvent> {
  const updates: any = { ...data };
  if (data.event_date) updates.event_date = new Date(data.event_date);
  if (data.end_date) updates.end_date = new Date(data.end_date);

  const e = await prisma.examEvent.update({
    where: { id },
    data: updates
  });
  return e as ExamEvent;
}

export async function deleteExamEvent(id: number): Promise<void> {
  await prisma.examEvent.delete({ where: { id } });
}
