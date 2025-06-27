// 🎉 Giveaway Script — Version 2.0 (updated filter & email fix)

let validEntries = [];

document.getElementById('fileUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return alert("Please upload a spreadsheet");

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

    // Robust "yes" filter
    validEntries = jsonData.filter(row => {
      const answer = row["Are you a DJ, Vendor or Performer at Gamer Rave?"]
        .toString()
        .replace(/[\r\n]+/g, "")  // strip CR/LF
        .trim()
        .toLowerCase();
      return answer !== "yes";
    });

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`Version 2.0 loaded ${validEntries.length} valid guests.`);
    }
  };
  reader.readAsArrayBuffer(file);
});

function pickWinner() {
  if (validEntries.length === 0) {
    alert("Upload a valid spreadsheet first!");
    return;
  }
  const winner = validEntries[
    Math.floor(Math.random() * validEntries.length)
  ];
  // Try both common email headers
  const email = winner.Email
    || winner["Email Address"]
    || winner["Email Address "]
    || "No Email";

  document.getElementById('winner').innerText =
    `🎉 Winner (v2.0): ${winner.Name || "Unnamed"} (${email})`;
}
