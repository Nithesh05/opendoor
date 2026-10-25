import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'node:fs';

const key = process.env.GEMINI_API_KEY;
const imgBuffer = fs.readFileSync('public/samples/clinic_three_steps.jpg');
const base64 = imgBuffer.toString('base64');

console.log('Testing gemini-3.5-flash with clinic_three_steps.jpg...');
const t0 = Date.now();
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: 'Analyze this building entrance. Is it accessible? Return JSON with { observed: [...], barriers: [...] }' },
        { inlineData: { mimeType: 'image/jpeg', data: base64 } }
      ]
    }],
    generationConfig: { responseMimeType: 'application/json' }
  })
});

const data = await res.json();
console.log('Result in', Date.now() - t0, 'ms');
console.log('Data keys:', Object.keys(data));
console.log('Data:', JSON.stringify(data).slice(0, 300));
