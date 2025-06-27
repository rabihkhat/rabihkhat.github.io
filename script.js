let validEntries = [];

async function loadEntries() {
  console.log("Loading entries...");

  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=csv";

  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.trim().split("\n").map(row =>
      row.split(",").map(cell => cell.replace(/"/g, "").trim())
    );

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    validEntries = data.filter(row => {
      const answer = row["Are you a DJ, Vendor or Performer at Gamer Rave?"] || "";
      return answer.trim().toLowerCase() !== "yes";
    });

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`Loaded ${validEntries.length} valid guest entries.`);
    }
  } catch (error) {
    console.error("Error fetching or processing CSV:", error);
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
