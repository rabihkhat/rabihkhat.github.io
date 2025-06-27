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

    validEntries = data.filter(row =>
      row["Are you a DJ, Vendor or Performer at Gamer Rave?"]?.toLowerCase() !== "yes"
    );

    alert(`Loaded ${validEntries.length} valid guest entries.`);
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
