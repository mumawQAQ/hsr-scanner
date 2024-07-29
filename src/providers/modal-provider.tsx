import ImportRelicTemplateModal from '@/components/modal/import-relic-template-modal.tsx';
import InstallRequirementModal from '@/components/modal/install-requirement-modal.tsx';
import RelicCreateTemplateModal from '@/components/modal/relic-create-template-modal.tsx';
import RelicRuleTemplateInModal from '@/components/modal/relic-rule-template-in-modal.tsx';
import UpdateModal from '@/components/modal/update-modal.tsx';

export const ModalProvider = () => {
  return (
    <>
      <InstallRequirementModal />
      <RelicCreateTemplateModal />
      <RelicRuleTemplateInModal />
      <ImportRelicTemplateModal />
      <UpdateModal />
    </>
  );
};
