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

app.delete("/api/saved-events/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("saved_events")
    .delete()
    .eq("gen_random", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});


app.get("/api/events", async (req, res) => {
  try {
    const token = process.env.EVENTBRITE_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing EVENTBRITE_TOKEN" });
    }

    const keyword = (req.query.q || "college").trim();

    const url =
      "https://api.eventbrite.com/v3/events/search/?" +
      `q=${encodeURIComponent(keyword)}` +
      "&location.latitude=38.9869" +
      "&location.longitude=-76.9426" +
      "&location.within=50mi" +
      "&expand=venue";

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({
        error: "Eventbrite request failed",
        details: text,
      });
    }

    const data = await r.json();

    const events = (data.events || []).map((e) => ({
      title: e?.name?.text || "Untitled Event",
      date: e?.start?.local || null,
      venue: e?.venue?.name || "TBD",
      url: e?.url || null,
    }));

    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error calling Eventbrite" });
  }
});


app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});