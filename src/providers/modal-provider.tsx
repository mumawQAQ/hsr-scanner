import RelicRuleTemplateInModal from '@/components/modal/relic-rule-template-in-modal.tsx';
import RelicRuleTemplateOutModal from '@/components/modal/relic-rule-template-out-modal.tsx';

export const ModalProvider = () => {
  return (
    <>
      <RelicRuleTemplateOutModal />
      <RelicRuleTemplateInModal />
    </>
  );
};
