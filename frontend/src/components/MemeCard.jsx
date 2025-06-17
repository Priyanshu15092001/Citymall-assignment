import { useState } from "react";
import { generateCaption, updateBid, voteMeme } from "../services";

export default function MemeCard({ meme, refresh, latestBid }) {
  const [bid, setBid] = useState("");
  const [loading, setLoading] = useState(false);

  const placeBid = async () => {
    if (!bid) return;

    const numericBid = parseInt(bid);

    if (isNaN(numericBid) || numericBid < 1000) {
      alert("🚫 Minimum bid is 1000 credits.");
      return;
    }

    if (thisMemeBid && numericBid <= thisMemeBid.credits) {
      alert(`🚫 New bid must be higher than current (${thisMemeBid.credits}).`);
      return;
    }

    updateBid(meme.id, bid)
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setBid("");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const generateAI = async () => {
    if (loading) return; // Prevent spamming
    setLoading(true);
    generateCaption(meme.id)
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          refresh();
        } else {
          alert("Error generating AI captions");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Error generating AI captions");
      });
  };

  const thisMemeBid = latestBid?.meme_id === meme.id ? latestBid : null;

  const vote = (type) => {
    voteMeme(meme.id, type)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          refresh();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-black text-white p-2 rounded-xl border border-pink-600 w-80 shadow-lg hover:scale-[1.01] transition-transform duration-300">
      <div>
        <img
          src={meme.image_url}
          alt={meme.title}
          className="rounded-md w-full h-48 object-fill mb-3 border border-purple-500"
        />
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-pink-400">{meme.title}</h3>

        <p className="text-sm text-purple-300 italic mt-1">
          Tags: {meme.tags.join(", ")}
        </p>

        <div className="flex items-center justify-center gap-8 mt-2">
          <p className="text-green-400 ">🔼 Upvotes: {meme.upvotes}</p>

          <div className="flex gap-2 ">
            <button
              onClick={() => vote("up")}
              className="bg-green-600 hover:bg-green-700 px-2  rounded text-sm"
            >
              ▲
            </button>
            <button
              onClick={() => vote("down")}
              className="bg-red-600 hover:bg-red-700 px-2 rounded text-sm"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <hr className="my-3 border-pink-500" />

      <div className="text-yellow-400">
        💰 Highest Bid:{" "}
        {thisMemeBid
          ? `${thisMemeBid.credits} (by ${thisMemeBid.user_id})`
          : "—"}
      </div>

      <div className="flex mt-2 gap-2">
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          className="text-white px-2 py-1 w-full rounded"
          placeholder="Enter credits"
        />
        <button
          onClick={placeBid}
          className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
        >
          Bid
        </button>
      </div>

      <button
        onClick={generateAI}
        disabled={loading}
        className={`mt-3 px-4 py-1 w-full rounded text-sm transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-purple-700 hover:bg-purple-800"
        }`}
      >
        {loading ? "⚙️ Generating..." : "✨ Generate AI Caption & Vibe"}
      </button>

      {meme.caption && (
        <p className="mt-3 text-blue-300">
          🧠 <strong>Caption:</strong> {meme.caption}
        </p>
      )}
      {meme.vibe && (
        <p className="text-pink-300 text-sm italic mt-1">
          🌈 <strong>Vibe:</strong> {meme.vibe}
        </p>
      )}
    </div>
  );
}
