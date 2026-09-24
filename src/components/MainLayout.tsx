import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activeMenu: string;
}

interface SubMenu {
  id: string;
  label: string;
  mode: 'single' | 'bulk' | 'compress'; // dibaca oleh halaman lewat ?mode=...
  href: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;         // menu biasa
  children?: SubMenu[];  // menu dropdown
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

const menus: MenuItem[] = [
  { id: 'welcome', label: 'Welcome', href: '/welcome', icon: 'images/mdi-home-variant1.svg' },
  {
    id: 'lact-builder',
    label: 'Tools LACT',
    icon: 'images/audit.png',
    children: [
      { id: 'lact-single', label: 'Upload Satu per Satu', mode: 'single', href: '/lact?mode=single' },
      { id: 'lact-bulk', label: 'Upload Sekaligus', mode: 'bulk', href: '/lact?mode=bulk' },
      { id: 'lact-compress', label: 'Kompres Foto', mode: 'compress', href: '/lact?mode=compress' },
    ],
  },
  {
    id: 'baut-builder',
    label: 'Tools BAUT',
    icon: 'images/audit.png',
    children: [
      { id: 'baut-single', label: 'Upload Satu per Satu', mode: 'single', href: '/baut?mode=single' },
      { id: 'baut-bulk', label: 'Upload Sekaligus', mode: 'bulk', href: '/baut?mode=bulk' },
      { id: 'baut-compress', label: 'Kompres Foto', mode: 'compress', href: '/baut?mode=compress' },
    ],
  },
];

export default function MainLayout({ children, pageTitle, activeMenu }: MainLayoutProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get('mode') ?? 'single';
  const current = menus.find((m) => m.id === activeMenu);

  // Dropdown yang terbuka: otomatis membuka menu dari halaman yang sedang aktif
  const [openId, setOpenId] = useState<string | null>(activeMenu);
  useEffect(() => {
    setOpenId(activeMenu);
  }, [activeMenu]);

  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <div className="header-brand">
          <img src={asset('images/logo-TA.svg')} alt="Telkom Akses" className="header-logo" />
        </div>
        <div className="header-status-area">
          <div className="profile-badge">LACT</div>
        </div>
      </header>

      <div className="layout-body">
        <img className="body-bg-map" src={asset('images/peta-dunia.png')} alt="Peta" />

        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            {menus.map((m) => {
              // ---------- Menu biasa (Welcome) ----------
              if (!m.children) {
                const active = activeMenu === m.id;
                return (
                  <div
                    key={m.id}
                    className={`nav-item ${active ? 'active' : ''}`}
                    onClick={() => m.href && navigate(m.href)}
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
              }

              // ---------- Menu dropdown (Tools LACT / Tools BAUT) ----------
              const isOpen = openId === m.id;
              const isParentActive = activeMenu === m.id;
              return (
                <div key={m.id}>
                  <div
                    className={`nav-item ${isParentActive ? 'active-parent' : ''}`}
                    onClick={() => setOpenId(isOpen ? null : m.id)}
                  >
                    <img src={asset(m.icon)} alt={m.label} className="nav-icon" />
                    <span className="nav-label">{m.label}</span>
                    <span className={`nav-chevron ${isOpen ? 'open' : ''}`}>▾</span>
                  </div>

                  <div className={`sub-menu-container ${isOpen ? 'open' : ''}`}>
                    {m.children.map((c) => {
                      const subActive = isParentActive && currentMode === c.mode;
                      return (
                        <div
                          key={c.id}
                          className={`sub-menu-item ${subActive ? 'active' : ''}`}
                          onClick={() => navigate(c.href)}
                        >
                          {c.label}
                        </div>
                      );
                    })}
                  </div>
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