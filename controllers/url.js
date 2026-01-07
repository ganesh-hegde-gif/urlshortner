const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const url = req.body && req.body.url;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const shortID =
      typeof shortid.generate === "function" ? shortid.generate() : shortid();

    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
    });

    return res.json({
      shortURL: `http://localhost:8001/url/${shortID}`,
    });
  } catch (err) {
    console.error("Error generating short URL:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleRedirect(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) return res.status(404).json({ error: "URL not found" });

    let redirectTo = entry.redirectURL;
    if (!/^https?:\/\//i.test(redirectTo)) redirectTo = "http://" + redirectTo;

    return res.redirect(redirectTo);
  } catch (err) {
    console.error("Error redirecting:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { handleGenerateNewShortURL, handleRedirect };