'use client';

import React from 'react';
import { UserSubscription, LiveSession, Formation, UserProgressStats } from '@/lib/types';
import Link from 'next/link';
import ProgressSection from './ProgressSection';
import AITutor from './AITutor';

interface StudentDashboardProps {
  user: any;
  subscription: UserSubscription | null;
  upcomingLives: LiveSession[];
  formations: Formation[];
  progressStats: UserProgressStats;
}

export default function StudentDashboard({
  user,
  subscription,
  upcomingLives,
  formations,
  progressStats,
}: StudentDashboardProps) {
  const isSubscribed = subscription && subscription.status === 'active';

  return (
    <div className="space-y-8">
      {/* Subscription status card */}
      {/* 
      <div className={`rounded-3xl p-6 sm:p-8 border ${
        isSubscribed
          ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-blue-800 shadow-xl'
          : 'bg-white text-slate-800 border-amber-200 shadow-sm ring-2 ring-amber-400/20'
      }`}>
        ...
      </div>
      */}

      {/* Progress Section */}
      <ProgressSection stats={progressStats} />

      {/* AI Tutor Section */}
      <AITutor progressStats={progressStats} niveau={user?.niveau} />

      {/* Grid: Upcoming Lives & Quick Formations */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        ...
      </div>
      */}
    </div>
  );
}
