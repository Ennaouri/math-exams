import Document, { Html, Head, Main, NextScript } from 'next/document'


export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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