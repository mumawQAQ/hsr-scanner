'use client';
import InstallRequirementModal from '@/app/components/modal/install-requirement-modal';
import SelectTemplateModal from '@/app/components/modal/select-template-modal';
import CreateTemplateModal from '@/app/components/modal/create-template-modal';

export const ModalProvider = () => {
  return (
    <>
      <InstallRequirementModal />
      <SelectTemplateModal />
      <CreateTemplateModal />
    </>
  );
};
