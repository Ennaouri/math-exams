import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'


export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <title>Solutions des examens du secondaire en mathématiques | Maths Exams</title>
        <meta name="keywords" content='exams, bac, examens, concours, solution, correction examens' />
          <meta name='description' content='les solutions de tous les examens de maths du secondaire qualifiants se trouvent désormé sur une seule plateforme avec des videos explicatifs et un contenu ecrit' />
          <meta name="robots" content="index,follow" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587331919297301"
     crossOrigin="anonymous"></script>
     <script type='text/javascript' src='http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>
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