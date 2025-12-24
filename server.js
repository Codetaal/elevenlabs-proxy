app.post("/voice", async (req, res) => {
    try {
        const voiceId = process.env.ELEVENLABS_VOICE_ID;
        const elevenURL = "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId;

        const response = await axios({
            method: "POST",
            url: elevenURL,
            headers: {
                "xi-api-key": process.env.ELEVENLABS_KEY,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0", // masks origin
                "Origin": "https://render.com",
                "Referer": "https://render.com",
            },
            data: req.body, // <— forwards your GAS payload exactly
            responseType: "arraybuffer",
        });

        res.set("Content-Type", "audio/mpeg");
        res.send(Buffer.from(response.data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});
