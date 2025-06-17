const { generateGeminiText } = require('../services/geminiService');
const supabase = require("../services/supabaseClient");

// POST /memes
const createMeme = async (req, res) => {
  const { title, image_url, tags } = req.body;
  const defaultImage = "https://picsum.photos/200";
  const image = image_url || defaultImage;

  const { data, error } = await supabase
    .from("memes")
    .insert([{ title, image_url: image, tags }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  const io = req.app.get("io");
  io.emit("newMeme", data);

  res.status(201).json(data);
};

//GET /memes
const getAllMemes = async (req, res) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("upvotes", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
};

// POST /memes/:id/vote
const voteMeme = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // "up" or "down"

  const increment = type === "up" ? 1 : -1;

  // Run Supabase RPC to update upvotes
  const { error } = await supabase.rpc("increment_upvotes", {
    row_id: id,
    value: increment,
  });

  if (error) return res.status(500).json({ error });

  // Fetch updated meme
  const { data: updatedMeme, error: fetchError } = await supabase
    .from("memes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError });

  // Emit real-time update
  const io = req.app.get("io");
  // console.log("Emitting memeUpdated for:", updatedMeme.id);
  io.emit("memeUpdated", updatedMeme);

  res.json(updatedMeme);
};

// GET /leaderboard?top=10
// const getLeaderboard = async (req, res) => {
//   const top = parseInt(req.query.top) || 10;
//   const { data, error } = await supabase
//     .from("memes")
//     .select("*")
//     .order("upvotes", { ascending: false })
//     .limit(top);

//   if (error) return res.status(500).json({ error });
//   res.json(data);
// };

const getLeaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10;

  // Fetch top memes
  const { data: memes, error } = await supabase
    .from('memes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(top);

  if (error) return res.status(500).json({ error });

  // For each meme, fetch highest bid
  const enrichedMemes = await Promise.all(memes.map(async (meme) => {
    const { data: topBid } = await supabase
      .from('bids')
      .select('credits, user_id')
      .eq('meme_id', meme.id)
      .order('credits', { ascending: false })
      .limit(1)
      .single();

    return {
      ...meme,
      topBid: topBid || { credits: 0, user_id: '—' }
    };
  }));

  res.json(enrichedMemes);
};


// POST /memes/:id/bid
const placeBid = async (req, res) => {
  const { id: meme_id } = req.params;
  const { user_id = "cyberpunk420", credits } = req.body;
  const io = req.app.get("io");

  const { data: newBid, error } = await supabase
    .from('bids')
    .insert([{ meme_id, user_id, credits }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Get highest bid for this meme
  const { data: highest } = await supabase
    .from('bids')
    .select('credits, user_id')
    .eq('meme_id', meme_id)
    .order('credits', { ascending: false })
    .limit(1)
    .single();

  // Broadcast to all users
  io.emit("bidUpdate", { meme_id, ...highest });

  res.status(200).json({ success: true });
};


// POST /memes/:id/caption
const generateCaptionAndVibe = async (req, res) => {
  const { id } = req.params;

  const { data: meme, error: memeError } = await supabase
    .from('memes')
    .select('*')
    .eq('id', id)
    .single();

  if (memeError || !meme) return res.status(404).json({ error: "Meme not found" });

  const tagString = meme.tags.join(', ');

  // Prompts
  const captionPrompt = `Funny	caption	for	meme	with	tags: ${tagString} and return a single line.`;
const vibePrompt = `Give a short, 2–4 word description of the meme's vibe. Only return the vibe. Tags: ${tagString}`;


  const caption = await generateGeminiText(captionPrompt) || "YOLO to the moon!";
  const vibe = await generateGeminiText(vibePrompt) || "Retro Stonks Vibes";

  const { error: updateError } = await supabase
    .from('memes')
    .update({ caption, vibe })
    .eq('id', id);

  if (updateError) return res.status(500).json({ error: updateError });

  res.json({ caption, vibe });
};

module.exports = {
  createMeme,
  getAllMemes,
  voteMeme,
  getLeaderboard,
  placeBid,
  generateCaptionAndVibe
};
