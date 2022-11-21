import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SocketIOClient from "socket.io-client";
import { Socket } from "socket.io-client";

import styles from "../styles/Room.module.scss";
import { Message } from "../types/message";

const RoomPage: NextPage = () => {
  const router = useRouter();

  const { room, stranger } = router.query;
  const isStranger = !!stranger;

  const [socket, setSocket] = useState<Socket | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);

  const [clientMessage, setClientMessage] = useState<string>("");
  const [strangerMessage, setStrangerMessage] = useState<string>("");

  useEffect((): any => {
    if (!room || !router) return;

    const io = SocketIOClient("http://localhost:3000", {
      path: "/api/socketio",
      extraHeaders: {
        room: room as string,
      },
    });

    io.on("connect", () => {
      setSocket(io);
    });

    io.on("message", (message: Message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });

    io.on("clientMessage", (message: string) => {
      setClientMessage(message);
    });

    if (io) return () => io.disconnect();
  }, [room, router]);

  const sendMessage = async () => {
    if (isStranger ? !strangerMessage : !clientMessage) return;

    socket?.emit("sendMessage", {
      message: isStranger ? strangerMessage : clientMessage,
      room: room as string,
      stranger: isStranger,
    } as Message);

    setUserMessage("");
  };

  const setUserMessage = (newMessage: string) => {
    if (isStranger) {
      setStrangerMessage("");
    } else {
      socket?.emit("clientMessage", newMessage);
      setClientMessage(newMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Sala</title>
      </Head>
      {!socket ? (
        <div className={styles.connecting}>
          <p>Conectando...</p>
        </div>
      ) : (
        <section className={styles.program}>
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.stranger ? styles.stranger : styles.client}
              >
                <p className="text-glow">{!message.stranger && ">"}</p>
                <p className="text-glow">{message.message}</p>
              </div>
            ))}
          </div>
          <div className={styles.clientInput}>
            <p className="text-glow">{">"}</p>
            <input
              type="text"
              value={clientMessage}
              disabled={isStranger}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              onSubmit={sendMessage}
              className="text-glow"
            />
          </div>
          {isStranger && (
            <div className={styles.strangerInput}>
              <hr className="glow" />
              <input
                className="glow"
                type="text"
                value={strangerMessage}
                onChange={(e) => setStrangerMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default RoomPage;
