import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

app.post("/voice", async (req, res) => {
  try {
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const elevenURL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    // Build ElevenLabs payload
    const payload = {
      text: req.body.text,
      model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
      language_code: "nl",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        speed: 0.8,
        use_speaker_boost: false,
      },
      // 🔹 ensure output format is mp3
      output_format: "mp3_44100_128",
    };

    // 🔹 request ElevenLabs API correctly
    const resp = await fetch(elevenURL, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        // Tell ElevenLabs we expect binary audio data
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("ElevenLabs error:", errorText);
      return res.status(502).send(errorText);
    }

    // 🔹 Stream back as binary audio
    const audioBuffer = Buffer.from(await resp.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=voice.mp3");
    res.send(audioBuffer);

  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).send("Proxy failure: " + e.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});