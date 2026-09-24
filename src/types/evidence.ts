export interface ProjectData {
  proyek: string;
  kontrak: string;
  suratPesanan: string;
  district: string;
  lokasi: string;
  pelaksana: string;
}

// Satu item evidence = satu foto + keterangan yang bisa diisi/diubah bebas oleh user
export interface EvidenceItem {
  id: string;
  label: string;
  dataUrl: string | null;
}

// Dipakai hanya untuk daftar SARAN awal (default) saat halaman dibuka pertama kali
export interface DefaultEvidenceItem {
  id: string;
  label: string;
}