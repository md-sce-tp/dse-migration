// Paste your deployed Google Apps Script Web App URL here
const API_URL = "https://script.google.com/macros/s/AKfycbx3IR0cYXUXx2UNRS26efleoIZ5jjW7V0GL2CD-re_EyVLw3LaWBNzKrB7sgJEbDbMIcg/exec"; 

async function callAPI(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      // CRITICAL: text/plain prevents CORS preflight errors while still passing JSON data
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, data: data })
    });
    
    const result = await response.json();
    if (result.status === 'success') return result.data;
    throw new Error(result.message);
  } catch (err) {
    console.error("API Error:", err);
    throw new Error(err.message || "Network Error. Please try again.");
  }
}

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c])); }

function getFileBase64(fileInputId) {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return resolve(null);
    const file = fileInput.files[0];
    if (file.size > 5 * 1024 * 1024) return reject(new Error("File size must be under 5MB"));
    const reader = new FileReader();
    reader.onload = e => resolve({ name: file.name, mimeType: file.type, data: e.target.result });
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}
