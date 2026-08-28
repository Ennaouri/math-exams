'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'etudiant' | 'parent'>('etudiant');
  const [niveau, setNiveau] = useState('2bac-sm');
  const [phone, setPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError('Email ou mot de passe incorrect.');
        } else {
          if (rememberMe) {
            localStorage.setItem('savedEmail', email);
          } else {
            localStorage.removeItem('savedEmail');
          }
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            role,
            niveau: role === 'etudiant' ? niveau : undefined,
            phone,
            studentEmail: role === 'parent' ? studentEmail : undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Erreur lors de l'inscription.");
        } else {
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });

          if (result?.error) {
            setError('Compte créé mais erreur de connexion. Veuillez vous connecter.');
          } else {
            router.push('/dashboard');
            router.refresh();
          }
        }
      }
    } catch {
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black text-slate-900">
              Maths<span className="text-blue-600">-Exams</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'Connexion à votre espace' : 'Créer votre compte'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin
              ? 'Accédez à vos cours, lives et supports pédagogiques'
              : 'Rejoignez la plateforme leader des mathématiques au Maroc'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Créer un compte
          </button>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all mb-5 flex items-center justify-center gap-3 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 21.02 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">ou par email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Role selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('etudiant')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'etudiant'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">🎓</span>
                    <div>
                      <div className="text-sm leading-tight">Étudiant</div>
                      <div className="text-[11px] opacity-75 font-normal">Élève ou bachelier</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'parent'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">👨‍👩‍👧‍👦</span>
                    <div>
                      <div className="text-sm leading-tight">Parent</div>
                      <div className="text-[11px] opacity-75 font-normal">Suivi & abonnement</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mohamed Alami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required={!isLogin}
                />
              </div>

              {role === 'etudiant' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Niveau scolaire
                  </label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  >
                    <option value="tronc-commun">Tronc Commun Scientifique</option>
                    <option value="1bac-sm">1ère Année BAC Sciences Maths</option>
                    <option value="1bac-exp">1ère Année BAC Sciences Expérimentales</option>
                    <option value="2bac-sm">2ème Année BAC Sciences Maths (A/B)</option>
                    <option value="2bac-pc">2ème Année BAC PC</option>
                    <option value="2bac-svt">2ème Année BAC SVT</option>
                    <option value="concours">Préparation Concours Post-BAC</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email de votre enfant (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="email.eleve@gmail.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Vous pourrez aussi rattacher vos enfants plus tard depuis votre tableau de bord.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Téléphone WhatsApp (pour les rappels de Lives)
                </label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Adresse Email
            </label>
            <input
              type="email"
              placeholder="votre.email@domaine.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-xs text-slate-600">Se souvenir de moi</span>
            </label>
            {isLogin && (
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setError(''); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 text-sm mt-2"
          >
            {loading
              ? 'Traitement en cours...'
              : isLogin
              ? 'Se connecter'
              : 'Créer mon compte'}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Réinitialiser le mot de passe</h2>
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Un email de réinitialisation a été envoyé à votre adresse.
                </p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
                >
                  Retour
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 mb-4">
                  Entrez votre adresse email pour recevoir un lien sécurisé.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}