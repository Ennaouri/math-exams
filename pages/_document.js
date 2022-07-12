import Document, { Html, Head, Main, NextScript } from 'next/document'


export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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
          <meta name="keywords" content='exams, bac, examens' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}