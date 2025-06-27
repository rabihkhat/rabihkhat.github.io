let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=csv";

  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    // Parse CSV properly using PapaParse
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true
    });

    const data = result.data;

    validEntries = data.filter(row => {
      const rawAnswer = row["Are you a DJ, Vendor or Performer at Gamer Rave?"];
      if (!rawAnswer) return true; // if blank, let it pass
      const answer = rawAnswer.trim().toLowerCase();
      return answer !== "yes";
    });

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`Loaded ${validEntries.length} valid guest entries.`);
    }
  } catch (error) {
    console.error("Failed to fetch or parse CSV:", error);
    alert("Error loading spreadsheet.");
  }
}

function pickWinner() {
  if (validEntries.length === 0) {
    alert("Please load entries first.");
    return;
  }

  const winner = validEntries[Math.floor(Math.random() * validEntries.length)];
  const name = winner["Name"] || "Unnamed";
  const email = winner["Email Address"] || "No Email";

  document.getElementById("winner").innerText = `🎉 Winner: ${name} (${email})`;
}
