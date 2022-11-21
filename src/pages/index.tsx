import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const router = useRouter();
  const [room, setRoom] = useState<string>("");

  const enterRoom = () => {
    if (!room) return;

    router.push(`/${room}`);
  };

  const createRoom = () => {
    if (!room) return;

    router.push(
      {
        pathname: "/[room]",
        query: {
          room,
          stranger: true,
        },
      },
      `/${room}`
    );
  };

  return (
    <>
      <Head>
        <title>Entre numa sala</title>
      </Head>
      <section className={styles.main}>
        <input
          type="text"
          placeholder="Digite o código da sala"
          onChange={(event) => setRoom(event.target.value)}
          value={room}
          className="glow"
        />
        <button
          type="button"
          disabled={!room}
          onClick={enterRoom}
          className="glow"
        >
          Entrar como usuário
        </button>
        <button
          type="button"
          disabled={!room}
          onClick={createRoom}
          className="glow"
        >
          Entrar como o &quot;estrangeiro&quot;
        </button>
        <p className={styles.credits}>
          Créditos e código fonte{" "}
          <a href="https://github.com/wetrustinprize/estrangeiro-chat">aqui</a>
        </p>
      </section>
    </>
  );
};

export default Home;
