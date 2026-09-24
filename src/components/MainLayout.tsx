import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activeMenu: string;
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

const menus = [
  { id: 'welcome', label: 'Welcome', href: '/welcome', icon: 'images/mdi-home-variant1.svg' },
  { id: 'lact-builder', label: 'Buat LACT', href: '/lact', icon: 'images/audit.png' },
];

export default function MainLayout({ children, pageTitle, activeMenu }: MainLayoutProps) {
  const navigate = useNavigate();
  const current = menus.find((m) => m.id === activeMenu);

  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <div className="header-status-area">
          <div className="profile-badge">LACT</div>
        </div>
      </header>

      <div className="layout-body">
        <img className="body-bg-map" src={asset('images/peta-dunia.png')} alt="Peta" />

        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            {menus.map((m) => {
              const active = activeMenu === m.id;
              return (
                <div
                  key={m.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(m.href)}
                >
                  <img
                    src={asset(m.icon)}
                    alt={m.label}
                    className="nav-icon"
                    style={{ filter: active ? 'brightness(0) invert(1)' : 'none' }}
                  />
                  <span className="nav-label">{m.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="layout-content">
          {activeMenu !== 'welcome' && (
            <div className="feature-page-header">
              {current && <img src={asset(current.icon)} alt="" className="feature-page-icon" />}
              <h2 className="feature-page-title">{pageTitle}</h2>
            </div>
          )}
          <div className="feature-page-content">{children}</div>
        </main>
      </div>

      <footer className="layout-footer">
        <div className="footer-left">
          © 2026 Telkom Akses | LACT Evidence Builder | Developed by{' '}
          <span className="text-red">Kerja Praktek</span>
        </div>
        <div className="footer-center"></div>
        <div className="footer-right"></div>
      </footer>
    </div>
  );
}