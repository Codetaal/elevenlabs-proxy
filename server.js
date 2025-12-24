import express from "express";

const app = express();
app.use(express.json());

app.post("/voice", async (req, res) => {
  try {
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const elevenURL = "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId;

    const resp = await fetch(elevenURL, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; proxy-server)",
        "Origin": "https://your-proxy.local",
        "Referer": "https://your-proxy.local",
      },
      body: JSON.stringify(await req.body),
    });

    if (!resp.ok) {
      return res.status(502).send(await resp.text());
    }

    const audio = await resp.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audio));

  } catch (e) {
    res.status(500).send("Proxy failure: " + e.message);
  }
});

app.listen(process.env.PORT || 3000);
