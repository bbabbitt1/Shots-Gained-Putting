import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";

import { getUserByEmail, getUserByUsername, createUser } from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/register", async (req, res) => {
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const handicapRaw = req.body.handicap;
  const password = String(req.body.password || "");

  const handicap = Number(handicapRaw);

  if (!firstName || !lastName || !username || !email || !phone || !password) {
    return res.status(400).json({ success: false });
  }
  if (!Number.isFinite(handicap)) {
    return res.status(400).json({ success: false });
  }

  try {
    const [emailExists, usernameExists] = await Promise.all([
      getUserByEmail(email),
      getUserByUsername(username),
    ]);

    if (emailExists || usernameExists) {
      return res.status(409).json({ success: false });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const userId = await createUser({
      firstName,
      lastName,
      username,
      email,
      phone,
      handicap,
      password_hash,
    });

    return res.status(201).json({ success: true, user_id: userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

app.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ success: false });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ success: false });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
