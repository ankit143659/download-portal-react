import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Key, Download, Check, AlertCircle, Upload, LogOut } from 'lucide-react';

interface AppData {
  appName: string;
  version: string;
  description: string;
  size: string;
}

function App() {
  const [key, setKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Upload States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // ── KEY VERIFICATION HANDLER ─────────────────────────────────────────────
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setError('Please enter a valid key.');
      triggerShake();
      return;
    }

    setLoading(true);
    setError(null);
    setAppData(null);
    setIsAdmin(false);

    try {
      const isCustomUrl = window.location.pathname.toLowerCase().includes('custom') || window.location.search.toLowerCase().includes('custom');

      const response = await fetch('/api/download-portal/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: trimmedKey, isCustom: isCustomUrl }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.isAdmin) {
          setIsAdmin(true);
        } else {
          setAppData(result.app);
        }
      } else {
        setError(result.error || 'Verification failed. Please check your key.');
        triggerShake();
      }
    } catch (err) {
      console.error('API Verification error:', err);
      setError('Server connection error. Please try again later.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── SECURE DOWNLOAD TRIGGER ──────────────────────────────────────────────
  const handleDownload = () => {
    if (!key) {
      setError('Verification session expired. Please re-verify your key.');
      setAppData(null);
      return;
    }

    // Redirect the browser window to trigger the attachment download API
    const isCustomUrl = window.location.pathname.toLowerCase().includes('custom') || window.location.search.toLowerCase().includes('custom');
    const downloadUrl = `/api/download-portal/download/${encodeURIComponent(key.trim())}${isCustomUrl ? '?custom=true' : ''}`;
    window.location.href = downloadUrl;
  };

  // ── ADMIN FILE UPLOAD HANDLER ────────────────────────────────────────────
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadSuccess(null);
      setUploadError(null);
      setUploadProgress(null);
    }
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file to upload first.');
      return;
    }

    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('password', key.trim());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/download-portal/upload', true);
    xhr.setRequestHeader('X-Admin-Password', key.trim());

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setUploadProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          if (result.success) {
            setUploadSuccess(result.message || 'File uploaded successfully!');
            setUploadFile(null);
            // Clear file input element
            const fileInput = document.getElementById('adminFileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          } else {
            setUploadError(result.error || 'Failed to upload file.');
          }
        } catch (err) {
          setUploadError('Failed to parse server response.');
        }
      } else {
        try {
          const result = JSON.parse(xhr.responseText);
          setUploadError(result.error || 'Failed to upload file.');
        } catch (err) {
          setUploadError(`Server returned status code ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadProgress(null);
      setUploadError('Server communication error during file upload.');
    };

    xhr.send(formData);
  };

  // ── LOGOUT / RESET HANDLER ───────────────────────────────────────────────
  const handleLogout = () => {
    setKey('');
    setIsAdmin(false);
    setAppData(null);
    setUploadFile(null);
    setUploadSuccess(null);
    setUploadError(null);
    setError(null);
  };

  // ── HELPER UTILITIES ─────────────────────────────────────────────────────
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <>
      {/* Ambient background elements for rich aesthetic depth */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <main className="portal-container">
        <header className="portal-header">
          <div className="logo-badge">
            <Key size={12} style={{ marginRight: '4px' }} /> SECURE PORTAL
          </div>
          <h1>Software Download Center</h1>
          <p className="portal-subtitle">
            Enter your access key below to verify your license and retrieve your application bundle.
          </p>
        </header>

        {/* Key Entry Card */}
        {!isAdmin && (
          <section className={`card glass-card ${shake ? 'shake' : ''}`} id="keyVerificationCard">
            <form onSubmit={handleVerify} noValidate>
              <div className="input-group">
                <label htmlFor="accessKeyInput" className="input-label">License Access Key</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="accessKeyInput"
                    placeholder="e.g., ELEVEN-PREM-XXXX"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    autoComplete="off"
                    disabled={loading}
                    required
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <button type="submit" id="verifyKeyButton" className={`btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loader-spinner" id="btnSpinner"></span>
                    <span className="btn-text">Verifying...</span>
                  </>
                ) : (
                  <span className="btn-text">Verify & Retrieve</span>
                )}
              </button>
            </form>

            {/* Status Messages */}
            {error && (
              <div id="statusMessage" className="status-box error" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </section>
        )}

        {/* Client-Side Download Card */}
        {!isAdmin && appData && (
          <section className="card glass-card result-card" id="downloadAppCard">
            <div className="success-badge">
              <Check size={14} className="checkmark-icon" strokeWidth={3} />
              <span>License Verified</span>
            </div>

            <div className="product-info">
              <h2 id="appName" className="product-title">{appData.appName}</h2>
              <div className="meta-row">
                <span className="badge badge-version" id="appVersion">Version {appData.version}</span>
                <span className="badge badge-size" id="appSize">{appData.size}</span>
              </div>
              <p id="appDescription" className="product-desc">{appData.description}</p>
            </div>

            <div className="action-divider"></div>

            <button id="downloadButton" className="btn-download" onClick={handleDownload}>
              <Download size={20} className="download-icon" strokeWidth={2.5} />
              <span className="btn-text">Download Application</span>
            </button>
            
            <p className="security-disclaimer">
              Downloaded files are secured and scanned for threats. Do not share your access key.
            </p>
          </section>
        )}

        {/* TWIST: Admin File Upload Card */}
        {isAdmin && (
          <section className="card glass-card result-card" id="adminUploadCard">
            <div className="success-badge" style={{ color: 'var(--accent)', borderColor: 'rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.1)' }}>
              <Upload size={14} className="checkmark-icon" />
              <span>Admin Access Verified</span>
            </div>

            <div className="product-info">
              <h2 className="product-title">Server Upload Center</h2>
              <p className="product-desc">
                Upload new application packages directly to the server's <code>downloads/</code> folder. If the folder does not exist, it will be automatically created.
              </p>
            </div>

            <div className="action-divider"></div>

            <form onSubmit={handleUploadSubmit} className="product-info" style={{ gap: '15px' }}>
              <div className="input-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="adminFileInput" className="input-label">Select Package File (.zip, etc.)</label>
                <div className="input-wrapper">
                  <input
                    type="file"
                    id="adminFileInput"
                    onChange={handleFileChange}
                    style={{ padding: '12px' }}
                    disabled={uploading}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={uploading || !uploadFile}>
                {uploading ? (
                  <>
                    <span className="loader-spinner"></span>
                    <span>Uploading Package...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload to Server</span>
                  </>
                )}
              </button>

              {uploadProgress !== null && (
                <div className="upload-progress-container" style={{ marginTop: '10px', width: '100%' }}>
                  <div className="upload-progress-bar-bg" style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div className="upload-progress-bar-fill" style={{ background: 'var(--accent)', height: '100%', width: `${uploadProgress}%`, transition: 'width 0.2s ease-out' }}></div>
                  </div>
                  <div className="upload-progress-text" style={{ fontSize: '12px', marginTop: '4px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    Uploading: {uploadProgress}%
                  </div>
                </div>
              )}
            </form>

            {uploadSuccess && (
              <div className="status-box success" role="alert">
                <Check size={16} style={{ flexShrink: 0 }} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="status-box error" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="action-divider"></div>

            <button className="btn-download" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }} onClick={handleLogout}>
              <LogOut size={16} />
              <span>Exit Admin Mode</span>
            </button>
          </section>
        )}
      </main>

      <footer className="portal-footer">
        <p>&copy; 2026 App Download Center. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
