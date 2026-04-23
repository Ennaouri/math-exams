'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'etudiant' | 'enseignant'>('etudiant');
  const [niveau, setNiveau] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

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
          if (result.error === 'Email not verified') {
            setShowVerifyNotice(true);
          } else {
            setError('Invalid email or password');
          }
        } else {
          // Clear old image and set fresh from auth
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userImage');
          }
          if (rememberMe) {
            localStorage.setItem('savedEmail', email);
          } else {
            localStorage.removeItem('savedEmail');
          }
          router.push('/profile');
          router.refresh();
        }
    } else {
      // Validate password
      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        setLoading(false);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Le mot de passe doit contenir au moins une majuscule');
        setLoading(false);
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError('Le mot de passe doit contenir au moins une minuscule');
        setLoading(false);
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('Le mot de passe doit contenir au moins un chiffre');
        setLoading(false);
        return;
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('Le mot de passe doit contenir au moins un caractère spécial');
        setLoading(false);
        return;
      }
      
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, niveau }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/profile');
          router.refresh();
        }
      }
    }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Create Account'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 21.02 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-600">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={!isLogin}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Je suis
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'etudiant' | 'enseignant')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="enseignant">Enseignant</option>
                </select>
              </div>

              {role === 'etudiant' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Niveau où vous étudiez
                  </label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={role === 'etudiant'}
                  >
                    <option value="">Sélectionner votre niveau</option>
                    <option value="tronc-commun">Tronc Commun</option>
                    <option value="1re-annee-bac">1re année bac</option>
                    <option value="2eme-annee-bac">2eme année bac</option>
                  </select>
                </div>
              )}
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (!isLogin && e.target.value) setShowPasswordHelp(true); }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {showPasswordHelp && !isLogin && (
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-semibold mb-1">Le mot de passe doit contenir :</p>
                <ul className="space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : 'text-red-500'}>
                    {password.length >= 8 ? '✓' : '✗'} Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                    {/[A-Z]/.test(password) ? '✓' : '✗'} Une majuscule
                  </li>
                  <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                    {/[a-z]/.test(password) ? '✓' : '✗'} Une minuscule
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                    {/[0-9]/.test(password) ? '✓' : '✗'} Un chiffre
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-red-500'}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '✗'} Un caractère spécial
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            {isLogin && (
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setError(''); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-4 text-center">
          {isLogin ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => { setIsLogin(false); setError(''); setShowPasswordHelp(false); }} className="text-blue-500 hover:text-blue-700 font-semibold">
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => { setIsLogin(true); setError(''); setShowPasswordHelp(false); }} className="text-blue-500 hover:text-blue-700 font-semibold">
                Login
              </button>
            </p>
          )}
        </div>
      </div>

      {showVerifyNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Vérifiez votre email</h2>
            <p className="text-gray-600 mb-4">
              Un email de vérification a été envoyé à <strong>{email}</strong>. Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              N'oubliez pas de vérifier vos spams.
            </p>
            <button
              onClick={() => { setShowVerifyNotice(false); setIsLogin(true); setEmail(''); setPassword(''); setName(''); }}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      )}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Réinitialiser mot de passe</h2>
            {resetSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  Un email de réinitialisation a été envoyé à votre adresse.
                </p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                  className="text-blue-600 font-semibold"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full border rounded py-2 px-3 mb-4"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                    className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        setError('Email requis');
                        return;
                      }
                      setLoading(true);
                      try {
                        const res = await fetch('/api/forgot-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email }),
                        });
                        if (res.ok) {
                          setResetSent(true);
                        } else {
                          setError('Email non trouvé');
                        }
                      } catch {
                        setError('Erreur');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Envoyer'}
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