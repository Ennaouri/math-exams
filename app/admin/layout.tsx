import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './adminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  const menuGroups = [
    {
      title: "Contenu Pédagogique",
      links: [
        { href: "/admin/categories", label: "Catégories", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
        { href: "/admin/under-categories", label: "Sous-catégories", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
        { href: "/admin/posts", label: "Cours & Exercices", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { href: "/admin/post-details", label: "Détails des pages", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
        { href: "/admin/blobs", label: "Fichiers / PDF", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
      ]
    },
    {
      title: "Utilisateurs & Ventes",
      links: [
        { href: "/admin/users", label: "Utilisateurs Inscrits", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { href: "/admin/orders", label: "Commandes & Paiements", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
      ]
    },
    {
      title: "Statistiques",
      links: [
        { href: "/admin/analytics", label: "Vue d'ensemble", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row -mx-4 lg:-mx-8 -my-12">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1f2937] text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <span className="text-[#FFC107] font-black text-xl uppercase tracking-tighter">SCHOOLARIS</span>
          </Link>
          <div className="text-xs text-slate-400 font-medium">Administration</div>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto mt-4 pb-12">
          
          <Link href="/admin" className="flex items-center gap-3 text-sm font-bold text-white bg-slate-800/50 hover:bg-slate-800 px-3 py-2.5 rounded-xl transition-colors border border-slate-700/50">
            <svg className="w-5 h-5 text-[#0084c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Tableau de bord
          </Link>

          {menuGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-3">{group.title}</h3>
              <div className="space-y-1">
                {group.links.map((link, j) => (
                  <Link key={j} href={link.href} className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} /></svg>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto bg-slate-800/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
              {(session.user?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{session.user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}