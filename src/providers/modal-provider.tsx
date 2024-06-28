import ImportQRCodeModal from '@/components/modal/import-qr-code-modal.tsx';
import RelicCreateTemplateModal from '@/components/modal/relic-create-template-modal.tsx';
import RelicRuleTemplateInModal from '@/components/modal/relic-rule-template-in-modal.tsx';
import RelicRuleTemplateOutModal from '@/components/modal/relic-rule-template-out-modal.tsx';

export const ModalProvider = () => {
  return (
    <>
      <RelicCreateTemplateModal />
      <RelicRuleTemplateInModal />
      <RelicRuleTemplateOutModal />
      <ImportQRCodeModal />
    </>
  );
};
