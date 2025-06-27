let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=csv";

  try {
    const resp = await fetch(CSV_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();

    // 1) Split into rows
    const lines = text.trim().split("\n");
    // 2) Extract headers (remove any surrounding quotes)
    const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, ""));
    // 3) Parse each subsequent line into an object
    const data = lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.replace(/^"|"$/g, ""));
      return headers.reduce((obj, h, i) => {
        obj[h] = cols[i] || "";
        return obj;
      }, {});
    });

    // 4) Filter out exactly "Yes" responders
    validEntries = data.filter(row => 
      row["Are you a DJ, Vendor or Performer at Gamer Rave?"] !== "Yes"
    );

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`Loaded ${validEntries.length} valid guests.`);
    }
  } catch (err) {
    console.error("loadEntries error:", err);
    alert("Failed to load or parse the spreadsheet.");
  }
}

function pickWinner() {
  if (validEntries.length === 0) {
    return alert("Load entries first!");
  }
  const w = validEntries[Math.floor(Math.random() * validEntries.length)];
  const name  = w["Name"]          || "Unnamed";
  const email = w["Email Address"] || "No Email";
  document.getElementById("winner").innerText =
    `🎉 Winner: ${name} (${email})`;
}
