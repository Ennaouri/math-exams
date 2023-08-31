import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'


export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <title>Solutions des examens du secondaire en maths</title>
        <meta name="keywords" content='exams, exercices, lowdiscoverymaths, exercice, bac, examens, concours, solution, correction examens' />
          <meta name='description' lang ='fr' content='les solutions de tous les examens de maths du secondaire qualifiants se trouvent désormais sur une seule plateforme avec des videos explicatifs' />
          <meta http-equiv="Content-Language" content="fr"></meta>
          <meta property="og:title" content="examens de maths" />
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
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}