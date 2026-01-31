import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import { getUserByEmail } from "./db.js";


const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ success: false });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ success: false });

  res.json({ success: true });
});

app.use(express.static("public"));

app.listen(3000, () => console.log("Server running"));
