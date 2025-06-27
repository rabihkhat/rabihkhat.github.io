let validEntries = [];

document.getElementById('fileUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return alert("Please upload a spreadsheet");

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    validEntries = jsonData.filter(row => {
      const q = "Are you a DJ, Vendor or Performer at Gamer Rave?";
      return row[q]?.toLowerCase().trim() !== "yes";
    });

    if (validEntries.length === 0) {
      alert("No valid guest entries found.");
    } else {
      alert(`${validEntries.length} valid guests loaded.`);
    }
  };
  reader.readAsArrayBuffer(file);
});

function pickWinner() {
  if (validEntries.length === 0) {
    alert("Upload a valid spreadsheet first!");
    return;
  }
  const winner = validEntries[Math.floor(Math.random() * validEntries.length)];
  document.getElementById('winner').innerText = `🎉 Winner: ${winner.Name || "Unnamed"} (${winner.Email || "No Email"})`;
}
