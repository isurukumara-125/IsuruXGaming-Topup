require("dotenv").config();
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const SHELL_BASE_URL = process.env.SHELL_BASE_URL || "https://shelltopup.com/api/v1";

function shellHeaders() {
  if (!process.env.SHELL_API_KEY) throw new Error("SHELL_API_KEY is not configured");
  return {
    "Authorization": `Bearer ${process.env.SHELL_API_KEY}`,
    "Content-Type": "application/json"
  };
}

// Get Shell wallet balance
app.get("/api/shell/balance", async (_req, res) => {
  try {
    const r = await fetch(`${SHELL_BASE_URL}/balance`, { headers: shellHeaders() });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

// Get games/products. Frontend can use this to populate Free Fire packages.
app.get("/api/shell/games", async (_req, res) => {
  try {
    const r = await fetch(`${SHELL_BASE_URL}/games`, { headers: shellHeaders() });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

// IMPORTANT: This is NOT a UID verification endpoint.
// It only places a paid top-up order after your payment gateway confirms payment.
app.post("/api/order", async (req, res) => {
  try {
    const { gameId, productId, playerId, region, quantity = 1, paymentId } = req.body;

    if (!gameId || !productId || !playerId || !paymentId) {
      return res.status(400).json({
        ok:false,
        error:"gameId, productId, playerId and verified paymentId are required"
      });
    }

    // Replace this with your real eZ Cash merchant-side payment verification.
    // Never trust a client-provided "paid=true" flag.
    if (!paymentId.startsWith("EZCASH_VERIFIED_")) {
      return res.status(402).json({
        ok:false,
        error:"Payment has not been verified by the eZ Cash gateway"
      });
    }

    const payload = {
      gameId,
      productId,
      playerId: String(playerId),
      region: region || "LK",
      quantity: Number(quantity) || 1,
      clientKey: crypto.randomUUID()
    };

    const r = await fetch(`${SHELL_BASE_URL}/order`, {
      method: "POST",
      headers: shellHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

app.listen(PORT, () => {
  console.log(`ISURUX GAMING TOPUP STORE running on http://localhost:${PORT}`);
});
