export const translations = {
  en: {
    appName: "OPEN DOOR",
    tagline: "Don't just identify barriers. Help remove them.",
    badge: "with ACCESSPROOF",
    theme: "Theme 3: Beyond the Screen — Build for a Smarter, More Inclusive Future",
    
    // Header & Accessibility
    languageToggle: "தமிழ்",
    textScale: "Text Size",
    contrastToggle: "High Contrast",
    normalContrast: "Normal Mode",
    privacyBtn: "Privacy & Data",
    privacyTitle: "Privacy & Responsible AI Policy",
    privacyBody: "Photos are analyzed in memory using vision AI and are NEVER stored on external servers or databases. Faces and vehicle registration plates are not extracted or retained. Local thumbnails remain solely in your device's browser memory (localStorage) and can be cleared anytime.",
    close: "Close",
    
    // Impact Counter
    audited: "Places Audited",
    barriersFound: "Barriers Found",
    barriersFixed: "Barriers Fixed",
    
    // Stepper
    stepScan: "1. Scan",
    stepEvidence: "2. Evidence",
    stepReport: "3. Audit",
    stepFix: "4. Fixes",
    stepLetter: "5. Letter",
    stepMap: "6. Map",
    
    // Scan Screen
    scanTitle: "Audit an Entrance in Seconds",
    scanSubtitle: "Take or upload a photo of any clinic, shop, pharmacy, or public entrance.",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    cameraActive: "Camera active...",
    capture: "Capture Photo",
    cancelCamera: "Cancel",
    switchCamera: "Flip Camera",
    scaleReference: "Scale Reference Object in Frame (Optional):",
    refNone: "None / Not in frame",
    refCoin: "₹10 Coin (~2.7 cm diameter)",
    refA4: "A4 Paper Sheet (21 × 29.7 cm)",
    refDoor: "Standard Door Height (~2.1 m)",
    scaleTip: "Tip: Placing a ₹10 coin or an A4 paper sheet on the step helps the AI calibrate estimated dimensions.",
    
    // Sample Presets
    demoPresets: "Try One-Click Hackathon Presets:",
    sampleSteps: "Sample 1: Clinic (3 Steps + ₹10 Coin)",
    sampleRamp: "Sample 2: Steep Ramp without Handrail",
    sampleAccessible: "Sample 3: Step-free Accessible Doorway",
    sampleDark: "Sample 4: Dark Photo (Tests Pre-check Rejection)",
    
    // Pre-check
    analyzingImage: "Checking photo brightness & quality...",
    darkPhotoAlert: "Photo is too dark, please retake in good lighting.",
    smallPhotoAlert: "Photo resolution is too low. Please upload a clear photo.",
    precheckPassed: "Pre-check passed! Analyzing entrance accessibility with AI...",
    
    // Evidence Screen
    evidenceTitle: "AccessProof Verification Check",
    evidenceSubtitle: "We never invent measurements. The AI identified the following uncertain points requiring verification:",
    evidenceWhy: "Why needed:",
    evidenceRequested: "Evidence needed:",
    optionUploadPhoto: "Upload Photo Evidence",
    optionMeasurement: "Enter Measurement",
    optionConfirmNoRamp: "Confirm 'No Ramp Exists'",
    optionConfirmOutward: "Confirm 'Door Opens Outward'",
    optionSkip: "Skip for now",
    skipNotice: "Skipping will keep the assessment status as 'Incomplete'.",
    reAnalyzeBtn: "Re-run Verification Audit",
    reAnalyzing: "Re-running analysis with your evidence...",
    
    // Report Screen
    statusIncomplete: "Assessment Status: Incomplete",
    statusIncompleteDesc: "Critical evidence is missing (e.g. ramp slope or door width). Showing PROVISIONAL score ranges only.",
    statusPartial: "Assessment Status: Partially Verified",
    statusPartialDesc: "User evidence provided for key barriers. Scores are more accurate.",
    statusVerified: "Assessment Status: Verified by User Evidence",
    statusVerifiedDesc: "Observed facts corroborated with user-provided measurements. (Not a legal certification).",
    provisionalRange: "Provisional Range",
    
    // Personas
    wheelchairUser: "Wheelchair Users",
    walkerUser: "Walker & Elderly Users",
    lowVisionUser: "Low-Vision Users",
    accessible: "Accessible",
    difficult: "Difficult",
    blocked: "Blocked",
    
    // AccessProof 3 Sections
    observedTitle: "OBSERVED (Clearly Visible in Photo)",
    observedTip: "Direct physical observations identified by vision AI.",
    needsVerificationTitle: "NEEDS VERIFICATION (Cannot Be Confirmed from Photo)",
    needsVerificationTip: "Measurements or features not visible from current camera angle.",
    userConfirmedTitle: "USER-CONFIRMED (Verified by You)",
    userConfirmedTip: "Facts and measurements provided or confirmed by user on site.",
    noUserConfirmed: "No user evidence submitted yet. Tap 'Resolve Uncertainty' to add data.",
    
    // Barriers List
    barriersTitle: "Identified Accessibility Barriers",
    severity: "Severity",
    confidence: "Confidence",
    estimated: "ESTIMATED",
    confirmedByUser: "CONFIRMED BY USER",
    observedTag: "OBSERVED",
    whoCanDoIt: "Who can fix this:",
    estimatedFixCost: "Estimated fix cost:",
    
    // Fixes Screen
    fixesTitle: "Practical Low-Cost Fixes",
    fixesSubtitle: "Don't just point out problems. Here are realistic, budget-friendly fixes in INR:",
    totalProjectEstimate: "Total Estimated Project Cost:",
    priority: "Priority",
    localWorkforce: "Local Craftsman",
    
    // Letter Generator
    letterTitle: "Ready-to-Send Building Owner Letter",
    letterSubtitle: "A polite, constructive letter you can copy or send directly via WhatsApp to the shopkeeper or building owner.",
    editLetter: "Edit Letter Text",
    saveLetter: "Done Editing",
    copyLetter: "Copy Letter",
    copied: "Copied to clipboard!",
    shareWhatsApp: "Share on WhatsApp",
    whatsAppNotice: "Nothing is sent automatically. You review and send it yourself.",
    
    // Voice Walkthrough
    voiceTitle: "Simulate My Route (First-Person Spoken Walkthrough)",
    voiceSubtitle: "Listen to an audio description of what arriving at this entrance feels like, with honest uncertainty phrasing.",
    playVoice: "Play Walkthrough",
    pauseVoice: "Pause",
    resumeVoice: "Resume",
    stopVoice: "Stop",
    voiceUnavailable: "Tamil voice is not installed on this device. Please read the transcript below.",
    transcriptTitle: "Spoken Transcript",
    
    // Before / After Comparison
    beforeAfterTitle: "Before & After Transformation",
    beforeAfterSubtitle: "Has the owner installed a ramp or removed steps? Upload an updated photo to celebrate progress!",
    uploadAfterPhoto: "Upload Post-Fix Photo",
    evaluatingFix: "Evaluating improved entrance...",
    improvedBanner: "Accessibility Greatly Improved!",
    scoreProgression: "Score Progression:",
    resolvedNotice: "Barrier resolved! Added +1 to Barriers Fixed impact counter.",
    
    // Community Map
    mapTitle: "Accessible Places Community Map",
    mapSubtitle: "Verified building entrances across the city. Check accessibility before you leave home.",
    addCurrentPlace: "Add This Audited Place to Map",
    placeNamePrompt: "Place Name (e.g. Apollo Pharmacy, Anna Nagar):",
    placeAdded: "Place added to community map!",
    viewAudit: "View Details",
    lastChecked: "Last checked",
    
    // Phone-tilt Slope Reader
    slopeTitle: "Phone-Tilt Ramp Slope Inclinometer",
    slopeSubtitle: "Lay your phone flat on the ramp surface to measure its angle and slope ratio.",
    measureSlopeBtn: "Calibrate & Measure Slope",
    calibrating: "Measuring tilt...",
    slopeRatio: "Ramp Slope Ratio",
    slopeAngle: "Angle:",
    adaStandard: "CPWD / ADA Standard: Max 1:12 (~4.76°). Recommended: 1:15 to 1:20.",
    rampCompliant: "Slope appears compliant with accessible guidelines (1:12 or gentler).",
    rampTooSteep: "Slope is too steep! Dangerous for unassisted wheelchair users.",
    applySlopeToAudit: "Save Measurement to Audit",
    slopeSaved: "Saved as CONFIRMED BY USER (phone-measured).",
    
    // Placard
    placardTitle: "Printable Entrance Accessibility Placard",
    placardSubtitle: "Print and stick this at the building entrance or share with the owner.",
    printPlacard: "Print Placard",
    
    // Footer & Closing
    disclaimer: "AI estimate from photos. Verify on site. This is not an accessibility certification.",
    closingMotto: "We don't ask people to adapt to buildings. We help buildings adapt to people.",
    resetAll: "Audit Another Entrance",
    errorRetry: "Try Again",
  },
  
  ta: {
    appName: "ஓபன் டோர் (OPEN DOOR)",
    tagline: "தடைகளை அடையாளம் காண்பதோடு நிற்காமல், அவற்றை நீக்கவும் உதவுவோம்.",
    badge: "ACCESSPROOF உடன்",
    theme: "கருப்பொருள் 3: திரைக்கு அப்பால் — உள்ளடக்கிய எதிர்காலத்தை உருவாக்குவோம்",
    
    // Header & Accessibility
    languageToggle: "English",
    textScale: "எழுத்து அளவு",
    contrastToggle: "உயர் மாறுபாடு (High Contrast)",
    normalContrast: "சாதாரண பார்வை",
    privacyBtn: "தனியுரிமை & பாதுகாப்பு",
    privacyTitle: "தனியுரிமை மற்றும் பொறுப்பான AI கொள்கை",
    privacyBody: "புகைப்படங்கள் AI மூலம் உடனடி பகுப்பாய்வுக்கு மட்டுமே பயன்படுத்தப்படுகின்றன. வெளி சேவையகங்களில் சேமிக்கப்படுவதில்லை. முகங்கள் மற்றும் வாகன எண்கள் பதிவு செய்யப்படுவதில்லை. உங்கள் உலாவியில் மட்டுமே தற்காலிகமாக இருக்கும்.",
    close: "மூடு",
    
    // Impact Counter
    audited: "ஆய்வு செய்யப்பட்ட இடங்கள்",
    barriersFound: "கண்டறியப்பட்ட தடைகள்",
    barriersFixed: "சரிசெய்யப்பட்ட தடைகள்",
    
    // Stepper
    stepScan: "1. புகைப்படம்",
    stepEvidence: "2. சான்றுகள்",
    stepReport: "3. அறிக்கை",
    stepFix: "4. தீர்வுகள்",
    stepLetter: "5. கடிதம்",
    stepMap: "6. வரைபடம்",
    
    // Scan Screen
    scanTitle: "கட்டட நுழைவாயிலை நொடிகளில் ஆய்வு செய்யுங்கள்",
    scanSubtitle: "மருத்துவமனை, கடை அல்லது அலுவலகத்தின் நுழைவுப் புகைப்படத்தை எடுங்கள் அல்லது பதிவேற்றுங்கள்.",
    takePhoto: "புகைப்படம் எடுங்கள்",
    uploadPhoto: "புகைப்படம் பதிவேற்றுங்கள்",
    cameraActive: "கேமரா இயங்குகிறது...",
    capture: "படம் பிடி",
    cancelCamera: "ரத்து செய்",
    switchCamera: "கேமராவை மாற்று",
    scaleReference: "அளவீட்டுக்கான பொருள் (விருப்பத்தேர்வு):",
    refNone: "எதுவுமில்லை",
    refCoin: "₹10 நாணயம் (சுமார் 2.7 செ.மீ)",
    refA4: "A4 தாள் (21 × 29.7 செ.மீ)",
    refDoor: "நிலையான கதவு உயரம் (~2.1 மீ)",
    scaleTip: "குறிப்பு: படியில் ஒரு ₹10 நாணயம் அல்லது A4 தாளை வைத்தால் AI துல்லியமாக அளவிட உதவும்.",
    
    // Sample Presets
    demoPresets: "மாதிரி புகைப்படங்களை உடனடியாக முயற்சிக்கவும்:",
    sampleSteps: "மாதிரி 1: கிளினிக் (3 படிகள் + ₹10 நாணயம்)",
    sampleRamp: "மாதிரி 2: கைப்பிடி இல்லாத செங்குத்தான சாய்வுப்பாதை",
    sampleAccessible: "மாதிரி 3: படி இல்லாத எளிதான நுழைவாயில்",
    sampleDark: "மாதிரி 4: இருட்டான படம் (பரிசோதனை நிராகரிப்பு)",
    
    // Pre-check
    analyzingImage: "வெளிச்சம் மற்றும் தரத்தை சரிபார்க்கிறது...",
    darkPhotoAlert: "புகைப்படம் மிகவும் இருட்டாக உள்ளது, தயவுசெய்து வெளிச்சத்தில் மீண்டும் எடுக்கவும்.",
    smallPhotoAlert: "புகைப்படம் தெளிவாக இல்லை, தெளிவான படத்தை பதிவேற்றவும்.",
    precheckPassed: "புகைப்படம் தெளிவாக உள்ளது! AI ஆய்வு தொடங்குகிறது...",
    
    // Evidence Screen
    evidenceTitle: "AccessProof உறுதிப்படுத்தல் சரிபார்ப்பு",
    evidenceSubtitle: "நாங்கள் அளவுகளை சுயமாக உருவாக்குவதில்லை. புகைப்படத்தில் தெளிவாக தெரியாத விஷயங்களை உறுதிப்படுத்தவும்:",
    evidenceWhy: "காரணம்:",
    evidenceRequested: "தேவைப்படும் சான்று:",
    optionUploadPhoto: "கூடுதல் புகைப்படம் பதிவேற்று",
    optionMeasurement: "அளவை உள்ளிடவும் (செ.மீ)",
    optionConfirmNoRamp: "'சாய்வுத்தளம் இல்லை' என்பதை உறுதிப்படுத்து",
    optionConfirmOutward: "'கதவு வெளிப்புறமாக திறக்கிறது' என உறுதிப்படுத்து",
    optionSkip: "இப்போதைக்கு தவிர்",
    skipNotice: "தவிர்த்தால் நிலவரம் 'முழுமையடையாதது' என்றே இருக்கும்.",
    reAnalyzeBtn: "சான்றுகளுடன் மீண்டும் ஆய்வு செய்",
    reAnalyzing: "புதிய சான்றுகளுடன் ஆய்வு நடக்கிறது...",
    
    // Report Screen
    statusIncomplete: "ஆய்வு நிலை: முழுமையடையாதது (Incomplete)",
    statusIncompleteDesc: "முக்கியமான சான்றுகள் இன்னும் தேவைப்படுகின்றன. உத்தேச மதிப்பெண் வரம்பு மட்டுமே காட்டப்படுகிறது.",
    statusPartial: "ஆய்வு நிலை: ஓரளவு உறுதிப்படுத்தப்பட்டது (Partially Verified)",
    statusPartialDesc: "சில சான்றுகள் வழங்கப்பட்டுள்ளன. மதிப்பீடு துல்லியமாகியுள்ளது.",
    statusVerified: "ஆய்வு நிலை: பயனர் சான்றுகளால் உறுதிப்படுத்தப்பட்டது",
    statusVerifiedDesc: "அனைத்து முக்கிய அளவுகளும் பயனரால் உறுதிப்படுத்தப்பட்டுள்ளன. (இது சட்டப்பூர்வ சான்றிதழ் அல்ல).",
    provisionalRange: "உத்தேச வரம்பு",
    
    // Personas
    wheelchairUser: "சக்கர நாற்காலி பயன்படுத்துவோர்",
    walkerUser: "வாக்கர் & முதியோர்கள்",
    lowVisionUser: "பார்வைக் குறைபாடு உள்ளவர்கள்",
    accessible: "எளிதாக செல்லலாம்",
    difficult: "சிரமமானது",
    blocked: "தடைபட்டுள்ளது",
    
    // AccessProof 3 Sections
    observedTitle: "நேரில் தெரிபவை (OBSERVED)",
    observedTip: "புகைப்படத்தில் தெளிவாக காணக்கூடிய உண்மை நிலவரங்கள்.",
    needsVerificationTitle: "உறுதிப்படுத்த வேண்டியவை (NEEDS VERIFICATION)",
    needsVerificationTip: "புகைப்படத்தில் தெரியாத கதவு அகலம் அல்லது சாய்வு கோணம்.",
    userConfirmedTitle: "பயனரால் உறுதிப்படுத்தப்பட்டவை (USER-CONFIRMED)",
    userConfirmedTip: "நீங்கள் நேரில் அளந்து அல்லது உறுதிசெய்து அளித்த விவரங்கள்.",
    noUserConfirmed: "இன்னும் விவரங்கள் சேர்க்கப்படவில்லை. 'சான்றுகள்' பகுதிக்குச் சென்று சேர்க்கலாம்.",
    
    // Barriers List
    barriersTitle: "கண்டறியப்பட்ட அணுகல் தடைகள்",
    severity: "தீவிரம்",
    confidence: "நம்பகத்தன்மை",
    estimated: "உத்தேசமானது",
    confirmedByUser: "பயனரால் உறுதிசெய்யப்பட்டது",
    observedTag: "நேரில் தெரிவது",
    whoCanDoIt: "யாரை வைத்து சரிசெய்யலாம்:",
    estimatedFixCost: "உத்தேச செலவு:",
    
    // Fixes Screen
    fixesTitle: "குறைந்த செலவில் நடைமுறை தீர்வுகள்",
    fixesSubtitle: "குறைகளை சொல்வதோடு நிற்காமல், உள்ளூர் ஆட்களைக் கொண்டு எளிதாக சரிசெய்யும் வழிகள்:",
    totalProjectEstimate: "மொத்த உத்தேச திட்டச் செலவு:",
    priority: "முன்னுரிமை",
    localWorkforce: "உள்ளூர் பணியாளர்",
    
    // Letter Generator
    letterTitle: "கட்டட உரிமையாளருக்கான கோரிக்கை கடிதம்",
    letterSubtitle: "கடை அல்லது கட்டட உரிமையாளருக்கு நேரடியாக வாட்ஸ்அப் அல்லது நகல் எடுத்து அனுப்பக்கூடிய பணிவான கடிதம்.",
    editLetter: "கடிதத்தை திருத்து",
    saveLetter: "சேமி",
    copyLetter: "கடிதத்தை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    shareWhatsApp: "வாட்ஸ்அப்பில் பகிருங்கள்",
    whatsAppNotice: "தானாக எதுவும் அனுப்பப்படாது. நீங்கள் சரிபார்த்து அனுப்பலாம்.",
    
    // Voice Walkthrough
    voiceTitle: "என் பாதையை உருவகப்படுத்து (பேச்சு வழிகாட்டல்)",
    voiceSubtitle: "நுழைவாயிலில் ஒருவர் வரும்போது அனுபவிக்கும் சூழ்நிலையை எளிய பேச்சுத் தமிழில் கேளுங்கள்.",
    playVoice: "குரலைக் கேள்",
    pauseVoice: "இடைநிறுத்து",
    resumeVoice: "தொடர்",
    stopVoice: "நிறுத்து",
    voiceUnavailable: "இந்த சாதனத்தில் தமிழ் குரல் வசதி இல்லை. கீழே உள்ள உரையை வாசிக்கவும்.",
    transcriptTitle: "பேச்சு உரை",
    
    // Before / After Comparison
    beforeAfterTitle: "முன்பு & பின்பு ஒப்பீடு",
    beforeAfterSubtitle: "உரிமையாளர் சாய்வுப்பாதை அமைத்துள்ளாரா? முன்னேற்றத்தை அளவிட புதிய புகைப்படத்தை பதிவேற்றுங்கள்!",
    uploadAfterPhoto: "மாற்றத்திற்குப் பின் புதிய புகைப்படம்",
    evaluatingFix: "மேம்பாட்டை ஆய்வு செய்கிறது...",
    improvedBanner: "நுழைவு வசதி மிகச்சிறப்பாக மேம்பட்டுள்ளது!",
    scoreProgression: "மதிப்பெண் முன்னேற்றம்:",
    resolvedNotice: "தடை நீக்கப்பட்டது! சரிசெய்யப்பட்ட தடைகள் எண்ணிக்கையில் +1 சேர்க்கப்பட்டது.",
    
    // Community Map
    mapTitle: "அணுகக்கூடிய இடங்களின் சமூக வரைபடம்",
    mapSubtitle: "நகரின் சரிபார்க்கப்பட்ட கட்டடங்கள். வீட்டை விட்டு கிளம்பும் முன் சரிபாருங்கள்.",
    addCurrentPlace: "இந்த இடத்தை வரைபடத்தில் சேர்",
    placeNamePrompt: "இடத்தின் பெயர் (எ.கா. அப்பல்லோ மருந்தகம், அண்ணா நகர்):",
    placeAdded: "வரைபடத்தில் சேர்க்கப்பட்டது!",
    viewAudit: "விவரங்களை பார்",
    lastChecked: "கடைசியாக சோதித்தது",
    
    // Phone-tilt Slope Reader
    slopeTitle: "மொபைல் சாய்வு அளவி (Ramp Slope Reader)",
    slopeSubtitle: "சாய்வுப்பாதையின் கோணத்தை அளவிட உங்கள் மொபைலை அதன் மேல் தட்டையாக வையுங்கள்.",
    measureSlopeBtn: "சாய்வை அளவிடு",
    calibrating: "அளவிடுகிறது...",
    slopeRatio: "சாய்வு விகிதம்",
    slopeAngle: "கோணம்:",
    adaStandard: "அரசு வழிகாட்டுதல்: அதிகபட்சம் 1:12 (~4.76°). பரிந்துரை: 1:15 முதல் 1:20 வரை.",
    rampCompliant: "இந்த சாய்வுப்பாதை பாதுகாப்பான வரம்பில் உள்ளது (1:12 அல்லது குறைவு).",
    rampTooSteep: "சாய்வு மிகவும் செங்குத்தாக உள்ளது! சக்கர நாற்காலிக்கு ஆபத்தானது.",
    applySlopeToAudit: "இந்த அளவீட்டை ஆய்வில் சேர்",
    slopeSaved: "பயனரால் உறுதிசெய்யப்பட்டதாக (மொபைல் மூலம்) சேர்க்கப்பட்டது.",
    
    // Placard
    placardTitle: "அச்சிடக்கூடிய அணுகல் அட்டை (Placard)",
    placardSubtitle: "கடையின் வாசலில் ஒட்ட அல்லது உரிமையாளரிடம் கொடுக்க அச்சிடுங்கள்.",
    printPlacard: "அச்சிடு",
    
    // Footer & Closing
    disclaimer: "புகைப்படங்களை அடிப்படையாகக் கொண்ட AI மதிப்பீடு. நேரில் சரிபார்க்கவும். இது சட்டப்பூர்வ சான்றிதழ் அல்ல.",
    closingMotto: "நாங்கள் மக்களை கட்டடங்களுக்கு ஏற்ப மாற்றச் சொல்வதில்லை; கட்டடங்களை மக்களுக்கு ஏற்ப மாற்ற உதவுகிறோம்.",
    resetAll: "மற்றொரு நுழைவாயிலை ஆய்வு செய்",
    errorRetry: "மீண்டும் முயற்சி செய்",
  }
};
