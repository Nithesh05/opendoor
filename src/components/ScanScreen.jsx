import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Coins, FileText, AlertCircle, RefreshCw, Trash2, CheckCircle2, Volume2, Sparkles } from 'lucide-react';

export default function ScanScreen({
  onImageSelected,
  loading,
  error,
  referenceObject,
  setReferenceObject,
  highContrast,
  lang,
  t
}) {
  const [preview, setPreview] = useState(null);
  const [preCheckError, setPreCheckError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera stream when unmounting
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Audio speech alert for precheck rejection
  const speakAlert = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Perform canvas brightness & dimension check
  const runPreCheck = (imageElement, dataUrl) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = imageElement.naturalWidth || imageElement.width || 300;
    const h = imageElement.naturalHeight || imageElement.height || 300;

    canvas.width = Math.min(w, 200);
    canvas.height = Math.min(h, 200);
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    if (w < 120 || h < 120) {
      const msg = t.smallPhotoAlert;
      setPreCheckError(msg);
      speakAlert(msg);
      return false;
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let totalBrightness = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Standard luminance formula
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += luminance;
    }

    const avgBrightness = totalBrightness / totalPixels;
    console.log(`Canvas pre-check: average brightness = ${avgBrightness.toFixed(1)} / 255`);

    // Darkness threshold: < 35 is too dark
    if (avgBrightness < 35) {
      const msg = t.darkPhotoAlert;
      setPreCheckError(msg);
      speakAlert(msg);
      return false;
    }

    setPreCheckError(null);
    return true;
  };

  const processImageFile = (file) => {
    setPreCheckError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const passed = runPreCheck(img, dataUrl);
        setPreview(dataUrl);
        if (passed) {
          onImageSelected(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  // Live Camera integration
  const startCamera = async () => {
    setPreCheckError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera stream error, falling back to file input:', err);
      // Fallback to native capture input
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setIsCameraOpen(false);

      const img = new Image();
      img.onload = () => {
        const passed = runPreCheck(img, dataUrl);
        setPreview(dataUrl);
        if (passed) {
          onImageSelected(dataUrl);
        }
      };
      img.src = dataUrl;
    }
  };

  const cancelCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  // Load Preset Samples (Critical for Demo Video!)
  const loadPreset = async (presetPath, refObj) => {
    setPreCheckError(null);
    setReferenceObject(refObj);
    try {
      const response = await fetch(presetPath);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const passed = runPreCheck(img, dataUrl);
          setPreview(dataUrl);
          if (passed) {
            onImageSelected(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample:', err);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    setPreCheckError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Title & Tagline */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          {t.scanTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
          {t.scanSubtitle}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        aria-label="Upload photo file"
      />
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Reference Object Selection */}
      <div
        className={`mb-6 p-4 rounded-2xl border transition-colors ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
        }`}
      >
        <label htmlFor="ref-obj-select" className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{t.scaleReference}</span>
        </label>
        <select
          id="ref-obj-select"
          value={referenceObject}
          onChange={(e) => setReferenceObject(e.target.value)}
          className={`w-full p-3 rounded-xl text-sm font-semibold border transition-all min-h-[48px] ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400 focus:ring-2 focus:ring-yellow-400'
              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500'
          }`}
        >
          <option value="none">{t.refNone}</option>
          <option value="coin">{t.refCoin}</option>
          <option value="a4">{t.refA4}</option>
          <option value="door">{t.refDoor}</option>
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-600" />
          <span>{t.scaleTip}</span>
        </p>
      </div>

      {/* Camera Live Stream View */}
      {isCameraOpen ? (
        <div className="mb-6 rounded-2xl overflow-hidden border-2 border-teal-500 bg-black relative shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-80 object-cover"
          />
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full shadow-lg flex items-center gap-2 min-h-[48px]"
            >
              <Camera className="w-5 h-5" />
              <span>{t.capture}</span>
            </button>
            <button
              type="button"
              onClick={cancelCamera}
              className="px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-white rounded-full font-semibold min-h-[48px]"
            >
              {t.cancelCamera}
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={startCamera}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 min-h-[56px] ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-500/25'
            }`}
          >
            <Camera className="w-6 h-6" aria-hidden="true" />
            <span>{t.takePhoto}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base border-2 transition-all transform active:scale-95 flex items-center justify-center gap-3 min-h-[56px] ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400/20'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
            }`}
          >
            <Upload className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>{t.uploadPhoto}</span>
          </button>
        </div>
      )}

      {/* Photo Pre-Check Error Alert */}
      {preCheckError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-500 text-red-900 dark:text-red-200 flex items-start gap-3 shadow-md"
        >
          <AlertCircle className="w-6 h-6 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm sm:text-base">Photo Pre-Check Failed</h3>
            <p className="text-xs sm:text-sm mt-1">{preCheckError}</p>
            <p className="text-xs mt-2 text-red-700 dark:text-red-300 font-semibold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Spoken aloud via audio feedback. AI analysis was blocked to prevent inaccurate results.
            </p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 text-center animate-pulse"
        >
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-base text-teal-900 dark:text-teal-200">
            {t.precheckPassed}
          </h3>
          <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
            Separating observed facts from items needing verification...
          </p>
        </div>
      )}

      {/* API Error Alert */}
      {error && !loading && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-amber-900 dark:text-amber-200 flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm">{error}</h3>
            <button
              type="button"
              onClick={() => preview && onImageSelected(preview)}
              className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
            >
              {t.errorRetry}
            </button>
          </div>
        </div>
      )}

      {/* Active Photo Thumbnail Preview */}
      {preview && !loading && (
        <div className="mb-8 p-4 rounded-2xl border bg-white dark:bg-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Active Entrance Photo
            </span>
            <button
              type="button"
              onClick={clearPhoto}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 p-1"
              aria-label="Delete local thumbnail"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
          <img
            src={preview}
            alt="Uploaded entrance preview"
            className="w-full h-64 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
          />
        </div>
      )}

      {/* Demo Presets Bar (For 3-minute Hackathon Video Demo!) */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
        }`}
      >
        <span className="block text-xs font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
          {t.demoPresets}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => loadPreset('/samples/clinic_three_steps.jpg', 'coin')}
            className={`p-3 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2.5 min-h-[48px] ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                : 'bg-white dark:bg-slate-800 hover:border-teal-500 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span>{t.sampleSteps}</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('/samples/clinic_after_ramp.jpg', 'none')}
            className={`p-3 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2.5 min-h-[48px] ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                : 'bg-white dark:bg-slate-800 hover:border-teal-500 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span>{t.sampleAccessible}</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('/samples/doorway_85cm.jpg', 'none')}
            className={`p-3 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2.5 min-h-[48px] ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                : 'bg-white dark:bg-slate-800 hover:border-teal-500 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
            <span>Doorway Front View (85 cm Tape)</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('/samples/too_dark.png', 'none')}
            className={`p-3 rounded-xl text-left text-xs font-bold border transition-all flex items-center gap-2.5 min-h-[48px] ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                : 'bg-white dark:bg-slate-800 hover:border-red-500 text-red-600 dark:text-red-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span>{t.sampleDark}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
