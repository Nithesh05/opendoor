import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const SYSTEM_PROMPT = `You are an accessibility auditor for building entrances in India. Analyse the photo(s) for wheelchair users, walker users and low-vision users. Look for steps, step height, ramps and slope, door width, thresholds, handrails, tactile or contrast markings, lighting, clutter and slippery surfaces. NEVER invent a measurement. Sort every finding into OBSERVED (clearly visible), NEEDS VERIFICATION (cannot be determined from the image, e.g. door clearance, ramp slope, interior access), or USER-CONFIRMED (supplied by the user). If a reference object is provided (A4 sheet = 21 x 29.7 cm, ₹10 coin = about 2.7 cm, standard door height = about 2.1 m), use it for rough estimates and label them 'estimated' with a confidence level; otherwise lower your confidence. If important evidence is missing, set assessment_status to 'Incomplete', return score RANGES marked provisional, and request only the minimum extra evidence needed. Never say a place is certified, compliant or fully safe. Suggest the cheapest practical fix with an INR cost range using local low-cost solutions. If the image is not an entrance or is too unclear, set valid_entrance_photo to false and explain what photo is needed. For Tamil output, write simple conversational spoken Tamil (பேச்சுத் தமிழ்). Return ONLY valid JSON matching the schema, no markdown.`;

