import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
      <a
        href="https://wa.me/212634842943"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        style={{ boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.5)' }}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.673.15-.197.297-.767.964-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.671-1.641-.918-2.239-.247-.594-.493-.545-.671-.545h-.421c-.743 0-1.433.099-2.052.396-.595.297-1.011 1.582-1.011 2.184v1.198c0 .602.297 2.032.945 2.974.649.942 1.503 1.967 2.178 2.631.298.297.671.595.961.748.273.149.593.124.818-.05.224-.173.94-.916 1.29-1.248.348-.333.603-.496.82-.666.218-.173.248-.298.248-.496 0-.148-.124-.297-.298-.447l-.545-.793c-.272-.397-.148-.595-.074-.82.074-.222.447-.965.61-1.307.148-.298.272-.372.37-.521.099-.149.223-.298.372-.447l.446-.521c.15-.149.173-.222.272-.37.099-.149.05-.273-.025-.372-.099-.099-.273-.173-.42-.298l-.818-.645c.371-.596 1.057-1.74 1.278-2.224.173-.372.052-.595.026-.62v-.093c-.026-.074-.099-.173-.372-.496l.594-1.382c.173-.297.173-.595.099-.818-.074-.222-.52-.768-.818-1.307l-.892-.892c-.173-.149-.372-.297-.52-.372-.148-.074-.298-.099-.446-.025-.173.074-.595.272-.818.52-.223.223-.42.446-.52.52-.099.074-.173.124-.248.173-.074.05-.15.025-.248-.025-.173-.074-.594-.372-1.29-1.044-.695-.672-1.165-1.487-1.29-1.74-.124-.248-.025-.372.074-.495.099-.124.273-.347.42-.52l.52-.595c.149-.173.223-.298.298-.447l.173-.322c.074-.124.074-.173.074-.248v-.198c0-.173-.025-.223-.074-.322z"/>
        </svg>
      </a>
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-8 lg:py-12">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0 max-w-xs">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-2xl font-bold">LowDiscovery<span className="text-blue-400">Maths</span></span>
              </Link>
              <p className="text-gray-400 text-sm">
                Votre plateforme éducative pour maîtriser les mathématiques. 
                Cours, exercices et examens pour tous les niveaux.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">Ressources</h2>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
                  </li>
                  <li>
                    <Link href="/category/tronc-commun" className="hover:text-white transition-colors">Tronc Commun</Link>
                  </li>
                  <li>
                    <Link href="/category/1re-annee-bac" className="hover:text-white transition-colors">1ère Année Bac</Link>
                  </li>
                  <li>
                    <Link href="/category/2eme-annee-bac" className="hover:text-white transition-colors">2ème Année Bac</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">Suivez-nous</h2>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    <a href="https://www.youtube.com/@LowDiscovery" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/profile.php?id=100090559545163&locale=fr_FR" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/212634842943" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.673.15-.197.297-.767.964-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.671-1.641-.918-2.239-.247-.594-.493-.545-.671-.545h-.421c-.743 0-1.433.099-2.052.396-.595.297-1.011 1.582-1.011 2.184v1.198c0 .602.297 2.032.945 2.974.649.942 1.503 1.967 2.178 2.631.298.297.671.595.961.748.273.149.593.124.818-.05.224-.173.94-.916 1.29-1.248.348-.333.603-.496.82-.666.218-.173.248-.298.248-.496 0-.148-.124-.297-.298-.447l-.545-.793c-.272-.397-.148-.595-.074-.82.074-.222.447-.965.61-1.307.148-.298.272-.372.37-.521.099-.149.223-.298.372-.447l.446-.521c.15-.149.173-.222.272-.37.099-.149.05-.273-.025-.372-.099-.099-.273-.173-.42-.298l-.818-.645c.371-.596 1.057-1.74 1.278-2.224.173-.372.052-.595.026-.62v-.093c-.026-.074-.099-.173-.372-.496l.594-1.382c.173-.297.173-.595.099-.818-.074-.222-.52-.768-.818-1.307l-.892-.892c-.173-.149-.372-.297-.52-.372-.148-.074-.298-.099-.446-.025-.173.074-.595.272-.818.52-.223.223-.42.446-.52.52-.099.074-.173.124-.248.173-.074.05-.15.025-.248-.025-.173-.074-.594-.372-1.29-1.044-.695-.672-1.165-1.487-1.29-1.74-.124-.248-.025-.372.074-.495.099-.124.273-.347.42-.52l.52-.595c.149-.173.223-.298.298-.447l.173-.322c.074-.124.074-.173.074-.248v-.198c0-.173-.025-.223-.074-.322z"/></svg>
                      WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">Légal</h2>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    <Link href="/contactus" className="hover:text-white transition-colors">Contactez-nous</Link>
                  </li>
                  <li>
                    <Link href="/privacypolicy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-700" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-400 sm:text-center">
              © {new Date().getFullYear()} <Link href="/" className="hover:text-white">LowDiscoveryMaths</Link>. Tous droits réservés.
            </span>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <span className="text-sm text-gray-400">
                Créé avec ❤️ pour les étudiants du Maroc
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}