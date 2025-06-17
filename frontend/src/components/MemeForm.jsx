import { useState } from "react";
import { addMeme } from "../services";

export default function MemeForm({onClose}) {
  const [form, setForm] = useState({ title: "", image_url: "", tags: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    addMeme(form,tagsArray)
      .then(async(response) => {
        // const data =await response.json();
        if (response.ok) {
          // alert("Meme Created!");
          onClose()
          setForm({ title: "", image_url: "", tags: "" });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-black text-white max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold">Create Meme</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 bg-gray-800"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full p-2 bg-gray-800"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full p-2 bg-gray-800"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
      />
      <button
        type="submit"
        className="bg-pink-500 hover:bg-pink-700 px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
