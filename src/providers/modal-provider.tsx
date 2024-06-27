import RelicCreateTemplateModal from '@/components/modal/relic-create-template-modal.tsx';
import RelicRuleTemplateInModal from '@/components/modal/relic-rule-template-in-modal.tsx';

export const ModalProvider = () => {
  return (
    <>
      <RelicCreateTemplateModal />
      <RelicRuleTemplateInModal />
    </>
  );
};
