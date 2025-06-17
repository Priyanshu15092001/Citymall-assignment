import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services";
import { formatNumber } from "../utils/formatNumber";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);

  const getLeaderboard = () => {
    fetchLeaderboard()
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setTopMemes(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getLeaderboard();
    const interval = setInterval(() => getLeaderboard(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white p-4 mt-10  w-sm mx-auto rounded-xl border border-blue-400 shadow-lg flex flex-col">
      <div className="bg-black">
        <h2 className="text-2xl mb-4 text-blue-300 font-bold">
          🚀 Trending Memes
        </h2>
      </div>
      <div className="overflow-y-auto">
        <ol className="space-y-2">
          {topMemes.map((meme, idx) => (
            <li
              key={meme.id}
              className="flex flex-col bg-gray-900 p-3 rounded-lg shadow"
            >
              <span className="font-semibold text-lg">
                {idx + 1}. {meme.title}
              </span>
              <div className="text-sm mt-1 text-pink-300 flex justify-between">
                <span>🔼 {formatNumber(meme.upvotes)} votes</span>
                <span>
                  💰 {formatNumber(meme.topBid.credits)} (by {meme.topBid.user_id})
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
