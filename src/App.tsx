import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { NavigationItem } from '@/components/navigation/navigation-item.tsx';
import RelicToolPanel from '@/components/panel/relic-tool-panel.tsx';
import ScanPanel from '@/components/panel/scan-panel/scan-panel.tsx';

const App = () => {
  return (
    <Router>
      <div className="flex h-full">
        <div className="fixed flex h-full w-44 flex-col justify-center gap-2 p-6 shadow-xl">
          <NavigationItem path="/" text="扫描工具" />
          <NavigationItem path="/relic-tools" text="遗器规则工具" />
        </div>
        <div className="ml-44 flex-1 p-6">
          <Routes>
            <Route path="/" element={<ScanPanel />} />
            <Route path="/relic-tools" element={<RelicToolPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
