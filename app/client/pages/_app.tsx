import '../styles/globals.css';
import type { AppProps } from 'next/app';

function OpenDocs({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default OpenDocs;
