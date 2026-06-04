let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/1s9azP6lDiiSiXIREjCm-BhG8B7hZkk5CdqOu36er9Kw/export?format=csv&gid=1437669261";
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

function pickWinner() {
  if (validEntries.length === 0) {
    alert("No valid entries loaded. Please click 'Load Entries' first.");
    return;
  }

  const winner = validEntries[Math.floor(Math.random() * validEntries.length)];
  const name = winner["Name"] || "Unnamed";
  const email = winner["Email Address"] || "No Email";

  document.getElementById("winner").innerText = `🎉 Winner: ${name} (${email})`;
}