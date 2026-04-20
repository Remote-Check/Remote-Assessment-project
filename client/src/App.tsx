import { BatteryPlayer } from './components/BatteryPlayer';
import type { BatteryManifest } from './types/battery';

const MOCA_MANIFEST: BatteryManifest = {
  id: 'moca-hebrew-v1',
  version: '1.0',
  steps: [
    { id: 'orientation', type: 'orientation', titleKey: 'orientation.title' },
    { id: 'memory', type: 'moca-memory', titleKey: 'memory.title' },
  ],
};

function App() {
  return <BatteryPlayer manifest={MOCA_MANIFEST} />;
}

export default App;
