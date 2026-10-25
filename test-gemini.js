import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("No GEMINI_API_KEY found");
  process.exit(1);
}

const tinyPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function test() {
  console.log("Calling Gemini 3.8 Flash with IPv4...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: 'Return a strict JSON object: {"valid_entrance_photo": false, "status": "Ready", "message": "AccessProof AI working!"}' },
          { inlineData: { mimeType: 'image/png', data: tinyPixel } }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    })
  });
  const data = await res.json();
  if (data.candidates && data.candidates[0].content) {
    console.log("SUCCESS RESPONSE:", data.candidates[0].content.parts[0].text);
  } else {
    console.error("API response error:", JSON.stringify(data));
  }
}

test();
