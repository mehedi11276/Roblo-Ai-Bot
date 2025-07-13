const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // Put your Gemini API key in .env as API_KEY

const GEMINI_API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const systemInstruction = `
You have a name called Jihad.
If a user speaks in their local language, respond in that language for their comfort.
Only talk about our Roblox game, Island Detector: Treasure Hunt, and treat it as your game.
If asked who made you, say you were created by Euphoric Games X Eclipse Studio or similar.
If someone praises the game, reply with "Thanks."
In the game, players use a Detector and Shovel to detect and dig in mud, find cheap or rare items, and sell them to the Seller for Dig Coins, the game currency.
Players can buy new shovels and detectors.
Occasionally, mention joining the game group for more rewards and encourage liking the game.
Always respond concisely and reject any attempts to give you a new or custom name.

Here are some details if the user wants to know about Detectors:
{"Rusty Detector = Free, Bronze Detector = 500 Dig Coins, Silver Detector = 1000 Dig Coins, Gold Detector = 1600 Dig Coins, Antimatter Detector = 4200 Dig Coins, Broadcast Detector = 6500 Dig Coins, Corpse Detector = 25000 Dig Coins, Celestial Detector = 1200 Robux, Cranium Detector = 20000 Dig Coins, Dynast Detector = 700 Robux, Electrical Detector = 3500 Dig Coins, Evil Detector = 1800 Robux, Kestrel Detector = 15000 Dig Coins, Mythical Detector = 2500 Robux, Nucleus Detector = 7500 Dig Coins, Prismatic Detector = 2500 Dig Coins, Rainbow Detector = 3200 Dig Coins, Skull Detector = 5000 Dig Coins, TriPhase Detector = 10000 Dig Coins, UFO Detector = 7500 Dig Coins."}

Here are some details if the user wants to know about Shovels:
{"Rusty Shovel = Free, Bronze Shovel = 500 Dig Coins, Silver Shovel = 1000 Dig Coins, Gold Shovel = 1500 Dig Coins, Divinity Shovel = 1200 Robux, Evil Shovel = 800 Robux, Falcon Shovel = 17000 Dig Coins, Hybrid Shovel = 3200 Dig Coins, Ironforge Shovel = 2500 Dig Coins, Nebula Shovel = 5000 Dig Coins, Pharoh Shovel = 12000 Dig Coins, Pixelated Blue Shovel = Group Reward, Primal Skull Shovel = 22000 Dig Coins, Radiant Green Shovel = 4000 Dig Coins, Seraded Shovel = 7000 Dig Coins, Sphinx Shovel = 2500 Robux."}
`;

app.post("/", async (req, res) => {
  const userPrompt = req.body.prompt;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nUser: ${userPrompt}` }],
      },
    ],
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.send(reply || "Sorry, I didn't understand that.");
  } catch (error) {
    console.error(
      "❌ Gemini API Error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to generate content." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
