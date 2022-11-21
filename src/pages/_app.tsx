import "../styles/globals.scss";
import type { AppProps } from "next/app";

import styles from "../styles/Monitor.module.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={styles.monitor}>
      <section className={styles.monitor} />
      <section className={styles.scan} />
      <section className={styles.main}>
        <Component {...pageProps} />
      </section>
    </main>
  );
}
