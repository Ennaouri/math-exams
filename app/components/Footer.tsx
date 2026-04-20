import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
      <a
        href="https://wa.me/212634842943"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors"
        style={{ boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.5)' }}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.673.15-.197.297-.767.964-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.671-1.641-.918-2.239-.247-.594-.493-.545-.671-.545h-.421c-.743 0-1.433.099-2.052.396-.595.297-1.011 1.582-1.011 2.184v1.198c0 .602.297 2.032.945 2.974.649.942 1.503 1.967 2.178 2.631.298.297.671.595.961.748.273.149.593.124.818-.05.224-.173.94-.916 1.29-1.248.348-.333.603-.496.82-.666.218-.173.248-.298.248-.496 0-.148-.124-.297-.298-.447l-.545-.793c-.272-.397-.148-.595-.074-.82.074-.222.447-.965.61-1.307.148-.298.272-.372.37-.521.099-.149.223-.298.372-.447l.446-.521c.15-.149.173-.222.272-.37.099-.149.05-.273-.025-.372-.099-.099-.273-.173-.42-.298l-.818-.645c.371-.596 1.057-1.74 1.278-2.224.173-.372.052-.595.026-.62v-.093c-.026-.074-.099-.173-.372-.496l.594-1.382c.173-.297.173-.595.099-.818-.074-.222-.52-.768-.818-1.307l-.892-.892c-.173-.149-.372-.297-.52-.372-.148-.074-.298-.099-.446-.025-.173.074-.595.272-.818.52-.223.223-.42.446-.52.52-.099.074-.173.124-.248.173-.074.05-.15.025-.248-.025-.173-.074-.594-.372-1.29-1.044-.695-.672-1.165-1.487-1.29-1.74-.124-.248-.025-.372.074-.495.099-.124.273-.347.42-.52l.52-.595c.149-.173.223-.298.298-.447l.173-.322c.074-.124.074-.173.074-.248v-.198c0-.173-.025-.223-.074-.322z"/>
        </svg>
      </a>
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">LowdiscoveryMaths.</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="/" className="hover:underline">Home</Link>
                  </li>
                  <li>
                    <Link href="/about" className="mb-4 hover:underline">About Us</Link>
                  </li>
                  <li>
                    <Link href="/category/examens" className="mb-4 hover:underline">Examens 2eme Bac</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="https://www.youtube.com/@LowDiscovery" className="hover:underline">Youtube</Link>
                  </li>
                  <li>
                    <Link href="https://www.facebook.com/profile.php?id=100090559545163&locale=fr_FR" className="hover:underline">Facebook</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="/privacypolicy" className="hover:underline">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link href="/" className="hover:underline">LowDiscovery™</Link>. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}