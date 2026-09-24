import React from 'react';
import MainLayout from '../components/MainLayout';
import '../assets/vars_Welcome.css';

const Welcome: React.FC = () => {
  return (
    <MainLayout activeMenu="welcome" pageTitle="Welcome">
      <div className="welcome-container">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to</h1>
          <img
            src={`${import.meta.env.BASE_URL}images/Logo-TA-New2.png`}
            alt="Telkom Akses"
            className="welcome-center-icon"
          />
          <p className="welcome-desc">
            Aplikasi untuk menyusun lampiran evidence foto Laporan Commissioning Test (LACT).
            Isi data proyek, unggah foto di setiap template evidence, lalu unduh hasilnya
            sebagai PDF yang ukurannya sudah dikompres.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Welcome;