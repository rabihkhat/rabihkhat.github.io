let validEntries = [];

async function loadEntries() {
  const XLSX_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=xlsx";

  try {
    // 1) Fetch the binary
    const resp = await fetch(XLSX_URL);
    const buf = await resp.arrayBuffer();

    // 2) Parse with SheetJS
    const wb = XLSX.read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 3) Filter using your exact snippet
    validEntries = jsonData.filter(row => {
      const q = "Are you a DJ, Vendor or Performer at Gamer Rave?";
      const raw = row[q] || "";
      const clean = String(raw).toLowerCase().trim();
      return clean !== "yes";
    });

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`${validEntries.length} valid guests loaded.`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to load or parse the spreadsheet.");
  }
}

function pickWinner() {
  if (!validEntries.length) {
    return alert("Load entries first!");
  }
  const w = validEntries[Math.floor(Math.random() * validEntries.length)];
  const name  = w["Name"]          || "Unnamed";
  const email = w["Email Address"] || "No Email";
  document.getElementById("winner").innerText =
    `🎉 Winner: ${name} (${email})`;
}
