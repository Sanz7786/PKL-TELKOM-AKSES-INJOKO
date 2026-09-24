import React from 'react';
import MainLayout from '../components/MainLayout';
import '../assets/vars_Welcome.css';

const Welcome: React.FC = () => {
  return (
    <MainLayout activeMenu="welcome" pageTitle="Welcome">
      <div className="welcome-container">
        <div className="welcome-content">
          <img
            src={`${import.meta.env.BASE_URL}images/logo_konten_wrlcome3.svg`}
            alt="LACT Icon"
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