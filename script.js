async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?gid=2124022789&single=true&output=csv";
  try {
    console.log("Fetching:", CSV_URL);
    const response = await fetch(CSV_URL);
    console.log("Status:", response.status, "Content-Type:", response.headers.get("content-type"));
    const csvText = await response.text();
    console.log("First 300 chars of body:\n", csvText.slice(0, 300));
    
    // now hand off to PapaParse only once you confirm it’s real CSV
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parsed.errors.length) {
      console.error("Parse errors:", parsed.errors);
      alert("Spreadsheet parsed with errors—see console for details.");
      return;
    }
    
    validEntries = parsed.data.filter(row =>
      row["Are you a DJ, Vendor or Performer at Gamer Rave?"] !== "Yes"
    );
    alert(`Loaded ${validEntries.length} valid guest entries.`);
  } catch (err) {
    console.error("Fetch or parse failed:", err);
    alert("Failed to load the spreadsheet.");
  }
}
