const eventsDiv = document.getElementById("events");
const savedDiv = document.getElementById("saved-events");
const keywordInput = document.getElementById("keyword");
const searchBtn = document.getElementById("searchBtn");

const sampleEvents = [
  { title: "Open Mic Night", date: "Fri 7:00 PM", venue: "Student Union", url: "https://example.com/openmic" },
  { title: "Free Yoga Session", date: "Sat 10:00 AM", venue: "Rec Center", url: "https://example.com/yoga" },
  { title: "Tech Club Meetup", date: "Wed 6:00 PM", venue: "Engineering Building", url: "https://example.com/tech" },
  { title: "Movie Night", date: "Sun 8:00 PM", venue: "Dorm Lounge", url: "https://example.com/movie" }
];

let savedCache = [];

async function fetchSaved() {
  const response = await fetch("/api/saved-events");
  const result = await response.json();
  savedCache = result.data || [];
  return savedCache;
}

function getSavedUrlSet() {
  return new Set(savedCache.map((e) => e.url));
}

function formatDate(value) {
  if (!value) return "TBD";
  if (typeof dayjs === "function") {
    const d = dayjs(value);
    if (d.isValid()) return d.format("MMM D, h:mm A");
  }
  return value;
}

function showEvents(list) {
  const savedUrls = getSavedUrlSet();
  const filteredList = (list || []).filter((evt) => !savedUrls.has(evt.url));

  eventsDiv.innerHTML = "";

  if (filteredList.length === 0) {
    eventsDiv.innerHTML = `<p class="small-text">No events to show. (You may have saved them all.)</p>`;
    return;
  }

  filteredList.forEach((evt) => {
    const box = document.createElement("div");
    box.className = "event";

    box.innerHTML = `
      <h3>${evt.title}</h3>
      <p><strong>Date:</strong> ${formatDate(evt.date)}</p>
      <p><strong>Location:</strong> ${evt.venue || "TBD"}</p>
      <a href="${evt.url}" target="_blank" rel="noreferrer">View Event</a>
      <br/><br/>
    `;

    const btn = document.createElement("button");
    btn.className = "button";
    btn.textContent = "Save";
    btn.onclick = () => saveEvent(evt);

    box.appendChild(btn);
    eventsDiv.appendChild(box);
  });
}

function renderSaved() {
  savedDiv.innerHTML = "";

  if (!savedCache || savedCache.length === 0) {
    savedDiv.innerHTML = `<p class="small-text">No saved events yet.</p>`;
    return;
  }

  savedCache.forEach((evt) => {
    const box = document.createElement("div");
    box.className = "event";

    box.innerHTML = `
      <h3>${evt.title}</h3>
      <p><strong>Date:</strong> ${formatDate(evt.date)}</p>
      <p><strong>Location:</strong> ${evt.venue || "TBD"}</p>
      <a href="${evt.url}" target="_blank" rel="noreferrer">View Event</a>
      <br/><br/>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.className = "button";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeSaved(evt.gen_random);

    box.appendChild(removeBtn);

    savedDiv.appendChild(box);
  });
}

async function showSaved() {
  await fetchSaved();
  renderSaved();
  showEvents(sampleEvents);
}

async function saveEvent(evt) {
  const response = await fetch("/api/saved-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evt),
  });

  const result = await response.json();

  if (!response.ok) {
    Swal.fire("Error", result.error || "Save failed", "error");
    return;
  }

  Swal.fire("Saved!", "Event added to Saved Events.", "success");
  await showSaved();
}

async function removeSaved(id) {
  const response = await fetch(`/api/saved-events/${id}`, { method: "DELETE" });
  const result = await response.json();

  if (!response.ok) {
    Swal.fire("Error", result.error || "Delete failed", "error");
    return;
  }

  Swal.fire("Removed!", "Event removed from Saved Events.", "success");
  await showSaved();
}

function searchEvents() {
  const keyword = (keywordInput.value || "").toLowerCase().trim();
  const filtered = sampleEvents.filter((evt) =>
    (evt.title || "").toLowerCase().includes(keyword)
  );
  showEvents(filtered);
}

if (searchBtn) searchBtn.onclick = searchEvents;
showSaved();
