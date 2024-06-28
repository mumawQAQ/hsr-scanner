import { Route, Routes } from 'react-router-dom';

import RelicRuleCreateEdit from '@/components/panel/relic-tool-panel/relic-rule-create-edit.tsx';
import RelicRuleTemplateList from '@/components/panel/relic-tool-panel/relic-rule-template-list.tsx';
import RelicToolNavbar from '@/components/panel/relic-tool-panel/relic-tool-navbar.tsx';

const RelicToolPanel = () => {
  return (
    <div>
      <RelicToolNavbar />
      <Routes>
        <Route index element={<RelicRuleTemplateList />} />
        <Route path="createEdit/:templateId" element={<RelicRuleCreateEdit />} />
      </Routes>
    </div>
  );
};

export default RelicToolPanel;
