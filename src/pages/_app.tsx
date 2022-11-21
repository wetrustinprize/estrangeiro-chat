import "../styles/globals.scss";
import type { AppProps } from "next/app";

import styles from "../styles/Monitor.module.scss";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <main className={styles.monitor}>
        <section className={styles.monitor} />
        <section className={styles.scan} />
        <section className={styles.main}>
          <Component {...pageProps} />
        </section>
      </main>
    </>
  );
}
