import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const key = process.env.GEMINI_API_KEY;

async function testModel(name) {
  const t0 = Date.now();
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Return JSON: {"status": "ok"}' }] }],
        generationConfig: { responseMimeType: 'application/json' }
      }),
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    console.log(name, '->', data.candidates ? `OK in ${Date.now() - t0}ms` : data.error?.message?.slice(0, 80));
  } catch (e) {
    console.log(name, '-> ERROR/TIMEOUT:', e.message);
  }
}

async function run() {
  await testModel('gemini-3.8-flash');
  await testModel('gemini-3.5-flash');
  await testModel('gemini-3-flash-preview');
  await testModel('gemini-flash-latest');
  await testModel('gemini-3.1-pro-preview');
}
run();
