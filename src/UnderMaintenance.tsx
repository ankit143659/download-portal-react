import React, { useState } from 'react';
import { Wrench, RefreshCw, Cpu, Server, CheckCircle2 } from 'lucide-react';

export const UnderMaintenance: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <main className="portal-container" style={{ maxWidth: '580px', margin: 'auto' }}>
        <header className="portal-header">
          <div 
            className="logo-badge" 
            style={{ 
              background: 'rgba(234, 179, 8, 0.12)', 
              borderColor: 'rgba(234, 179, 8, 0.3)', 
              color: '#facc15',
              boxShadow: '0 0 20px rgba(234, 179, 8, 0.15)' 
            }}
          >
            <Wrench size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>System Maintenance</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Under Maintenance
          </h1>
          <p className="portal-subtitle" style={{ fontSize: '0.98rem', lineHeight: '1.6' }}>
            Our Download Portal & Licensing Servers are currently undergoing scheduled upgrades to improve system performance and security.
          </p>
        </header>

        <section className="card glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Glowing Top Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #eab308, #a855f7, transparent)',
          }}></div>

          {/* Animated Graphic / Gear aura */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0 25px 0' }}>
            <div style={{
              position: 'relative',
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(234, 179, 8, 0.15)'
            }}>
              <Server size={40} style={{ color: '#eab308' }} />
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                background: '#0a0b10',
                borderRadius: '50%',
                padding: '6px',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={18} style={{ color: '#a855f7' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '26px' }}>
            {/* Status Item 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#eab308',
                  boxShadow: '0 0 10px #eab308'
                }}></span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>Download Portal Upgrade</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#facc15', fontWeight: 600, background: 'rgba(234,179,8,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                In Progress
              </span>
            </div>

            {/* Status Item 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>Security Infrastructure</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                Active
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '22px' }}>
            We apologize for the temporary inconvenience. Please check back shortly.
          </p>

          <button 
            className="btn-primary" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Checking Status...' : 'Check Server Status'}</span>
          </button>
        </section>
      </main>

      <footer className="portal-footer">
        <p>&copy; 2026 App Download Center. All rights reserved.</p>
      </footer>
    </>
  );
};

export default UnderMaintenance;
