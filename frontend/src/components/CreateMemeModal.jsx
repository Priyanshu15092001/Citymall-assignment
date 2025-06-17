import React from "react";
import MemeForm from "./Memeform";
import cross from '../assets/cross.png'
export default function CreateMemeModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay Blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-cyan-400/10"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 bg-black border border-pink-500 p-6 rounded-xl w-[90%] max-w-xl shadow-2xl text-white neon-glow">
        <div>
        <h2 className="text-xl font-bold mb-4 text-center">🚀 Create Meme</h2>
        <img src={cross} alt="Cross" className="w-[20px] h-[20px] absolute top-[5%] right-[5%]" onClick={onClose} />
        </div>
        <MemeForm onClose={onClose} />
      </div>
    </div>
  );
}
