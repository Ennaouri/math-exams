import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getUserSubscription,
  getUpcomingLiveSessions,
  getFormations,
  getParentStudents,
  getSubscriptionPlans,
  getUserProgressStats,
} from '@/lib/db';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mon Tableau de Bord | Maths-Exams',
  description: 'Espace personnel de suivi des cours, lives et abonnements de mathématiques.',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as any;
  const userId = Number(user.id);
  const role = user.role || 'etudiant';

  const [subscription, upcomingLives, formations, plans, parentStudentsInitial, progressStats] = await Promise.all([
    getUserSubscription(userId),
    getUpcomingLiveSessions(4),
    getFormations(),
    getSubscriptionPlans(),
    role === 'parent' ? getParentStudents(userId) : Promise.resolve([]),
    role !== 'parent' ? getUserProgressStats(userId) : Promise.resolve({ total_viewed: 0, recent: [], by_category: [], streak_days: 0 }),
  ]);

  // If parent, fetch progress for all linked students
  let parentStudents = parentStudentsInitial;
  if (role === 'parent' && parentStudents.length > 0) {
    parentStudents = await Promise.all(
      parentStudents.map(async (st: any) => {
        const stats = await getUserProgressStats(st.student_id);
        return { ...st, progressStats: stats };
      })
    );
  }

  return (
    <div className="py-8">
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              {role === 'parent' ? '👨‍👩‍👧‍👦 Espace Parent' : role === 'admin' ? '🛡️ Espace Administrateur' : '🎓 Espace Étudiant'}
            </span>
            {user.niveau && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {user.niveau}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Bonjour, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {role === 'parent'
              ? "Supervisez les abonnements et les cours en direct suivis par vos enfants."
              : "Retrouvez vos prochaines séances en direct et téléchargez vos supports de cours."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {role === 'admin' && (
            <Link
              href="/admin"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Panneau Admin
            </Link>
          )}
          {role === 'etudiant' && (
            <Link
              href="/formations"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Toutes les Formations
            </Link>
          )}
          {/*
          <Link
            href="/tarifs"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm shadow-blue-600/20"
          >
            {subscription ? 'Changer de Pack' : 'Prendre un Abonnement'}
          </Link>
          */}
        </div>
      </div>

      {/* Role specific Dashboard content */}
      {role === 'parent' ? (
        <ParentDashboard
          parentUser={user}
          students={parentStudents}
          plans={plans}
          upcomingLives={upcomingLives}
        />
      ) : (
        <StudentDashboard
          user={user}
          subscription={subscription}
          upcomingLives={upcomingLives}
          formations={formations}
          progressStats={progressStats}
        />
      )}
    </div>
  );
}
