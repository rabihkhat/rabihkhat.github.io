let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=csv";
  const debugEl = document.getElementById("debug");
  debugEl.textContent = "";

  try {
    // 1) Fetch
    const response = await fetch(CSV_URL);
    const text = await response.text();

    // 2) Parse
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true
    });
    const data = result.data;

    // 3) Debug: show first 5 rows raw
    debugEl.textContent += "=== First 5 rows raw data ===\n";
    data.slice(0,5).forEach((row,i) => {
      debugEl.textContent += `Row ${i+1}: ` +
        JSON.stringify(row["Are you a DJ, Vendor or Performer at Gamer Rave?"], null, 0) +
        "\n";
    });
    debugEl.textContent += "\n";

    // 4) Filter
    validEntries = data.filter((row, idx) => {
      const raw = row["Are you a DJ, Vendor or Performer at Gamer Rave?"];
      const cleaned = (raw||"")
        .replace(/[\r\n]+/g, "")
        .trim()
        .toLowerCase();

      // Debug each row decision
      debugEl.textContent += `Row ${idx+1}: raw='${raw}' → cleaned='${cleaned}' → ` +
        (cleaned === "yes" ? "EXCLUDE\n" : "KEEP\n");

      return cleaned !== "yes";
    });

    debugEl.textContent += `\n✅ ${validEntries.length} valid entries after filter\n`;
    alert(`Loaded ${validEntries.length} valid guest entries.`);
  } catch (err) {
    console.error(err);
    alert("Failed to load or parse the CSV. See console for details.");
  }
}

function pickWinner() {
  if (validEntries.length === 0) {
    alert("No valid entries loaded. Please click 'Load Entries' first.");
    return;
  }
  const winner = validEntries[Math.floor(Math.random() * validEntries.length)];
  const name = winner["Name"] || "Unnamed";
  const email = winner["Email Address"] || "No Email";
  document.getElementById("winner").innerText =
    `🎉 Winner: ${name} (${email})`;
}
