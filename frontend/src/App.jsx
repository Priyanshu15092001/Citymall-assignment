import { useState } from "react";
import "./App.css";
import MemeCard from "./components/MemeCard";
import { useEffect } from "react";
import { getAllMemes } from "./services";
import Leaderboard from "./components/Leaderboard";
import { useSocket } from "./hooks/useSocket";
import CreateMemeModal from "./components/CreateMemeModal";
function App() {
  const [memes, setMemes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  // const { latestBid } = useSocket();
  const [latestBid, setLatestBid] = useState(null);
  const fetchMemes = () => {
    getAllMemes()
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          setMemes(data);
        }
      })
      .catch();
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  useSocket({
    onNewMeme: (meme) => {
      // console.log("🟢 newMeme received:", meme);
      if (meme && meme.id) {
        setMemes((prev) => [...prev,meme]);
      }
    },
    onMemeUpdated: (updatedMeme) => {
      setMemes((prev) =>
        prev.map((m) => (m.id === updatedMeme.id ? updatedMeme : m))
      );
    },
    onLatestBid: (bid) => {
      setLatestBid(bid);
    },
  });

  return (
    <div className="w-full flex flex-column h-[100vh] bg-gradient-to-r from-purple-900 via-black to-pink-900 text-white p-4">
      <div className="w-full flex justify-around xl:justify-center  fixed top-0 inset-x-0 p-4 bg-gradient-to-r from-purple-900 via-black to-pink-900">
        <h1 className="text-4xl font-bold   neon-glow">MemeHustle Gallery</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="cyberpunk-btn pointer-events-auto xl:relative xl:left-[30%]"
        >
          🚀 Create Meme
        </button>
      </div>

      {/* <MemeForm /> */}
      <div className="flex-1 flex  mt-12 gap-4">
        <div className="meme-container mt-10 flex flex-1 flex-wrap justify-center gap-6 px-2 overflow-y-auto ">
          {memes.map((meme) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              refresh={fetchMemes}
              latestBid={latestBid}
            />
          ))}
        </div>
        <Leaderboard />
      </div>

      <CreateMemeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
