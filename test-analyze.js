import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'node:fs';

const imgBuffer = fs.readFileSync('public/samples/clinic_three_steps.jpg');
const base64 = imgBuffer.toString('base64');

console.log('Sending request to /api/analyze with real photo...');
const res = await fetch('http://127.0.0.1:3001/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    images: [{ data: base64, mimeType: 'image/jpeg', role: 'primary' }],
    referenceObject: 'coin',
    language: 'en'
  })
});

const data = await res.json();
console.log('=== AUDIT RESULT ===');
console.log('Status:', data.assessment_status);
console.log('Observed:', data.observed);
console.log('Needs Verification:', data.needs_verification);
console.log('Scores:', JSON.stringify(data.scores));
console.log('Score range:', JSON.stringify(data.score_range));
console.log('Barriers count:', data.barriers?.length);
if (data.barriers?.length > 0) console.log('First Barrier:', data.barriers[0]);
console.log('Total Cost:', data.total_cost_range_inr);
console.log('Walkthrough text:', data.walkthrough_text?.slice(0, 100));
