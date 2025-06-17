import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export function useSocket({ onNewMeme, onMemeUpdated, onLatestBid } = {}) {
  const [latestBid, setLatestBid] = useState(null);

  useEffect(() => {
    socket.on("bidUpdate", (data) => {
      if (onLatestBid) {
        onLatestBid(data); // callback to App
      } else {
        setLatestBid(data); // fallback for simpler usage
      }
    });

    socket.on("newMeme", (meme) => {
      if (onNewMeme) onNewMeme(meme);
    });

    socket.on("memeUpdated", (meme) => {
      if (onMemeUpdated) onMemeUpdated(meme);
    });

    return () => {
      socket.off("bidUpdate");
      socket.off("newMeme");
      socket.off("memeUpdated");
    };
  }, [onNewMeme, onMemeUpdated, onLatestBid]);

  return { socket, latestBid };
}
