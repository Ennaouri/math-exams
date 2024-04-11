import { GA_TRACKING_ID } from '../lib/gtag'

export default function Head() {
  
  return (
    <>
             <title>Mathématiques Du Secondaire</title>
        <meta name="keywords" content='exams, exercices, lowdiscoverymaths, exercice, bac, examens, concours, solution, correction examens' />
          <meta name='description' lang ='fr' content='les solutions de tous les examens de maths du secondaire qualifiants se trouvent désormais sur une seule plateforme avec des videos explicatifs' />
          <meta httpEquiv="Content-Language" content="fr"></meta>
          <meta property="og:title" content="examens de maths" />
          <meta property="twitter:image" content="Twitter link preview image URL"></meta>
          <meta property="twitter:card" content="summary_large_image"></meta>
          <meta property="twitter:title" content="Twitter link preview title"></meta>
          <meta property="twitter:description" content="Twitter link preview description"></meta>
<meta property="og:description" content="Correction des examens de maths" />
<meta property="og:image" content="https://www.facebook.com/photo/?fbid=114326048262713&set=a.114326081596043" />
<meta property="og:url" content="https://www.facebook.com/profile.php?id=100090559545163"></meta>
          <meta name="robots" content="index,follow" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587331919297301"
     crossOrigin="anonymous"></script>
        <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${GA_TRACKING_ID}');
                    `,
                  }}
                />
                
          <link rel='icon' href='/favicon.ico' />
    </>
  );
}
