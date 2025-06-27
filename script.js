// let validEntries = [];

// document.getElementById('fileUpload').addEventListener('change', function(e) {
//   const file = e.target.files[0];
//   if (!file) return alert("Please upload a spreadsheet");

//   const reader = new FileReader();
//   reader.onload = function(e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });
//     const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(firstSheet);

//     validEntries = jsonData.filter(row => {
//       const q = "Are you a DJ, Vendor or Performer at Gamer Rave?";
//       return row[q]?.toLowerCase().trim() !== "yes";
//     });

//     if (validEntries.length === 0) {
//       alert("No valid guest entries found.");
//     } else {
//       alert(`${validEntries.length} valid guests loaded.`);
//     }
//   };
//   reader.readAsArrayBuffer(file);
// });

// function pickWinner() {
//   if (validEntries.length === 0) {
//     alert("Upload a valid spreadsheet first!");
//     return;
//   }
//   const winner = validEntries[Math.floor(Math.random() * validEntries.length)];
//   document.getElementById('winner').innerText = `🎉 Winner: ${winner.Name || "Unnamed"} (${winner.Email || "No Email"})`;
// }

let validEntries = [];

async function loadEntries() {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj0yrXpnSGjteWybJAiv71i2elpcmv9L1iZOGA1XSxkuKNFiQw6QesxMPBULWyZzX3zc4NhGu2fLmn/pub?output=csv"; // <- paste here

  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.split("\n").map(row => row.split(","));
    const headers = rows[0].map(h => h.trim().replace(/"/g, ''));
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => {
        obj[h] = (row[i] || "").trim().replace(/"/g, '');
      });
      return obj;
    });

    validEntries = data.filter(row =>
      row["Are you a DJ, Vendor or Performer at Gamer Rave?"]?.toLowerCase() !== "yes"
    );

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`Loaded ${validEntries.length} valid guests.`);
    }
  } catch (err) {
    console.error("Failed to load CSV", err);
    alert("Error loading spreadsheet. Check your URL or sheet publishing settings.");
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
