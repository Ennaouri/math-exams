'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ChangePasswordMode = 'idle' | 'change' | 'verifying';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  metadata?: string;
  image?: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [passwordMode, setPasswordMode] = useState<ChangePasswordMode>('idle');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: data.url }),
        });
        
        await update({ image: data.url });
        fetchUserData();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getUserMeta = () => {
    if (!userData?.metadata) return null;
    try {
      return JSON.parse(userData.metadata);
    } catch {
      return null;
    }
  };

  const userMeta = getUserMeta();

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const displayImage = (session?.user as any)?.image || userData?.image;
  const displayName = session?.user?.name || userData?.name || 'User';
  const displayEmail = session?.user?.email || userData?.email;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="w-24 h-24 bg-white rounded-full p-1">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={displayName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
            <p className="text-gray-600">{displayEmail}</p>

            {userMeta && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-blue-600 font-medium">
                      {userMeta.role === 'etudiant' ? 'Étudiant' : 'Enseignant'}
                    </span>
                  </div>
                  {userMeta.niveau && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Niveau:</span>
                      <span className="text-blue-600 font-medium">{userMeta.niveau}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
              
              {passwordMode === 'idle' && (
                <button
                  onClick={() => setPasswordMode('change')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors"
                >
                  Changer mon mot de passe
                </button>
              )}

              {passwordMode === 'change' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded py-2 px-3"
                    />
                  </div>
                  
                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                  {passwordSuccess && <p className="text-green-500 text-sm">Mot de passe modifié !</p>}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setPasswordMode('idle'); setPasswordError(''); setPasswordSuccess(false); }}
                      className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={async () => {
                        if (newPassword !== confirmPassword) {
                          setPasswordError('Les mots de passe ne correspondent pas');
                          return;
                        }
                        if (newPassword.length < 6) {
                          setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
                          return;
                        }
                        try {
                          const res = await fetch('/api/change-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ currentPassword, newPassword }),
                          });
                          if (res.ok) {
                            setPasswordSuccess(true);
                            setPasswordMode('idle');
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          } else {
                            const data = await res.json();
                            setPasswordError(data.error || 'Erreur');
                          }
                        } catch {
                          setPasswordError('Erreur');
                        }
                      }}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}