const MODELS = ['gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-3.8-flash'];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      images = [],
      referenceObject = 'none',
      language = 'en',
      userEvidence = [],
      isBeforeAfter = false,
      beforeData = null
    } = req.body || {};

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required.' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY."
      });
    }

    // Scale reference description
    let refObjDescription = 'None specified.';
    if (referenceObject === 'coin') refObjDescription = '₹10 Indian coin (~2.7 cm diameter) is in frame for scale.';
    else if (referenceObject === 'a4') refObjDescription = 'Standard A4 sheet (21 cm x 29.7 cm) is in frame for scale.';
    else if (referenceObject === 'door') refObjDescription = 'Standard door height (~2.1 m) is present for scale.';

    let evidenceText = 'None provided yet.';
    if (userEvidence && userEvidence.length > 0) {
      evidenceText = userEvidence.map(e => `- Item: "${e.item}", Confirmed fact/measurement: "${e.value}" (Type: ${e.type})`).join('\n');
    }

    let beforeAfterContext = '';
    if (isBeforeAfter && beforeData) {
      beforeAfterContext = `\n\nTHIS IS A BEFORE/AFTER ASSESSMENT:
The user has submitted an updated photo after making accessibility modifications.
Previous assessment summary:
- Previous Wheelchair: range ${JSON.stringify(beforeData.score_range?.wheelchair || [])}, score: ${JSON.stringify(beforeData.scores?.wheelchair || {})}
- Previous Walker: range ${JSON.stringify(beforeData.score_range?.walker || [])}, score: ${JSON.stringify(beforeData.scores?.walker || {})}
- Previous Low Vision: range ${JSON.stringify(beforeData.score_range?.low_vision || [])}, score: ${JSON.stringify(beforeData.scores?.low_vision || {})}
- Previous barriers: ${JSON.stringify(beforeData.barriers?.map(b => b.title) || [])}

Please return the exact same JSON schema. Base assessment_status, score_range, scores, and labels strictly and only on what is visible in this new after photo. If barriers have been resolved by the modification (e.g., ramp installed, threshold leveled, grab bar added), reflect the improved score_range, scores, and set assessment_status to "Partially verified" or "Verified by user evidence". If barriers remain or the photo is unclear, reflect the true condition without inventing improvements.`;
    }

    const languageInstruction = language === 'ta'
      ? `IMPORTANT: Output ALL text fields in simple conversational spoken Tamil (பேச்சுத் தமிழ்). Numbers must remain standard numbers.`
      : `Output ALL text fields in clear, empathetic English. Numbers must remain standard numbers.`;

    const userPrompt = `Analyse the entrance image(s).
Scale Reference: ${refObjDescription}
User Confirmed Evidence / Input:
${evidenceText}${beforeAfterContext}
Language: ${language === 'ta' ? 'Tamil (பேச்சுத் தமிழ்)' : 'English'}

${languageInstruction}

Strict JSON Schema required:
{
  "valid_entrance_photo": boolean,
  "photo_quality_issue": string or null,
  "assessment_status": "Incomplete" | "Partially verified" | "Verified by user evidence",
  "overall_confidence": "High" | "Medium" | "Low",
  "score_is_provisional": boolean,
  "score_range": {
    "wheelchair": [min_number, max_number],
    "walker": [min_number, max_number],
    "low_vision": [min_number, max_number]
  },
  "scores": {
    "wheelchair": { "label": "Accessible" | "Difficult" | "Blocked", "reason": "concise explanation" },
    "walker": { "label": "Accessible" | "Difficult" | "Blocked", "reason": "concise explanation" },
    "low_vision": { "label": "Accessible" | "Difficult" | "Blocked", "reason": "concise explanation" }
  },
  "observed": ["visible item 1", "visible item 2"],
  "needs_verification": [
    {
      "item": "e.g. Door clearance",
      "why": "e.g. Angle obscures clear width",
      "evidence_requested": "e.g. Front view of the doorway, or measured width in cm",
      "input_type": "photo" | "measurement" | "confirm"
    }
  ],
  "user_confirmed": ["user confirmed fact 1"],
  "barriers": [
    {
      "title": "Barrier title",
      "severity": "red" | "yellow" | "green",
      "estimated_measurement": "e.g. 3 steps, ~18 cm each (estimated)",
      "confidence": "High" | "Medium" | "Low",
      "affects": ["wheelchair", "walker", "low_vision"],
      "fix": "Cheapest practical fix description",
      "cost_range_inr": [min_inr, max_inr],
      "who_can_do_it": "Local carpenter" | "Local welder" | "Local mason" | "Local electrician",
      "priority": 1
    }
  ],
  "total_cost_range_inr": [min_inr, max_inr],
  "sensory_tags": ["e.g. Likely noisy"],
  "next_step": "Actionable single next step for user or owner",
  "walkthrough_text": "Spoken first-person walkthrough: You arrive at the entrance... using uncertainty wording for unverified items and placing highest priority barrier first.",
  "owner_letter": "Polite, constructive letter to the building owner/manager mentioning specific barriers, affordable fixes in INR, and verification items.",
  "disclaimer": "AI estimate from photos. Verify on site. This is not an accessibility certification."
}`;

    const parts = [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }];

    for (const img of images) {
      if (img.data) {
        let cleanBase64 = img.data;
        if (cleanBase64.includes('base64,')) {
          cleanBase64 = cleanBase64.split('base64,')[1];
        }
        parts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }
    }

    let resultData = null;
    let lastError = null;

    if (GEMINI_API_KEY) {
      for (const modelName of MODELS) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
          const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.15,
                responseMimeType: 'application/json'
              }
            }),
            signal: AbortSignal.timeout(30000)
          });

          if (apiResponse.ok) {
            resultData = await apiResponse.json();
            if (resultData.candidates?.[0]?.content?.parts?.[0]?.text) {
              break;
            }
          } else {
            lastError = await apiResponse.text();
          }
        } catch (err) {
          lastError = err.message;
        }
      }
    }

    let rawContent = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return res.status(503).json({
        error: "The AI service is temporarily unavailable. Please try again in a moment."
      });
    }

    let cleanJsonStr = rawContent.trim();
    if (cleanJsonStr.startsWith('```json')) cleanJsonStr = cleanJsonStr.slice(7);
    else if (cleanJsonStr.startsWith('```')) cleanJsonStr = cleanJsonStr.slice(3);
    if (cleanJsonStr.endsWith('```')) cleanJsonStr = cleanJsonStr.slice(0, -3);
    cleanJsonStr = cleanJsonStr.trim();

    const parsedResult = JSON.parse(cleanJsonStr);

    if (!parsedResult.observed) parsedResult.observed = [];
    if (!parsedResult.needs_verification) parsedResult.needs_verification = [];
    if (!parsedResult.user_confirmed) parsedResult.user_confirmed = [];
    if (!parsedResult.barriers) parsedResult.barriers = [];

    // Merge incoming user evidence
    if (userEvidence && userEvidence.length > 0) {
      for (const ev of userEvidence) {
        const text = `${ev.item}: ${ev.value} (CONFIRMED BY USER)`;
        if (!parsedResult.user_confirmed.includes(text)) {
          parsedResult.user_confirmed.push(text);
        }
        parsedResult.needs_verification = parsedResult.needs_verification.filter(nv => {
          const nvItem = (nv.item || '').toLowerCase();
          const evItem = (ev.item || '').toLowerCase();
          return !nvItem.includes(evItem) && !evItem.includes(nvItem);
        });
      }
    }

    if (!isBeforeAfter) {
      if (parsedResult.needs_verification.length > 0 && (!userEvidence || userEvidence.length === 0)) {
        parsedResult.assessment_status = 'Incomplete';
        parsedResult.score_is_provisional = true;
      } else if (userEvidence && userEvidence.length > 0 && parsedResult.needs_verification.length > 0) {
        parsedResult.assessment_status = 'Partially verified';
        parsedResult.score_is_provisional = true;
      } else if (userEvidence && userEvidence.length > 0 && parsedResult.needs_verification.length === 0) {
        parsedResult.assessment_status = 'Verified by user evidence';
        parsedResult.score_is_provisional = false;
      }
    } else {
      if (!parsedResult.assessment_status) {
        parsedResult.assessment_status = parsedResult.needs_verification?.length === 0 ? 'Verified by user evidence' : 'Partially verified';
      }
    }

    return res.status(200).json(parsedResult);
  } catch (err) {
    console.error('Vercel handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
