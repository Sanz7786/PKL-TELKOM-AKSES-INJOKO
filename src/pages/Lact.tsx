import EvidenceForm from '../components/EvidenceForm';
import type { DefaultEvidenceItem } from '../types/evidence';

// Label sengaja dikosongkan; user mengetik sendiri nama evidence-nya
// lewat placeholder "Ketik disini" di form.
const lactDefaultItems: DefaultEvidenceItem[] = [
  { id: 'evidence-1', label: '' },
  { id: 'evidence-2', label: '' },
  { id: 'evidence-3', label: '' },
  { id: 'evidence-4', label: '' },
  { id: 'evidence-5', label: '' },
  { id: 'evidence-6', label: '' },
];

export default function Lact() {
  return (
    <EvidenceForm
      docTitle="LACT"
      pageTitle="Buat LACT"
      activeMenu="lact-builder"
      defaultItems={lactDefaultItems}
    />
  );
}