import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { 
  Cloud, 
  CloudOff, 
  Database, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertTriangle,
  RefreshCw,
  Upload,
  Download,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const FirebaseSyncModal = ({ isOpen, onClose }) => {
  const {
    syncId,
    setSyncId,
    activeConfig,
    dbStatus,
    saveCustomFirebaseConfig,
    clearFirebaseConfig,
    uploadLocalDataToCloud,
    downloadCloudDataToLocal
  } = useContext(AppContext);

  // Form states
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [inputSyncId, setInputSyncId] = useState(syncId);
  const [rawJsonConfig, setRawJsonConfig] = useState('');

  // Status and feedback states
  const [isTesting, setIsTesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('status'); // 'status' | 'configure' | 'sync' | 'help'

  // Load active config if it exists
  useEffect(() => {
    if (activeConfig) {
      setApiKey(activeConfig.apiKey || '');
      setAuthDomain(activeConfig.authDomain || '');
      setProjectId(activeConfig.projectId || '');
      setStorageBucket(activeConfig.storageBucket || '');
      setMessagingSenderId(activeConfig.messagingSenderId || '');
      setAppId(activeConfig.appId || '');
    }
    setInputSyncId(syncId);
  }, [activeConfig, syncId, isOpen]);

  // Attempt to parse pasted JSON config block automatically
  const handleJsonPaste = (e) => {
    const value = e.target.value;
    setRawJsonConfig(value);

    if (!value.trim()) return;

    try {
      // Try cleaning the input to make it valid JSON
      // (Firebase config objects pasted directly from JS can look like `{ apiKey: "..." }` instead of strict JSON)
      let cleaned = value
        .trim()
        // remove JS comments
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
        // remove trailing commas
        .replace(/,(\s*})/g, '$1')
        // quote unquoted object keys
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        // replace single quotes with double quotes
        .replace(/:\s*'([^']*)'/g, ':"$1"');

      // Extract details using regex if parsing fails
      let parsed = {};
      try {
        parsed = JSON.parse(cleaned);
      } catch (jsonErr) {
        // Fallback: Regex extraction
        const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        keys.forEach(k => {
          const regex = new RegExp(`${k}\\s*:\\s*["']([^"']+)["']`);
          const match = value.match(regex);
          if (match && match[1]) {
            parsed[k] = match[1];
          }
        });
      }

      if (parsed.apiKey && parsed.projectId) {
        setApiKey(parsed.apiKey || '');
        setAuthDomain(parsed.authDomain || '');
        setProjectId(parsed.projectId || '');
        setStorageBucket(parsed.storageBucket || '');
        setMessagingSenderId(parsed.messagingSenderId || '');
        setAppId(parsed.appId || '');
        setSuccessMessage('✓ Firebase config parsed successfully!');
        setErrorMessage('');
        // Reset JSON field after successful parse
        setRawJsonConfig('');
      } else {
        setErrorMessage('Could not extract Firebase keys. Please verify config format or enter fields manually.');
      }
    } catch (err) {
      setErrorMessage('Could not parse Firebase config block. Try entering the fields manually.');
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsTesting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const config = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };

    const result = await saveCustomFirebaseConfig(config, inputSyncId.trim());

    setIsTesting(false);
    if (result.success) {
      setSuccessMessage('✓ Connected successfully! Data synced to cloud.');
      setTab('status');
    } else {
      setErrorMessage(result.message || 'Failed to connect. Please check credentials and security rules.');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect cloud database? Your data will remain offline in this browser.')) {
      clearFirebaseConfig();
      setApiKey('');
      setAuthDomain('');
      setProjectId('');
      setStorageBucket('');
      setMessagingSenderId('');
      setAppId('');
      setSuccessMessage('Cloud database disconnected. Reverted to offline Local Storage.');
      setTab('configure');
    }
  };

  const handleCopySyncId = () => {
    navigator.clipboard.writeText(syncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomSyncId = () => {
    const newId = `mayur-sync-${Math.floor(1000 + Math.random() * 9000)}`;
    setInputSyncId(newId);
  };

  // Migration Handlers
  const [migrationStatus, setMigrationStatus] = useState('');
  
  const handleUpload = async () => {
    if (window.confirm('Upload local data to the Cloud? This will overwrite the Firestore cloud document for Sync ID: ' + syncId)) {
      setMigrationStatus('uploading');
      const res = await uploadLocalDataToCloud();
      if (res.success) {
        setMigrationStatus('success_upload');
        setTimeout(() => setMigrationStatus(''), 3000);
      } else {
        setMigrationStatus('error');
        setErrorMessage(res.message);
      }
    }
  };

  const handleDownload = async () => {
    if (window.confirm('Download cloud data to this device? This will overwrite your current browser data.')) {
      setMigrationStatus('downloading');
      const res = await downloadCloudDataToLocal();
      if (res.success) {
        setMigrationStatus('success_download');
        setTimeout(() => setMigrationStatus(''), 3000);
      } else {
        setMigrationStatus('error');
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="glass-panel w-full max-w-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] bg-[#0F1117]/95"
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-luxuryTeal to-luxuryGold/20">
                  <Database className="w-5 h-5 text-luxuryTeal" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-wide">Cloud Database Sync</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Persistence Dashboard</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation tabs */}
            <div className="flex border-b border-white/5 bg-white/[0.01] text-xs font-mono">
              <button
                onClick={() => setTab('status')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  tab === 'status' ? 'border-luxuryTeal text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setTab('configure')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  tab === 'configure' ? 'border-luxuryTeal text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Configure Connection
              </button>
              <button
                onClick={() => setTab('sync')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  tab === 'sync' ? 'border-luxuryTeal text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Migration
              </button>
              <button
                onClick={() => setTab('help')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  tab === 'help' ? 'border-luxuryTeal text-white bg-white/[0.02]' : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Guide
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
              
              {/* Notifications / Feedback */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2.5 text-emerald-300 text-xs">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* TAB 1: STATUS */}
              {tab === 'status' && (
                <div className="space-y-6">
                  
                  {/* Status Banner */}
                  <div className="glass-panel p-5 border-white/5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Glowing Accent */}
                    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[40px] pointer-events-none ${
                      dbStatus === 'connected' ? 'bg-emerald-500/15' : dbStatus === 'connecting' ? 'bg-cyan-500/10' : 'bg-amber-500/10'
                    }`} />
                    
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg relative z-10 ${
                      dbStatus === 'connected' 
                        ? 'bg-emerald-500 text-darkBg' 
                        : dbStatus === 'connecting' 
                          ? 'bg-cyan-500 text-darkBg animate-spin-slow' 
                          : 'bg-white/5 text-white/40'
                    }`}>
                      {dbStatus === 'connected' ? (
                        <Cloud className="w-6 h-6 stroke-[2.5]" />
                      ) : dbStatus === 'connecting' ? (
                        <RefreshCw className="w-6 h-6 stroke-[2.5]" />
                      ) : (
                        <CloudOff className="w-6 h-6" />
                      )}
                    </div>

                    <h4 className="font-bold text-lg text-white relative z-10">
                      {dbStatus === 'connected' && 'Cloud Synchronization Active'}
                      {dbStatus === 'connecting' && 'Establishing Connection...'}
                      {dbStatus === 'disconnected' && 'Connection Interrupted'}
                      {dbStatus === 'local' && 'Offline Local Storage Mode'}
                    </h4>
                    
                    <p className="text-xs text-white/40 mt-1 max-w-sm leading-relaxed relative z-10">
                      {dbStatus === 'connected' && 'Your diet planner, water intake, checklists, and calorie metrics are continuously saving to Firestore in real time.'}
                      {dbStatus === 'connecting' && 'Testing connections and fetching data indices from Google Firebase Servers...'}
                      {dbStatus === 'disconnected' && 'The custom configuration failed to reach Firestore. Check credentials, rules, or network connectivity.'}
                      {dbStatus === 'local' && 'Your logs are saved locally in the browser cache. If you clean browser cookies or switch devices, data resets.'}
                    </p>
                  </div>

                  {/* Sync ID Details */}
                  <div className="glass-panel p-4 border-white/5 rounded-xl space-y-3.5">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-white/30 tracking-widest font-mono uppercase">Your Personal Sync ID</span>
                        <div className="font-mono text-sm text-luxuryGold font-semibold select-all">
                          {syncId}
                        </div>
                      </div>
                      <button
                        onClick={handleCopySyncId}
                        className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-white/40 leading-relaxed border-t border-white/5 pt-3 flex items-start space-x-2">
                      <Info className="w-3.5 h-3.5 text-luxuryTeal shrink-0 mt-0.5" />
                      <span>
                        <strong>Multi-Device Access:</strong> Input this exact Firebase Configuration and Sync ID on your phone or tablet to sync and edit your food log in real-time from anywhere.
                      </span>
                    </div>
                  </div>

                  {dbStatus === 'connected' && (
                    <button
                      onClick={handleDisconnect}
                      className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl py-3 text-xs font-semibold tracking-wide transition-all"
                    >
                      Disconnect Cloud Database
                    </button>
                  )}
                </div>
              )}

              {/* TAB 2: CONFIGURE */}
              {tab === 'configure' && (
                <form onSubmit={handleConnect} className="space-y-5">
                  
                  {/* Option A: JS Code Block Paste */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-white/75 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-luxuryGold" />
                        <span>Paste Firebase SDK Config (Fastest)</span>
                      </label>
                      <span className="text-[10px] text-white/30">Auto-Extracts fields</span>
                    </div>
                    <textarea
                      value={rawJsonConfig}
                      onChange={handleJsonPaste}
                      placeholder={`Paste config here e.g.:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mayurs-diet.firebaseapp.com",
  projectId: "mayurs-diet",
  ...
};`}
                      rows="4"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 font-mono focus:outline-none focus:border-luxuryTeal/40 focus:ring-1 focus:ring-luxuryTeal/20 resize-none"
                    />
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-white/20 uppercase tracking-widest font-mono">or enter fields manually</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Option B: Standard manual fields */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-white/60">API Key *</label>
                      <input
                        type="text"
                        required
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-white/60">Project ID *</label>
                      <input
                        type="text"
                        required
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        placeholder="mayurs-nutrition-lab"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/60">Auth Domain</label>
                      <input
                        type="text"
                        value={authDomain}
                        onChange={(e) => setAuthDomain(e.target.value)}
                        placeholder="project-id.firebaseapp.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/60">Storage Bucket</label>
                      <input
                        type="text"
                        value={storageBucket}
                        onChange={(e) => setStorageBucket(e.target.value)}
                        placeholder="project-id.appspot.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/60">App ID</label>
                      <input
                        type="text"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="1:12345:web:abcd"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                      />
                    </div>
                  </div>

                  {/* Sync ID Setup */}
                  <div className="space-y-1.5 text-xs pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-white/60 font-semibold">Cloud Sync Room ID (Data Isolation)</label>
                      <button
                        type="button"
                        onClick={generateRandomSyncId}
                        className="text-luxuryTeal hover:text-cyan-300 font-mono text-[10px] tracking-wider"
                      >
                        [GENERATE RANDOM]
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={inputSyncId}
                      onChange={(e) => setInputSyncId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="e.g. mayurs_diet"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs placeholder-white/20 focus:outline-none focus:border-luxuryTeal/40"
                    />
                    <p className="text-[10px] text-white/30">Allows syncing databases across different devices. Use a unique name.</p>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={isTesting}
                      className="flex-1 bg-luxuryTeal hover:bg-cyan-500 disabled:bg-white/5 disabled:text-white/30 text-darkBg text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting & Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Test & Connect Database</span>
                        </>
                      )}
                    </button>
                    {activeConfig && (
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        className="bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 border border-white/5 hover:text-rose-300 px-4 rounded-xl text-xs text-white/65 font-medium transition-all"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 3: MIGRATION */}
              {tab === 'sync' && (
                <div className="space-y-6">
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/50 leading-relaxed flex items-start space-x-2.5">
                    <Info className="w-4.5 h-4.5 text-luxuryGold shrink-0 mt-0.5" />
                    <span>
                      When changing configurations, you can choose to either sync your current device's local logs up to the cloud, or download cloud database logs down to overwrite your browser.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Upload Device -> Cloud */}
                    <div className="glass-panel p-5 border-white/5 rounded-xl flex flex-col justify-between items-start space-y-4">
                      <div>
                        <div className="p-2 bg-luxuryTeal/10 rounded-lg text-luxuryTeal mb-3">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-white text-sm">Upload Local to Cloud</h5>
                        <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                          Overwrites the cloud database document with your device's current diet list, calories, and plans. Use this when you have local logs you want to publish.
                        </p>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={dbStatus !== 'connected' || migrationStatus === 'uploading'}
                        className="w-full bg-luxuryTeal hover:bg-cyan-500 text-darkBg text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {migrationStatus === 'uploading' ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : migrationStatus === 'success_upload' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {migrationStatus === 'uploading' && 'Uploading...'}
                          {migrationStatus === 'success_upload' && 'Uploaded ✓'}
                          {migrationStatus !== 'uploading' && migrationStatus !== 'success_upload' && 'Upload Data'}
                        </span>
                      </button>
                    </div>

                    {/* Download Cloud -> Device */}
                    <div className="glass-panel p-5 border-white/5 rounded-xl flex flex-col justify-between items-start space-y-4">
                      <div>
                        <div className="p-2 bg-luxuryGold/10 rounded-lg text-luxuryGold mb-3">
                          <Download className="w-5 h-5" />
                        </div>
                        <h5 className="font-bold text-white text-sm">Download Cloud to Local</h5>
                        <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                          Overwrites your device's active local planner and macros with whatever is currently stored on Firestore. Use this to pull logs onto a new browser.
                        </p>
                      </div>

                      <button
                        onClick={handleDownload}
                        disabled={dbStatus !== 'connected' || migrationStatus === 'downloading'}
                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {migrationStatus === 'downloading' ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : migrationStatus === 'success_download' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {migrationStatus === 'downloading' && 'Downloading...'}
                          {migrationStatus === 'success_download' && 'Downloaded ✓'}
                          {migrationStatus !== 'downloading' && migrationStatus !== 'success_download' && 'Download Data'}
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: HELP GUIDE */}
              {tab === 'help' && (
                <div className="space-y-4 text-xs leading-relaxed text-white/60">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <HelpCircle className="w-4.5 h-4.5 text-luxuryTeal" />
                    <span>How to set up your free Firestore Database</span>
                  </h4>
                  
                  <ol className="list-decimal pl-4 space-y-3 pt-1">
                    <li>
                      Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-luxuryTeal hover:underline inline-flex items-center space-x-0.5"><span>Firebase Console</span><ExternalLink className="w-3 h-3" /></a> and click <strong>Create Project</strong>. Give it a name (e.g. <em>MyMayurApp</em>).
                    </li>
                    <li>
                      In the left sidebar, expand <strong>Build</strong> and click <strong>Firestore Database</strong>. Then click <strong>Create Database</strong>.
                    </li>
                    <li>
                      Choose <strong>Start in Test Mode</strong> (this allows public read/writes for dev/testing so your browser can communicate directly with it). Choose a database server location near you.
                    </li>
                    <li>
                      Click <strong>Project Settings</strong> (gear icon next to Project Overview) &rarr; scroll down to <strong>Your Apps</strong> &rarr; click the <strong>Web App code icon (&lt;/&gt;)</strong> &rarr; register app name &rarr; copy the config object.
                    </li>
                    <li>
                      Return here, paste the copied configuration block under the <strong>Configure</strong> tab, enter a Sync Room name of your choice, and hit <strong>Connect</strong>. Done!
                    </li>
                  </ol>

                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-300/80 leading-normal mt-5">
                    <strong>Note:</strong> Firestore security rules default to 30 days of open access in Test Mode. If you want permanent synchronization, configure your Firestore database rules to:
                    <pre className="mt-1 bg-black/45 p-2 rounded-lg text-[10px] font-mono text-white/50 leading-normal select-all">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /user_data/{document} {
      allow read, write: if true;
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-xs text-white/30">
              <span>Database Status: <strong className={`font-semibold ${dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>{dbStatus.toUpperCase()}</strong></span>
              <button 
                onClick={onClose}
                className="bg-white/5 hover:bg-white/10 text-white/80 font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Done
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
