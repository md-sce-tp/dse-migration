// Paste your deployed Google Apps Script Web App URL here
const API_URL = "https://script.google.com/macros/s/AKfycbwIUVSa1cwhdtmyJ6YObdpcEApxvJ_gqy400yVH5bhnPx7cWHaRSVEkFFK0AR7TQLOsfA/exec"; 

async function callAPI(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, data: data }),
      redirect: 'follow' // CRITICAL: Forces browser to follow Google's 302 redirect
    });
    
    // Read the response as raw text first to prevent hidden parsing crashes
    const textResponse = await response.text(); 
    
    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (e) {
      console.error("Server returned HTML instead of JSON. Here is the response:", textResponse);
      throw new Error("API returned an HTML page. Ensure you deployed a NEW VERSION of the script and your API_URL ends in /exec.");
    }
    
    if (result.status === 'success') return result.data;
    throw new Error(result.message);
    
  } catch (err) {
    console.error("API Error:", err);
    throw new Error(err.message || "Network Error. Please try again.");
  }
}

function esc(s) { 
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c])); 
}

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
