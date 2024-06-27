import { Route, Routes } from 'react-router-dom';

import RelicRuleCreate from '@/components/panel/relic-tool-panel/relic-rule-create.tsx';
import RelicRuleEdit from '@/components/panel/relic-tool-panel/relic-rule-edit.tsx';
import RelicRuleTemplateList from '@/components/panel/relic-tool-panel/relic-rule-template-list.tsx';
import RelicToolNavbar from '@/components/panel/relic-tool-panel/relic-tool-navbar.tsx';

const RelicToolPanel = () => {
  return (
    <div>
      <RelicToolNavbar />
      <Routes>
        <Route index element={<RelicRuleTemplateList />} />
        <Route path="edit/:templateId" element={<RelicRuleEdit />} />
        <Route path="create/:templateId" element={<RelicRuleCreate />} />
      </Routes>
    </div>
  );
};

export default RelicToolPanel;
