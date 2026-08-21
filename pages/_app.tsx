import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '../lib/LanguageContext'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <LanguageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default MyApp