let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?gid=2124022789&single=true&output=csv";
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    // PapaParse will handle quotes/commas/newlines properly
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Check for parse errors
    if (parsed.errors.length) {
      console.error("CSV parse errors:", parsed.errors);
      alert("Spreadsheet parsed with errors—see console.");
      return;
    }

    // Filter out “Yes”
    validEntries = parsed.data.filter(row =>
      row["Are you a DJ, Vendor or Performer at Gamer Rave?"] !== "Yes"
    );

    alert(`Loaded ${validEntries.length} valid guest entries.`);
  } catch (err) {
    console.error("Fetch or parse failed:", err);
    alert("Failed to load the spreadsheet.");
  }
}
