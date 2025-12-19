import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const PORT = process.env.PORT || 3000;

app.use(express.static("."));

app.get("/api/saved-events", async (req, res) => {
  const { data, error } = await supabase
    .from("saved_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ data });
});

app.post("/api/saved-events", async (req, res) => {
  const { title, date, venue, url } = req.body;

  const { data, error } = await supabase
    .from("saved_events")
    .insert([{ title, date, venue, url }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
