const express = require('express');
const router = express.Router();
const { createMeme,getAllMemes,voteMeme,getLeaderboard,placeBid,generateCaptionAndVibe } = require('../controllers/memeController');

router.post('/memes', createMeme);
router.get('/memes', getAllMemes);
router.post('/memes/:id/vote', voteMeme);
router.get('/leaderboard', getLeaderboard);
router.post('/memes/:id/bid', placeBid);
router.post('/memes/:id/caption', generateCaptionAndVibe);

module.exports = router;
