import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Ensure IPv4 is prioritized for external Google API calls on Windows
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/samples', express.static(path.join(__dirname, 'public/samples')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set in environment or .env!');
} else {
  console.log('GEMINI_API_KEY is loaded successfully.');
}

const SYSTEM_PROMPT = `You are an accessibility auditor for building entrances in India. Analyse the photo(s) for wheelchair users, walker users and low-vision users. Look for steps, step height, ramps and slope, door width, thresholds, handrails, tactile or contrast markings, lighting, clutter and slippery surfaces. NEVER invent a measurement. Sort every finding into OBSERVED (clearly visible), NEEDS VERIFICATION (cannot be determined from the image, e.g. door clearance, ramp slope, interior access), or USER-CONFIRMED (supplied by the user). If a reference object is provided (A4 sheet = 21 x 29.7 cm, ₹10 coin = about 2.7 cm, standard door height = about 2.1 m), use it for rough estimates and label them 'estimated' with a confidence level; otherwise lower your confidence. If important evidence is missing, set assessment_status to 'Incomplete', return score RANGES marked provisional, and request only the minimum extra evidence needed. Never say a place is certified, compliant or fully safe. Suggest the cheapest practical fix with an INR cost range using local low-cost solutions. If the image is not an entrance or is too unclear, set valid_entrance_photo to false and explain what photo is needed. For Tamil output, write simple conversational spoken Tamil (பேச்சுத் தமிழ்). Return ONLY valid JSON matching the schema, no markdown.`;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: 'gemini-3.5-flash',
    hasKey: Boolean(GEMINI_API_KEY)
  });
});

// Candidate models in preference order (fastest first)
const MODELS = ['gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-3.8-flash'];

app.post('/api/analyze', async (req, res) => {
  try {
    const {
      images = [],
      referenceObject = 'none',
      language = 'en',
      userEvidence = [],
      isBeforeAfter = false,
      beforeData = null
    } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({
        error: 'At least one photo is required for analysis.'
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY."
      });
    }

    // Build the user instruction prompt
    let refObjDescription = 'None specified.';
    if (referenceObject === 'coin') refObjDescription = '₹10 Indian coin (approx 2.7 cm diameter) is in frame for scale.';
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
      ? `IMPORTANT: Output ALL text fields (labels, reasons, observed items, needs_verification items, user_confirmed, barrier titles, fixes, next_step, walkthrough_text, owner_letter, disclaimer) in simple conversational spoken Tamil (பேச்சுத் தமிழ்). Numbers must remain standard numbers.`
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
  "sensory_tags": ["e.g. Likely noisy", "e.g. High glare"],
  "next_step": "Actionable single next step for user or owner",
  "walkthrough_text": "Spoken first-person walkthrough: You arrive at the entrance... using uncertainty wording for unverified items and placing highest priority barrier first.",
  "owner_letter": "Polite, constructive letter to the building owner/manager mentioning specific barriers, affordable fixes in INR, and verification items.",
  "disclaimer": "AI estimate from photos. Verify on site. This is not an accessibility certification."
}`;

    // Format parts for Gemini API
    const parts = [
      { text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }
    ];

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

    // Try models with automatic failover
    for (const modelName of MODELS) {
      try {
        console.log(`Calling model: ${modelName}...`);
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
            signal: AbortSignal.timeout(45000)
        });

        if (apiResponse.ok) {
          resultData = await apiResponse.json();
          if (resultData.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log(`Success with model ${modelName}`);
            break;
          }
        } else {
          const errText = await apiResponse.text();
          console.warn(`Model ${modelName} returned status ${apiResponse.status}: ${errText.slice(0, 100)}`);
          lastError = errText;
        }
      } catch (callErr) {
        console.warn(`Model ${modelName} failed/timed out:`, callErr.message);
        lastError = callErr.message;
      }
    }

    let rawContent = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      console.warn('AI call failed or returned empty content. Last error:', lastError);
      return res.status(503).json({
        error: "The AI service is temporarily unavailable. Please try again in a moment."
      });
    }

    // Clean markdown code fence if returned
    let cleanJsonStr = rawContent.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.slice(7);
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.slice(3);
    }
    if (cleanJsonStr.endsWith('```')) {
      cleanJsonStr = cleanJsonStr.slice(0, -3);
    }
    cleanJsonStr = cleanJsonStr.trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      console.error('JSON Parse error on output:', cleanJsonStr);
      return res.status(502).json({
        error: 'Failed to parse AI audit structure. Please try again.',
        raw: cleanJsonStr
      });
    }

    // AccessProof verification validation
    if (!parsedResult.observed) parsedResult.observed = [];
    if (!parsedResult.needs_verification) parsedResult.needs_verification = [];
    if (!parsedResult.user_confirmed) parsedResult.user_confirmed = [];
    if (!parsedResult.barriers) parsedResult.barriers = [];
    if (!parsedResult.score_range) {
      parsedResult.score_range = {
        wheelchair: [20, 50],
        walker: [30, 60],
        low_vision: [40, 70]
      };
    }

    // Merge incoming user evidence into user_confirmed
    if (userEvidence && userEvidence.length > 0) {
      for (const ev of userEvidence) {
        const text = `${ev.item}: ${ev.value} (CONFIRMED BY USER)`;
        if (!parsedResult.user_confirmed.includes(text)) {
          parsedResult.user_confirmed.push(text);
        }
        // Remove from needs_verification if user provided evidence for it
        parsedResult.needs_verification = parsedResult.needs_verification.filter(nv => {
          const nvItem = (nv.item || '').toLowerCase();
          const evItem = (ev.item || '').toLowerCase();
          return !nvItem.includes(evItem) && !evItem.includes(nvItem);
        });
      }
    }

    // Core AccessProof Status Check:
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

    return res.json(parsedResult);
  } catch (error) {
    console.error('Server exception during analysis:', error);
    res.status(500).json({
      error: 'An unexpected server error occurred: ' + error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenDoor AccessProof server running on http://127.0.0.1:${PORT}`);
});
