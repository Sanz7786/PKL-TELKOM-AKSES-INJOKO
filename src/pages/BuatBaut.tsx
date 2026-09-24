import EvidenceForm from '../components/EvidenceForm';
import type { DefaultEvidenceItem } from '../types/evidence';

// Label sengaja dikosongkan; user mengetik sendiri nama evidence-nya
// lewat placeholder "Ketik disini" di form.
const bautDefaultItems: DefaultEvidenceItem[] = [
  { id: 'evidence-1', label: '' },
  { id: 'evidence-2', label: '' },
  { id: 'evidence-3', label: '' },
  { id: 'evidence-4', label: '' },
];

export default function BuatBaut() {
  return (
    <EvidenceForm
      docTitle="BAUT"
      pageTitle="Buat BAUT"
      activeMenu="baut-builder"
      defaultItems={bautDefaultItems}
    />
  );
}