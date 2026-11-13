const API_URL = 'http://localhost:4000/api';
let token = localStorage.getItem('pb_token') || '';

async function fetchFiles() {
  const tbody = document.getElementById('fileBody');
  if (!tbody) return;
  try {
    const res = await fetch(`${API_URL}/files`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const files = await res.json();
    if (!Array.isArray(files) || !files.length) {
      tbody.innerHTML = '<tr><td colspan="4">No files received yet.</td></tr>';
      return;
    }
    tbody.innerHTML = files.map(f => `
      <tr>
        <td>${f.original_name}</td>
        <td>${(f.size_bytes / 1024).toFixed(1)} KB</td>
        <td>${f.source_device_name || 'Mobile'}</td>
        <td><a href="${API_URL}/files/${f.file_id}/download" target="_blank" class="btn">Download</a></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4">Error loading files: ${err.message}</td></tr>`;
  }
}

async function generatePairingCode() {
  const res = await fetch(`${API_URL}/pairings`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
}

fetchFiles();
