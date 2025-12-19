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

function showEvents(list) {
  eventsDiv.innerHTML = "";

  if (list.length === 0) {
    eventsDiv.innerHTML = `<p class="small-text">No events found.</p>`;
    return;
  }

  list.forEach((evt) => {
    const box = document.createElement("div");
    box.className = "event";

    box.innerHTML = `
      <h3>${evt.title}</h3>
      <p><strong>Date:</strong> ${evt.date}</p>
      <p><strong>Location:</strong> ${evt.venue}</p>
      <a href="${evt.url}" target="_blank" rel="noreferrer">View Event</a>
      <br/><br/>
    `;

    const btn = document.createElement("button");
    btn.className = "button";
    btn.textContent = "Save";

    btn.onclick = function () {
      saveEvent(evt);
    };

    box.appendChild(btn);
    eventsDiv.appendChild(box);
  });
}

async function showSaved() {
  const response = await fetch("/api/saved-events");
  const result = await response.json();

  savedDiv.innerHTML = "";

  if (!result.data || result.data.length === 0) {
    savedDiv.innerHTML = `<p class="small-text">No saved events yet.</p>`;
    return;
  }

  result.data.forEach((evt) => {
    const box = document.createElement("div");
    box.className = "event";

    box.innerHTML = `
      <h3>${evt.title}</h3>
      <p><strong>Date:</strong> ${evt.date || "TBD"}</p>
      <p><strong>Location:</strong> ${evt.venue || "TBD"}</p>
      <a href="${evt.url}" target="_blank" rel="noreferrer">View Event</a>
    `;

    savedDiv.appendChild(box);
  });
}

async function saveEvent(evt) {
  const response = await fetch("/api/saved-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evt),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.error || "Save failed");
    return;
  }

  alert("Saved!");
  showSaved();
}

function searchEvents() {
  const keyword = keywordInput.value.toLowerCase().trim();

  const filtered = sampleEvents.filter((evt) => {
    return evt.title.toLowerCase().includes(keyword);
  });

  showEvents(filtered);
}

if (searchBtn) {
  searchBtn.onclick = searchEvents;
}

showEvents(sampleEvents);
showSaved();
